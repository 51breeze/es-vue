const JSXTransform = require('./JSXTransform');
const Core = require('./Core');
const UseVueContext = new Map();
const toUpperCaseFirst=(str)=>{
    return str.substring(0,1).toUpperCase()+str.substring(1);
}
class JSXTransformV3 extends JSXTransform{
    makeConfig(data){
        const items = [];
        const config = this.getElementConfig();
        const isSsr = !!this.plugin.options.ssr;
        Object.entries(data).map( item=>{
            const [key, value] = item;
            if( !config.hasOwnProperty(key) )return;
            if( key ==='slot' || key==='scopedSlots' || key==='directives' || key==='keyProps'){
                return;
            }
            if( value ){
                if( Array.isArray(value) ){
                    if( value.length > 0 ){
                        const isObject = value[0].type ==='Property';
                        if( isObject ){
                            if( key==='props'||key==='attrs' ){
                                items.push( ...value );
                                return;
                            }else if( key==='on' ){
                                if(isSsr)return;
                                value.forEach( item=>{
                                    if( item.type ==='Property' ){
                                        if( item.computed ){
                                            this.addDepend( this.builder.getGlobalModuleById('System') );
                                            const template = this.createNode('TemplateLiteral');
                                            const ele = this.createNode('TemplateElement');
                                            const callee= this.createCalleeNode(
                                                this.createMemberNode([
                                                    this.createIdentifierNode('System'),
                                                    this.createIdentifierNode('firstUpperCase')
                                                ]),
                                                [
                                                    item.key
                                                ]
                                            );
                                            ele.value = 'on';
                                            ele.parent = template;
                                            callee.parent = template;
                                            template.parent = item;
                                            template.expressions = [ callee ];
                                            template.quasis=[ele];
                                            item.key.parent = template;
                                            item.key = template;
                                        }else{
                                            item.key.value = 'on'+toUpperCaseFirst(item.key.value);
                                        }
                                        items.push( item );
                                    }
                                });
                                return;
                            }
                            items.push( this.createPropertyNode( this.createIdentifierNode(key), this.createObjectNode(value) ) );
                        }else{
                            items.push( this.createPropertyNode( this.createIdentifierNode(key), this.createArrayNode(value) ) );
                        }
                    }
                }else{
                    if( value.type ==="Property"){
                        items.push( value );
                    }else{
                        items.push( this.createPropertyNode( this.createIdentifierNode(key), value) ); 
                    }
                }
            }
        });
        return items.length > 0 ? this.createObjectNode(items) : null;
    }

    makeDirectives(child, element, prevResult){
        if( element && element.type ==='Literal'){
            element = this.createVueTextVNodeNode(element);
        }
        if( !element )return null;
        const cmd=[];
        let content = [element];
        if( !child.directives || !(child.directives.length > 0) ){
            return {cmd,child,content};
        }
        const directives = child.directives.slice(0).sort( (a,b)=>{
            const bb = b.name.value().toLowerCase();
            const aa = a.name.value().toLowerCase();
            const v1 = bb === 'each' || bb ==="for" ? 1 : 0;
            const v2 = aa === 'each' || aa ==="for" ? 1 : 0;
            return v1 - v2;
        });

        while( directives.length > 0){
            const directive = directives.shift();
            const name = directive.name.value().toLowerCase();
            const valueArgument = directive.valueArgument;
            if( name ==="each" || name ==="for" ){
                let refs = this.createToken(valueArgument.expression);
                let item = valueArgument.declare.item;
                let key = valueArgument.declare.key || 'key';
                let index = valueArgument.declare.index;
                if( name ==="each"){
                    content[0] = this.createIterationNode(name, refs , this.checkRefsName('_refs'), content[0], item, key);
                }else{
                    content[0] = this.createIterationNode(name, refs , this.checkRefsName('_refs'), content[0], item, key, index );
                }
                content[0].isForNode = true;
                cmd.push(name);

            }else if( name ==="if" ){
                const node = this.createNode('ConditionalExpression');
                node.test = this.createToken(valueArgument.expression);
                node.consequent = content[0];
                content[0] = node;
                cmd.push(name);
            }else if( name ==="elseif" ){
                if( !prevResult || !(prevResult.cmd.includes('if') || prevResult.cmd.includes('elseif')) ){
                    directive.name.error(1114, name);
                }else{
                    cmd.push(name);
                }
                const node = this.createNode('ConditionalExpression');
                node.test = this.createToken(valueArgument.expression);
                node.consequent = content[0];
                content[0]=node;
            }else if( name ==="else"){
                if( !prevResult || !(prevResult.cmd.includes('if') || prevResult.cmd.includes('elseif')) ){
                    directive.name.error(1114, name);
                }else{
                    cmd.push(name);
                }
            }
        }
        return {cmd,child,content};
    }

    makeChildren(children,data){
        const content = [];
        let len = children.length;
        let index = 0;
        let last = null;
        let result = null;
        data.defineSlots = {};
        const next = ()=>{
            if( index<len ){
                const child = children[index++];
                const elem = this.makeDirectives(child, this.createToken(child) , last) || next();
                if( child.hasAttributeSlot ){
                    const attributeSlot = child.openingElement.attributes.find(attr=>attr.isAttributeSlot);
                    if( attributeSlot ){

                        const name = attributeSlot.name.value();
                        const scopeName = attributeSlot.value ? attributeSlot.value.value() : null;
                        let childrenNodes = elem.content;
                        if( childrenNodes.length ===1 && childrenNodes[0].type ==="ArrayExpression" ){
                            childrenNodes = childrenNodes[0];
                        }else{
                            childrenNodes = this.createArrayNode(childrenNodes);
                        }
                        const params = scopeName ? [ this.createAssignmentNode(this.createIdentifierNode(scopeName),this.createObjectNode()) ] : [];
                        const renderSlots= this.createSlotCalleeNode(
                            child, 
                            this.createLiteralNode(name), 
                            this.createArrowFunctionNode(params,childrenNodes)
                        );

                        if( scopeName ){
                            data.defineSlots[name] = {
                                node:renderSlots,
                                scope:scopeName,
                                child
                            }
                        }else{
                            data.defineSlots[name] = {
                                node:renderSlots,
                                scope:null,
                                child
                            }
                        }
                        return next();
                    }
                }else if( child.isSlot && !child.isSlotDeclared ){
                    const name = child.openingElement.name.value();
                    if( child.attributes.length > 0 && child.attributes[0].value ){
                        data.defineSlots[name] = {
                            node:elem.content[0],
                            scope:child.attributes[0].value.value(),
                            child
                        }
                    }else{
                        data.defineSlots[name] = {
                            node:elem.content[0],
                            scope:null,
                            child
                        }
                    }
                    return next();
                }else if( child.isDirective ){
                    elem.cmd.push( child.openingElement.name.value().toLowerCase() )
                    // let current = elem;
                    // let valueGroup = [];
                    // current.cmd.push( child.openingElement.name.value() )
                    // while(true){
                    //     const maybeChild = index < len && children[index].isDirective ? children[index++] : null;
                    //     const maybe=  maybeChild ? this.makeDirectives(maybeChild, this.createToken(maybeChild) , current) : null;
                    //     const hasIf = current.cmd.includes('if');
                    //     const isDirective = maybe && maybe.child.isDirective;
                    //     if( isDirective ){
                    //         maybe.cmd.push( maybeChild.openingElement.name.value() );
                    //     }
                    //     if( hasIf ){
                    //         if( isDirective && maybe.cmd.includes('elseif') ){
                    //             maybe.cmd = current.cmd.concat( maybe.cmd );
                    //             maybe.content = current.content.concat( maybe.content );
                    //         }else if( isDirective && maybe.cmd.includes('else') ){
                    //             valueGroup.push( this.cascadeConditionalNode( current.content.concat( maybe.content ) ) );
                    //             maybe.ifEnd = true;
                    //         }else{
                    //             if(maybe)maybe.ifEnd = true;
                    //             current.content.push( this.createVueCommentVNodeNode('end if') );
                    //             valueGroup.push( this.cascadeConditionalNode( current.content ) );
                    //         }
                    //     }else if( !current.ifEnd ){
                    //         valueGroup.push( ...current.content );
                    //     }
                    //     if( maybe ){
                    //         current = maybe;
                    //     }
                    //     if( !isDirective ){
                    //         break;
                    //     }
                    // }
                    // current.content = valueGroup;
                    // current.cmd.length = 0;
                    // delete current.ifEnd;
                    // return current;
                }
                return elem;
            }
            return null;
        }

        const push = (data, value)=>{
            if( value ){
                if( Array.isArray(value) ){
                    data.push( ...value );
                }else{
                    data.push( value );
                }
            }
        }

        var hasComplex = false;
        
        while(true){
            result = next();
            if( last ){
                let value = null;
                const hasIf = last.cmd.includes('if');
                if( hasIf ){
                    if( result && result.cmd.includes('elseif') ){
                        result.cmd = last.cmd.concat( result.cmd );
                        result.content = last.content.concat( result.content );
                    }else if(result && result.cmd.includes('else') ){
                        value = this.cascadeConditionalNode( last.content.concat( result.content ) );
                        result.ifEnd = true;
                    }else{
                        if(result)result.ifEnd = true;
                        last.content.push( this.createVueCommentVNodeNode('end if') );
                        value = this.cascadeConditionalNode( last.content );
                    }
                }else if( !( last.ifEnd && last.cmd.includes('else') ) ) {
                    value = last.content;
                }

                const complex = last.child.isJSXExpressionContainer ? !!(last.child.expression.isMemberExpression || last.child.expression.isCallExpression) : false;
                if(last.child.isJSXExpressionContainer){
                    data.hasDynnmicChild = true;
                }
                if( last.cmd.includes('each') || last.cmd.includes('for') || last.child.isSlot || last.child.isDirective || complex ){
                    hasComplex = true;
                }
                push(content, value);
            }
            last = result;
            if( !result )break;
        }

        if( !content.length )return null;
        if( hasComplex ){

            var first = content[0];
            if( content.length === 1 && (first.type == 'ArrayExpression' || first.isForNode || first.isSlotNode) ){
                return first;
            }

            var base =  content.length > 1 ? content.shift() : this.createArrayNode();
            if( base.type !== 'ArrayExpression' && !base.isForNode ){
                base = this.createArrayNode([base]);
                base.newLine = true;
            }

            const node = this.createCalleeNode( 
                this.createMemberNode([
                    base,
                    this.createIdentifierNode('concat')
                ]),
                content.reduce(function(acc, val){
                    if( val.type === 'ArrayExpression' ){
                        return acc.concat( ...val.elements );
                    }else{
                        return acc.concat(val)
                    }
                },[])
            );
            node.newLine = true;
            node.indentation = true; 
            return node;
        }

        const node = this.createArrayNode( content );
        if( content.length > 1 || !(content[0].type ==="Literal" || content[0].type ==="Identifier") ){
            node.newLine = true;
        }
        return node;
    }

    createBlockStatementNode( body ){
        const block = this.createNode('BlockStatement');
        block.body = body || [];
        block.body.forEach( node=>{
            node.parent = block;
        })
        return block;
    }

    getVueImportContext(name){
        const target = this.module || this.compilation;
        let context = UseVueContext.get(target);
        if( !context ){
            UseVueContext.set( target, context = new Map());
        }
        if( context.has(name) ){
            return context.get(name);
        }
        const value = this.checkRefsName(name, true, Core.Token.SCOPE_REFS_All, null, false);
        context.set(name, value);
        return value;
    }

    createVueTextVNodeNode( textNode ){
        return this.createCalleeNode(
            this.createIdentifierNode( this.getVueImportContext('createTextVNode') ),
            [
                textNode
            ]
        );
    }

    createVueCommentVNodeNode(text){
        return this.createCalleeNode(
            this.createIdentifierNode( this.getVueImportContext('createCommentVNode') ),
            [
                this.createLiteralNode(text)
            ]
        );
    }

    createSlotCalleeCtxNode(children, scope){
        return this.createCalleeNode( 
            this.createIdentifierNode( this.getVueImportContext('withCtx') ), 
            [
                this.createArrowFunctionNode( scope ? [this.createIdentifierNode(scope)] : [], children ),
                this.createCalleeNode(
                    this.createMemberNode([
                        this.createThisNode(),
                        this.createIdentifierNode('getAttribute')
                    ]),
                    [
                        this.createLiteralNode('instance')
                    ]
                )
            ]
        );
    }

    createWithCtxNode(node){
        return this.createCalleeNode( 
            this.createIdentifierNode( this.getVueImportContext('withCtx') ), 
            [
                node
            ]
        );
    }

    createResolveDirectiveNode( directiveName ){
        return this.createCalleeNode( 
            this.createIdentifierNode( 
                this.getVueImportContext('resolveDirective') 
            ),
            [
              typeof directiveName ==='string' ?  this.createLiteralNode(directiveName) : directiveName
            ]
        )
    }

    createDirectiveNode(name, expression, ...args){
        const elems = [
            typeof name ==='string'? this.createIdentifierNode(this.getVueImportContext(name)) : name,
            expression
        ];
        elems.push( ...args );
        return this.createArrayNode( elems );
    }

    // createAttriubeDirectives(attr, data){
    //     if(!attr.value)return;
    //     const expression =  this.createToken(attr.value);
    //     const arrayNode = this.createArrayNode([ 
    //         this.createRuntimeResolveDirectiveNode(this.createMemberNode([
    //             this.createIdentifierNode('data'),this.createIdentifierNode('name')
    //         ])),
    //         this.createMemberNode([this.createIdentifierNode('data'),this.createIdentifierNode('value')]),
    //         this.createLiteralNode(""),
    //         this.createMemberNode([this.createIdentifierNode('data'),this.createIdentifierNode('modifier')])
    //     ]);
    //     arrayNode.newLine = true;
    //     const node = this.createArrowFunctionNode(
    //         [this.createIdentifierNode('data')],
    //         arrayNode
    //     );
    //     data.directives.push(
    //         this.createCalleeNode(this.createParenthesNode(node), [expression])
    //     );
    // }

    createWithDirectivesNode(node, directives){
        const array = this.createArrayNode( directives );
        array.newLine=true;
        return this.createCalleeNode( 
            this.createIdentifierNode(this.getVueImportContext('withDirectives')),
            [
                node,
                array
            ]
        );
    }

    createImportVueContextReferenceNode(){
        const target = this.module || this.compilation;
        let context = UseVueContext.get(target);
        if( !context || !(context.size > 0) )return;
        const source = 'vue';
        this.builder.addImportReference( 
            this.module, 
            source,
            this.createImportDeclaration( 
                this.builder.getSourceFileMappingFolder(source,true),
                Array.from( context.entries() ).map( item=>{
                    return [item[1],item[0]]
                })
            )
        );
    }

    makeAttributes(stack, childNodes, data, spreadAttributes){
        const pushEvent=(name,callback, category)=>{
            const events =  data[ category ] || (data[ category ]=[]);
            const property = this.createPropertyNode(name, callback);
            if( property.key.computed ){
                property.computed = true;
                property.key.computed = false;
            }
            events.push( property );
        }
        const isComponent = stack.isComponent || stack.isWebComponent;
        const nodeType = !isComponent ? stack.openingElement.name.value().toLowerCase() : null;
        let binddingModelValue = null;
        let binddingModelName = null;
        let afterDirective = null;
        let custom = null;
        if( nodeType ==="input" ){
            afterDirective='vModelText';
        }else if( nodeType ==="select" ){
            afterDirective = 'vModelSelect';
        }else if( nodeType ==="textarea" ){
            afterDirective = 'vModelText';
        }

        const createGetEventValueNode = ()=>{
            return this.createCalleeNode(
                this.createMemberNode([
                    this.createThisNode(), 
                    this.createIdentifierNode('getBindEventValue')
                ]),
                [
                    this.createIdentifierNode('e')
                ]
            );
        }

        const forStack = stack.getParentStack(stack=>{
            return stack.scope.isForContext || !(stack.isJSXElement || stack.isJSXExpressionContainer)
        },true);
        const inFor = forStack && forStack.scope && forStack.scope.isForContext ? true : false;
        stack.openingElement.attributes.forEach(item=>{
            if( item.isAttributeXmlns || item.isAttributeDirective ){
                if( item.isAttributeDirective ){
                    const name = item.name.value();
                    if( name === 'show'){
                        data.directives.push(
                            this.createDirectiveNode('vShow', this.createToken( item.valueArgument.expression ) )
                        );
                    }else if( name === 'custom' ){
                        this.createAttriubeCustomDirective(item, data);
                    }
                }
                return;
            }else if( item.isJSXSpreadAttribute ){
                spreadAttributes && spreadAttributes.push( this.createToken( item ) );
                return;
            }else if( item.isAttributeSlot ){
                return;
            }

            let value = this.createToken( item );
            if( !value )return;

            let ns = value.namespace;
            let name = value.name.value;
            let propName = name;
            let propValue = value.value;
            let attrLowerName = name.toLowerCase();

            if( (ns ==="@events" || ns ==="@natives") && name.includes('-') ){
                name = name.replace(/-([a-z])/g, (a,b)=>b.toUpperCase());
            }

            if( ns && ns.includes('::') ){
                let [seg, className] = ns.split('::',2);
                ns = seg;
                const moduleType = stack.getModuleById(className);
                const moduleClass = this.getModuleReferenceName( moduleType );
                this.addDepend( moduleType );
                name = this.createMemberNode([
                    this.createIdentifierNode( moduleClass ),
                    name
                ], name);
                name.computed = true;
                custom = name;
            }

            let isDOMAttribute = false;
            if( item.isMemberProperty ){
                let attrDesc = item.getAttributeDescription( stack.getSubClassDescription() );
                if( attrDesc ){
                    isDOMAttribute = attrDesc.annotations.some( item=>item.name.toLowerCase() === 'domattribute' );
                }
            }

            if( ns ==="@events" ){
                pushEvent( name, this.makeAttributeBindEventFunctionNode(item, propValue), 'on')
                return;
            }else if( ns ==="@natives" ){
                pushEvent( name, this.makeAttributeBindEventFunctionNode(item, propValue), 'on')
                return;
            }else if( ns ==="@binding" ){
                binddingModelValue = propValue;
                if( !binddingModelValue || !(binddingModelValue.type ==='MemberExpression' || binddingModelValue.type ==='Identifier') ){
                    binddingModelValue = null;
                }
            }
            
            if( item.isMemberProperty ){

                if( ns ==="@binding" && attrLowerName ==='value'){
                    data.props.push( this.createPropertyNode( this.createPropertyKeyNode(propName, value.name.stack ), propValue ) );
                    propName = 'modelValue';
                }

                if( !isDOMAttribute ){
                    data.props.push( this.createPropertyNode( this.createPropertyKeyNode(propName, value.name.stack ), propValue ) );
                    if( ns !=="@binding" )return;
                }
            }

            if( attrLowerName === 'type' && nodeType ==="input" && propValue  && propValue.type ==="Literal"){
                const value = propValue.value.toLowerCase();
                if( value ==='checkbox' ){
                    afterDirective = 'vModelCheckbox';
                }else if( value ==='radio' ){
                    afterDirective='vModelRadio';
                }
            }

            if( ns ==="@binding" ){
                if( custom && binddingModelValue ){
                    pushEvent(custom , this.createArrowFunctionNode(
                        [this.createIdentifierNode('e')], 
                        this.createAssignmentNode(
                            binddingModelValue, 
                            createGetEventValueNode()
                        )
                    ), 'on');
                    return;
                }else if( (stack.isWebComponent || afterDirective) && binddingModelValue ){
                    if( propName ==='modelValue' ){
                        pushEvent(
                            this.createLiteralNode('onUpdate:modelValue', void 0, value.name.stack),
                            this.createArrowFunctionNode(
                                [
                                    this.createIdentifierNode('value')
                                ], 
                                this.createAssignmentNode(
                                    binddingModelValue,
                                    this.createIdentifierNode('value')
                                )
                            ),
                            'props'
                        );
                    }else{
                        const type = propName.replace(/-(a-zA-Z)/g,(a,b)=>b.toUpperCase());
                        pushEvent(
                            this.createIdentifierNode(type, void 0, value.name.stack),
                            this.createArrowFunctionNode(
                                [
                                    this.createIdentifierNode('e')
                                ], 
                                this.createAssignmentNode(
                                    binddingModelValue,
                                    createGetEventValueNode()
                                )
                            ),
                            'on'
                        );
                        return;
                    }
        
                }else if( binddingModelValue ){
                    pushEvent(this.createIdentifierNode('input') , this.createArrowFunctionNode(
                        [this.createIdentifierNode('e')], 
                        this.createAssignmentNode(
                            binddingModelValue, 
                            createGetEventValueNode()
                        )
                    ), 'on');
                }
        
                if( afterDirective && binddingModelValue ){
                    data.directives.push(
                        this.createDirectiveNode(afterDirective, binddingModelValue)
                    );
                }

                return;
            }

            if( attrLowerName ==='ref'){
                if( inFor ){
                    propValue = this.createArrowFunctionNode(
                        [this.createIdentifierNode('node')], 
                        this.createCalleeNode(
                            this.createMemberNode([
                                this.createThisNode(),
                                this.createIdentifierNode('setRefNode')
                            ]),
                            [
                                value.value,
                                this.createIdentifierNode('node'),
                                this.createLiteralNode( inFor )
                            ]
                        )
                    );
                }
            }

            const property = this.createPropertyNode( this.createPropertyKeyNode(propName, value.name.stack), propValue );
            switch(name){
                case "class" :
                case "style" :
                case "key" :
                case "tag" :
                case "staticStyle" :
                case "staticClass" :
                    data[name] = property
                    break;
                case "innerHTML" :
                    data.attrs.push( property );
                    break;
                case "ref" :
                    data[name] = property
                break;
                case "value" :
                default:
                    data.attrs.push( property );
            }
        });

        const fillKey = this.plugin.options.fillKey;
        const fillFor = fillKey === 'for' ? true : false;
        const fillAll = fillFor ? false : !!fillKey;
        if( !data.key && (fillFor||fillAll)){
            const getAt = (stack)=>{
                let parentStack = stack.parentStack;
                while(parentStack){
                    if(parentStack.isJSXElement || parentStack.isJSXExpressionContainer || parentStack.isMethodDefinition || parentStack.isProgram)break;
                    parentStack = parentStack.parentStack;
                }
                if( parentStack && (parentStack.isDirective  || parentStack.isSlot || parentStack.isJSXExpressionContainer) ){
                    const index = stack.childIndexAt;
                    const prefix = getAt(parentStack);
                    return prefix ? prefix+'.'+index : index;
                }
                return stack.childIndexAt;
            }

            if( inFor ){
                let key;
                let isForContext = false
                if( !stack.isDirective && stack.directives ){
                    const directive = stack.directives.find( directive=>['for','each'].includes(directive.name.value()) );
                    if( directive ){
                        isForContext = true;
                        const valueArgument = directive.valueArgument;
                        key = valueArgument.declare.index || valueArgument.declare.key;
                    }
                }
                if( !isForContext && stack.parentStack.isDirective && ['for','each'].includes(stack.parentStack.openingElement.name.value())){
                    isForContext = true;
                    const attrs = stack.parentStack.openingElement.attributes;
                    const argument = {};
                    attrs.forEach( attr=>{
                        argument[ attr.name.value() ] = attr.value.value();
                    });
                    key = argument['index'] ||  argument['key'];
                }
                if( isForContext ){
                    const binary = this.createNode('BinaryExpression');
                    binary.left = binary.createLiteralNode( String(getAt(stack))+'.' );
                    binary.right = binary.createIdentifierNode( key || 'key');
                    binary.operator = '+';
                    data.key = this.createPropertyNode( this.createIdentifierNode('key'), binary );
                }else if(!fillFor){
                    data.key = this.createPropertyNode( this.createIdentifierNode('key'),  this.createLiteralNode( getAt(stack) ) ); 
                }
            }else if(!fillFor){
                data.key = this.createPropertyNode( this.createIdentifierNode('key'),  this.createLiteralNode( getAt(stack) ) ); 
            }
        }
    }

    createSlotCalleeNode(...args){
        const node= this.createCalleeNode(
            this.createMemberNode([
                this.createThisNode(), 
                this.createIdentifierNode('slot')
            ]),
            args
        );
        node.isSlotNode = true;
        return node;
    }

    createSlotCalleeNode(stack,...args){
        if( stack.isSlot && stack.isSlotDeclared){
            const slots = this.createCalleeNode( 
                this.createMemberNode([
                    this.createThisNode(),this.createIdentifierNode('getAttribute')
                ]),
                [
                    this.createLiteralNode('slots')
                ]
            );
            const node= this.createCalleeNode(
                this.createCalleeVueApiNode('renderSlot'),
                [slots].concat(args)
            );
            return node;
        }else{
            const node= this.createCalleeNode(
                this.createMemberNode([
                    this.createThisNode(), 
                    this.createIdentifierNode('slot')
                ]),
                args
            );
            node.isSlotNode = true;
            return node;
        }
    }

    makeSlotElement(stack , children){
        const openingElement = this.createToken(stack.openingElement);
        let props = null;
        let params = [];
        if( stack.isSlotDeclared ){
            if( openingElement.attributes.length > 0 ){
                props = openingElement.attributes[0].value;
                const attribute = stack.openingElement.attributes[0];
                params.push( this.createAssignmentNode(this.createIdentifierNode(attribute.name.value()),this.createObjectNode()) );
            }else{
                props = this.createObjectNode();
            }
        }else if( stack.openingElement.attributes.length > 0 ){
            const attribute = stack.openingElement.attributes[0];
            if( attribute.value ){
                params.push( this.createAssignmentNode(this.createIdentifierNode(attribute.value.value()),this.createObjectNode()) );
            }
        }
        const args = [stack, openingElement.name];
        let len = 2;

        if( props ){
            len = 3;
            args.push( props );
        }

        if( children ){
            len = props ? 4 : 3;
            args.push( this.createArrowFunctionNode(params,children) );
        }

        args.length = len;
        return this.createSlotCalleeNode(...args);
    }

    createCalleeVueApiNode( name ){
        return this.createIdentifierNode( 
            this.getVueImportContext(name)
        );
    }

    createRuntimeResolveDirectiveNode( value ){
        const resolve = this.createCalleeNode( 
            this.createMemberNode([
                this.createIdentifierNode('Component'),
                this.createIdentifierNode('resolveDirective')
            ]),[
                value
            ]
        );
        this.addDepend( this.builder.getModuleById('web.components.Component') );
        return resolve;
    }

    // createCustomDirective(stack, data){  
    //     const props = [null,null,null,null];
    //     stack.openingElement.attributes.forEach( attr=>{
    //         const name = attr.name.value();
    //         if( name ==='name'){
    //             const value = attr.value && attr.value.isJSXExpressionContainer ? attr.value.expression : attr.value;
    //             if( value ){
    //                 if( value.isLiteral ){
    //                     props[0] = this.createResolveDirectiveNode( this.createToken(value) );
    //                 }else{
    //                     props[0] = this.createRuntimeResolveDirectiveNode( this.createToken(value) );
    //                 }
    //             }
    //         }else if( name==="value" ){
    //             props[1] = attr.value ? this.createToken(attr.value) : this.createLiteralNode(true);
    //             let exp = null;
    //             if( attr.value ){
    //                 exp = attr.value.isJSXExpressionContainer ? attr.value.expression.value() :  attr.value.value();
    //             }
    //         }else if( name==="modifier" && attr.value ){
    //             props[3] = this.createToken(attr.value);
    //         }
    //     });
    //     while( props[ props.length-1 ] === null ){
    //         props.pop();
    //     }
    //     if( props.length > 0 ){
    //         if( props[1] === null ){
    //             props[1] = this.createLiteralNode(true);
    //         }
    //         data.directives.push(
    //             this.createArrayNode(
    //                 props.map( prop=>prop === null ? this.createLiteralNode(null) : prop ) 
    //             )
    //         );
    //     }

    //     if( stack.parentStack && stack.parentStack.isDirective ){
    //         let dName = stack.parentStack.openingElement.name.value().toLowerCase();
    //         if( dName ==="custom" ){
    //             this.createCustomDirective(stack.parentStack, data);
    //         }
    //     }
    // }

    // makeDirectiveComponentProperties(stack, data, callback){
    //     if( stack && stack.parentStack ){
    //         const parentIsComponentDirective = this.getComponentDirectiveForDefine( stack.parentStack );
    //         if(parentIsComponentDirective){
    //             const keyProps = data.keyProps || (data.keyProps = []);
    //             const desc = stack.parentStack.description();
    //             this.addDepend( desc );
    //             let expression = null;
    //             let modifier = null;
    //             let directive = this.createIdentifierNode( this.getModuleReferenceName( desc ) );
    //             stack.parentStack.attributes.forEach( item=>{
    //                 let name = item.name.value();
    //                 let lower = name.toLowerCase();
    //                 if(lower === 'value'){
    //                     expression = item.value ? this.createToken(item.value) : this.createLiteralNode(false);
    //                     return;
    //                 }
    //                 if(lower === 'modifier'){
    //                     modifier = item.value ? this.createToken(item.value) : this.createObjectNode();
    //                     return;
    //                 }
    //                 if( item.isMemberProperty ){
    //                     let attrDesc = item.getAttributeDescription( stack.parentStack.getSubClassDescription() );
    //                     if( attrDesc ){
    //                         const alias = attrDesc.annotations.find( item=>item.name.toLowerCase() === 'alias' );
    //                         if( alias ){
    //                             const args = alias.getArguments();
    //                             if( args.length > 0 && args[0].value ){
    //                                 name = args[0].value;
    //                             }
    //                         }
    //                     }
    //                 }
    //                 const property = this.createPropertyNode( 
    //                     this.createPropertyKeyNode(name, item.name),  
    //                     item.value ? this.createToken(item.value) : this.createLiteralNode(true)
    //                 );
    //                 data.attrs.push( property );
    //                 if(callback)callback(name, item);
    //                 keyProps.push( this.createLiteralNode(name, void 0, item.name) );
    //             });
    //             const args = [
    //                 directive,
    //                 expression
    //             ];
    //             if( modifier ){
    //                 args.push( this.createLiteralNode('""') );
    //                 args.push( modifier );
    //             }
    //             data.directives.push(
    //                 this.createDirectiveNode(...args)
    //             );
    //             this.makeDirectiveComponentProperties(stack.parentStack, data);
    //             return true
    //         }
    //     }
    //     return false;
    // }

    create(stack){
        const isRoot = stack.jsxRootElement === stack;
        const data = this.getElementConfig();
        const children = stack.children.filter(child=>!( (child.isJSXScript && child.isScriptProgram) || child.isJSXStyle) );
        let componentDirective = this.getComponentDirectiveForDefine( stack );
        let childNodes =this.makeChildren(children, data);

        if( stack.isDirective && stack.openingElement.name.value().toLowerCase() ==="custom" ){
            componentDirective = true;
        }

        if( componentDirective ){
            return childNodes;
        }

        if(stack.parentStack && stack.parentStack.isDirective ){
            let dName = stack.parentStack.openingElement.name.value().toLowerCase();
            if( dName === 'show' ){
                const condition= stack.parentStack.openingElement.attributes[0];
                data.directives.push(
                    this.createDirectiveNode('vShow', this.createToken( condition.parserAttributeValueStack() ) )
                );
            }else if( dName ==="custom" ){
                this.createCustomDirective(stack.parentStack, data);
            }
        }
       
        const spreadAttributes = [];
        this.makeDirectiveComponentProperties(stack, data);
        this.makeAttributes(stack, childNodes, data, spreadAttributes);
        this.makeProperties(children, data);
        this.makeSpreadAttributes(spreadAttributes, data);
        
        const isWebComponent = stack.isWebComponent && !(stack.compilation.JSX && stack.parentStack.isProgram)
        if( isWebComponent ){
            const properties = []
            if( childNodes ){
                properties.push( this.createPropertyNode(
                    this.createIdentifierNode('default'), 
                    this.createWithCtxNode(this.createArrowFunctionNode([],childNodes))
                ));
                childNodes = null;
            }
            if( data.defineSlots ){
                for(let key in data.defineSlots){
                   const {node,scope} =  data.defineSlots[key];
                   properties.push( this.createPropertyNode(
                        this.createIdentifierNode(key), 
                        node, 
                    ));
                }
            } 
            if( properties.length > 0 ){
                childNodes = this.createObjectNode( properties );
            }
        }

        var nodeElement = null;
        if(stack.isSlot ){
            nodeElement = this.makeSlotElement(stack, childNodes);
        }else if(stack.isDirective){
            nodeElement = this.makeDirectiveElement(stack, childNodes);
        }else{
            nodeElement = this.makeHTMLElement(stack, data, childNodes);
        }

        if( data.directives && data.directives.length > 0 ){
            nodeElement = this.createWithDirectivesNode(nodeElement,data.directives);
        }

        if( isRoot ){
            this.createImportVueContextReferenceNode();
            if( stack.compilation.JSX && stack.parentStack.isProgram ){
                const initProperties = data.props.map( property=>{
                    return this.createStatementNode(
                        this.createAssignmentNode(
                            this.createMemberNode([
                                this.createThisNode(),
                                this.createIdentifierNode( property.name.value )
                            ]),
                            property.value,
                        )
                    )
                });
                const renderMethod = this.createRenderNode(stack, nodeElement );
                nodeElement = this.createClassNode(stack, renderMethod, initProperties);
            }else {
                this.insertCreateElementHandleNode(stack)
            }
        }
        return nodeElement;
    }

    insertCreateElementHandleNode(stack, flag=false){
        if( this.__existCreateElementHandle )return true;
        const block =  this.getParentByType( ctx=>{
            return ctx.type === "BlockStatement" && ctx.parent.type ==="MethodDefinition"
        });
        if( block && !block.existCreateElementHandle ){
            this.__existCreateElementHandle = true;
            block.existCreateElementHandle = true;
            block.body.unshift( this.createElementHandleNode(stack, flag) );
        }
    }


    createElementHandleNode(stack, flag){
        if(flag===true || this.isWebComponent(stack) ){
            return this.createDeclarationNode('const', [ 
                this.createDeclaratorNode( 
                    this.createElementRefsNode(null),
                    this.createCalleeNode(
                        this.createMemberNode([
                            this.createThisNode(),
                            this.createIdentifierNode('createVNode'),
                            this.createIdentifierNode('bind'),
                        ]),
                        [
                            this.createThisNode()
                        ]
                    )
                ) 
            ]);
        }else{
            return this.createDeclarationNode('const', [ 
                this.createDeclaratorNode( 
                    this.createElementRefsNode(null),
                    this.createChunkNode('arguments[0]',false)
                ) 
            ]);
        }
    }


}
module.exports = JSXTransformV3;
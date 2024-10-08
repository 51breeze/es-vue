const JSXTransform = require('./JSXTransform');
const Core = require('./Core');
const useVueContextKey = Symbol('useVueContextKey');
const toUpperCaseFirst=(str)=>{
    return str.substring(0,1).toUpperCase()+str.substring(1);
}
class JSXTransformV3 extends JSXTransform{
    makeConfig(data, stack){
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
                        const type = value[0].type;
                        const isObject = type ==='Property' || type ==='JSXSpreadAttribute' || type ==='SpreadElement';
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
                                            if(item.key.type ==="Literal"){
                                                item.key.raw = '"'+item.key.value+'"';
                                            }else{
                                                let str = String(item.key.value)
                                                if(str.includes(':') || str.includes('-')){
                                                    item.key.raw = '"'+item.key.value+'"';
                                                    item.key.type = "Literal";
                                                }
                                            }
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
        const props = items.length > 0 ? this.createObjectNode(items) : null;
        if(props && stack && stack.isComponent){
            const desc = stack.description();
            if(desc && desc.isModule && desc.isClass){
                const hookAnnot = this.builder.getClassMemberHook( desc.moduleStack );
                if( hookAnnot ){
                    let [type] = hookAnnot;
                    if(type==='polyfills:props'){
                        return this.createInvokePolyfillsPropsHook(props, this.createLiteralNode(desc.getName()))
                    }
                }
            }
        }
        return props;
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
                        const scopeName = attributeSlot.value ? this.createToken(attributeSlot.parserSlotScopeParamsStack()) : null;

                        let childrenNodes = elem.content;
                        if( childrenNodes.length ===1 && childrenNodes[0].type ==="ArrayExpression" ){
                            childrenNodes = childrenNodes[0];
                        }else{
                            childrenNodes = this.createArrayNode(childrenNodes);
                        }
                        const params = scopeName ? [ this.createAssignmentNode(scopeName,this.createObjectNode()) ] : [];
                        const renderSlots= this.createSlotCalleeNode(
                            child, 
                            //this.createLiteralNode(name), 
                            this.createArrowFunctionNode(params,childrenNodes)
                        );

                        if( scopeName ){
                            data.defineSlots[name] = {
                                node:renderSlots,
                                scope:null,
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
                            scope:null,
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
        const dataset = this.builder[useVueContextKey] || (this.builder[useVueContextKey] = new Map());
        let context = dataset.get(target);
        if( !context ){
            dataset.set(target, context = new Map());
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
        const dataset = this.builder[useVueContextKey];
        if(!dataset)return;
        let context = dataset.get(target);
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

        const descModule = stack.isWebComponent ? stack.description() : null;
        const definedEmits = stack.compiler.callUtils('isModule',descModule) ? this.getModuleDefinedEmits(descModule) : null;
        const getDefinedEmitName = (name)=>{
            if(definedEmits && Object.prototype.hasOwnProperty.call(definedEmits, name)){
                name = definedEmits[name];
            }
            if(name.includes('-')){
                name = name.replace(/-([a-z])/g, (a,b)=>b.toUpperCase());
            }
            return name;
        }

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
                if( item.argument ){
                    const node = this.createNode(item.argument, 'SpreadElement')
                    node.argument = node.createToken(item.argument)
                    data.props.push(node);
                }
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

            if( (ns ==="@events" || ns ==="@natives") ){
                name = getDefinedEmitName(name);
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
                    if(item.value && item.value.isJSXExpressionContainer){
                        const stack = item.value.expression;
                        if(stack && stack.isMemberExpression && !stack.optional){
                            const Reflect = this.builder.getGlobalModuleById('Reflect');
                            this.addDepend( Reflect );
                            binddingModelValue = this.createCalleeNode(
                                this.createMemberNode([
                                    this.checkRefsName(this.builder.getModuleReferenceName(Reflect)),
                                    this.createIdentifierNode('set')
                                ]),
                                [
                                    stack.module ? this.createIdentifierNode(stack.module.id) : this.createLiteralNode(null), 
                                    this.createToken(stack.object), 
                                    stack.computed ? this.createToken(stack.property) : this.createLiteralNode(stack.property.value()),
                                    this.createIdentifierNode('value')
                                ],
                                stack
                            );
                            binddingModelValue.isReflectSetter = true;
                        }
                    }
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

                const createBinddingParams = (getEvent=false)=>{
                    return [
                        [
                            this.createIdentifierNode('e')
                        ], 
                        binddingModelValue.isReflectSetter ? binddingModelValue : this.createAssignmentNode(
                            binddingModelValue,
                            getEvent ? createGetEventValueNode() : this.createIdentifierNode('e')
                        )
                    ]
                }

                if( custom && binddingModelValue ){

                    pushEvent(custom , this.createArrowFunctionNode(
                        ...createBinddingParams(!stack.isWebComponent)
                    ), 'on');
                    
                }else if( (stack.isWebComponent || afterDirective) && binddingModelValue ){

                    let eventName = propName;
                    if(propName ==='modelValue'){
                        eventName = 'update:modelValue';
                    }

                    if(item.isMemberProperty){
                        let desc = item.description();
                        if(desc){
                            let _name = this.getBinddingEventName(desc)
                            if(_name){
                                eventName = _name;
                            }
                        }
                    }

                    const type = getDefinedEmitName(eventName);
                    pushEvent(
                        type.includes(':') || type.includes('-') ? this.createLiteralNode(type) : this.createIdentifierNode(type),
                        this.createArrowFunctionNode(
                            ...createBinddingParams()
                        ),
                    'on');
        
                }else if( binddingModelValue ){

                    pushEvent(
                        this.createIdentifierNode('input'),
                        this.createArrowFunctionNode(
                            ...createBinddingParams(true)
                        ),
                    'on');

                }
        
                if( afterDirective && binddingModelValue ){
                    data.directives.push(
                        this.createDirectiveNode(afterDirective, binddingModelValue)
                    );
                }

                return;
            }

            if( !ns && (attrLowerName ==='ref' || attrLowerName ==='refs') ){
                name = propName = 'ref';
                let useArray = inFor || attrLowerName ==='refs';
                if( useArray ){
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
                                this.createLiteralNode( true )
                            ]
                        )
                    );
                }
            }

            
            if(name==='class' || name==='staticClass'){
                if(propValue && propValue.type !== 'Literal'){
                    propValue = this.createCalleeNode(
                        this.createCalleeVueApiNode('normalizeClass'),
                        [propValue]
                    );
                }
            }else if(name==='style' || name==='staticStyle'){
                if(propValue && !(propValue.type === 'Literal' || propValue.type === 'ObjectExpression')){
                    propValue = this.createCalleeNode(
                        this.createCalleeVueApiNode('normalizeStyle'),
                        [propValue]
                    );
                }
            }else if(attrLowerName==='key' || attrLowerName==='tag'){
                name = attrLowerName
            }

            const property = this.createPropertyNode( this.createPropertyKeyNode(propName, value.name.stack), propValue );
            switch(name){
                case "class" :
                case "style" :
                case "key" :
                case "tag" :
                case "ref" :
                case "staticStyle" :
                case "staticClass" :
                    data[name] = property
                    break;
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

    // createSlotCalleeNode(...args){
    //     const node= this.createCalleeNode(
    //         this.createMemberNode([
    //             this.createThisNode(), 
    //             this.createIdentifierNode('slot')
    //         ]),
    //         args
    //     );
    //     node.isSlotNode = true;
    //     return node;
    // }

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
            node.isSlotNode = true;
            return node;
        }else{
            // const node= this.createCalleeNode(
            //     this.createMemberNode([
            //         this.createThisNode(), 
            //         this.createIdentifierNode('slot')
            //     ]),
            //     args
            // );
            const node= this.createCalleeNode(
                this.createCalleeVueApiNode('withCtx'),
                args
            );
            node.isSlotNode = true;
            return node;
        }
    }

    makeSlotElement(stack , children){
        const openingElement = this.createToken(stack.openingElement);
        const args = [stack];
        let props = null;
        let params = [];
        if( stack.isSlotDeclared ){
            args.push(openingElement.name)
            if( openingElement.attributes.length > 0 ){
                const properties = openingElement.attributes.map(attr=>{
                    return this.createPropertyNode(
                        attr.name,
                        attr.value
                    )
                });
                props = this.createObjectNode(properties);
            }else{
                props = this.createObjectNode();
            }
            args.push( props );
        }else if( stack.openingElement.attributes.length > 0 ){
            const attribute = stack.openingElement.attributes[0];
            if( attribute.value ){
                const stack = attribute.parserSlotScopeParamsStack();
                params.push( this.createAssignmentNode(this.createToken(stack),this.createObjectNode()) );
            }
        }
        if( children ){
            if(Array.isArray(children) && children.length===0){
                children = null
            }else if( children.type ==='ArrayExpression' && children.elements.length === 0){
                children = null
            }
            if(children){
                args.push( this.createArrowFunctionNode(params,children) );
            }
        }
        return this.createSlotCalleeNode(...args);
    }

    createCalleeVueApiNode( name ){
        return this.createIdentifierNode( 
            this.getVueImportContext(name)
        );
    }

    createFragmentNode(children, props=null){
        const items = [
            this.createCalleeVueApiNode('Fragment'),
            props ? props : this.createLiteralNode( null),
            children
        ]
        return this.createCalleeNode(
            this.createCalleeVueApiNode('createVNode'),
            items
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

    makeHTMLElement(stack,data,children){
        var name = null;
        if( stack.isComponent ){
            if( stack.jsxRootElement === stack && stack.parentStack.isProgram ){
                name = this.createLiteralNode("div");
            }else{
                const desc = stack.description();
                if( desc.isModule && desc.isClass ){
                    this.addDepend(desc)
                    name = this.createIdentifierNode( this.getModuleReferenceName( desc ) );
                }else{
                    name = this.createIdentifierNode(stack.openingElement.name.value(), stack.openingElement.name);
                }
            }
        }else{
            name = this.createLiteralNode(stack.openingElement.name.value(), void 0, stack.openingElement.name);
        }

        data = this.makeConfig(data, stack);
        if( children ){
            return this.createElementNode(stack, name, data || this.createLiteralNode(null), children);
        }else if(data){
            return this.createElementNode(stack, name, data);
        }else{
            return this.createElementNode(stack, name);
        }
    }

    create(stack){
        const isRoot = stack.jsxRootElement === stack;
        const data = this.getElementConfig();
       
        let hasText = false;
        let hasJSXText = false;
        let children = stack.children.filter(child=>{
            if(child.isJSXText){
                if(!hasJSXText)hasJSXText = true;
                if(!hasText){
                    hasText = child.value().trim().length > 0;
                }
            }
            return !((child.isJSXScript && child.isScriptProgram) || child.isJSXStyle)
        })

        if(hasJSXText && !hasText){
            children = stack.children.filter(child=>!child.isJSXText)
        }

        let componentDirective = this.getComponentDirectiveForDefine( stack );
        let childNodes =this.makeChildren(children, data);
        let nodeElement = null;
        if( stack.isDirective && stack.openingElement.name.value().toLowerCase() ==="custom" ){
            componentDirective = true;
        }

        if( componentDirective ){
            nodeElement = childNodes;
        }else{

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
        
            //const spreadAttributes = [];
            this.makeDirectiveComponentProperties(stack, data);
            if(!stack.isJSXFragment){
                if(!(isRoot && stack.openingElement.name.value()==='root') ){
                    this.makeAttributes(stack, childNodes, data, /*spreadAttributes*/);
                    this.makeProperties(children, data);
                }
            }
            //this.makeSpreadAttributes(spreadAttributes, data);
            
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

           
            if(stack.isSlot ){
                nodeElement = this.makeSlotElement(stack, childNodes);
            }else if(stack.isDirective){
                nodeElement = this.makeDirectiveElement(stack, childNodes);
            }else{
                if(stack.isJSXFragment || (isRoot && !isWebComponent && stack.openingElement.name.value()==='root')){
                    if(Array.isArray(childNodes) && childNodes.length===1){
                        nodeElement = childNodes[0]
                    }else{
                        nodeElement = this.createFragmentNode(childNodes)
                    }
                }else{
                    nodeElement = this.makeHTMLElement(stack, data, childNodes);
                }
            }

            if( nodeElement && data.directives && data.directives.length > 0 ){
                nodeElement = this.createWithDirectivesNode(nodeElement,data.directives);
            }
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
                const renderMethod = this.createRenderNode(stack, nodeElement || this.createLiteralNode(null));
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
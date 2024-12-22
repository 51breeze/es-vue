const JSXTransformV3 = require('../JSXTransformV3');
const SkinClass = require('../SkinClass');
const VueBuilder = require('./VueBuilder');
const Core = require("../Core");
const {normalizePropertyKey, createThisNode} = require('../Utils');
const PropMaps =  {
    'on':true,
    'nativeOn':true,
    'props':true,
    'domProps':true,
    'attrs':true,
    'ref':true,
    'class':true,
    'style':true,
    'staticStyle':true,
    'staticClass':true,
    'transition':true,
    'key':true,
};

const toUpperCaseFirst=(str)=>{
    return str.substring(0,1).toUpperCase()+str.substring(1);
}

class VueJsxV3 extends JSXTransformV3{

    createClassNode(stack, childNodes){
        if( stack.jsxRootElement.isSkinComponent ){
            const obj = new SkinClass(stack,this,'ClassDeclaration');
            return obj.create();
        }else{
            const renderMethod = this.createRenderNode(stack, childNodes );
            const obj = new VueBuilder(stack, this, 'ClassDeclaration');
            obj.templateRefMethods.push( renderMethod );
            return obj.create();
        }
    }

    createAttrNode( name, value, stack){

        if(value && value.type ){
            if( !(value.type =='Literal' || value.type =='JSXExpressionContainer') ){
                value = this.createExpressionContainerNode(value);
            }
        }

        if( typeof name ==='string' ){
            name = this.createIdentifierNode(name);
        }

        const node = this.createNode('JSXAttribute')
        node.name = name
        node.value = value;
        node.stack = stack;
        if(name)name.parent = node;
        if(value)value.parent = node;
        return node;
    }

    createExpressionContainerNode(value, stack){
        const expr = this.createNode('JSXExpressionContainer')
        expr.stack = stack;
        expr.expression = value;
        value.parent = expr;
        return expr;
    }

    createElementNode(open, close, children, attributes , stack){
        const node = this.createNode('JSXElement')
        node.stack = stack;
        node.openingElement = node.createNode('JSXOpeningElement')
        node.openingElement.attributes = attributes || [];
        node.openingElement.name = open;
        if(close){
            node.closingElement = node.createNode('JSXClosingElement')
            node.closingElement.name = close;
        }else{
            node.selfClosing = true;
        }
        node.children = children || [];
        return node;
    }
   
    makeConfig(data){
        const items = [];
        Object.entries(data).forEach( item=>{
            let [key, value] = item;
            if( value && PropMaps[key] === true){

                if( key==='on' ){
                    value.forEach( item=>{
                        if( item.computed ){
                            
                        }else{
                            item.name.value = 'on'+toUpperCaseFirst(item.name.value);
                        }
                        items.push( item );
                    });
                    return;
                }

                if( Array.isArray(value) ){
                    items.push( ...value )
                }else{
                    items.push( value );
                }
            }
        });
        return items;
    }

    cascadeConditionalNode( elements ){
        if( elements.length < 2 ){
            throw new Error('Invaild expression');
        }
        let lastElement = elements.pop();
        while( elements.length > 0 ){
            let _last = elements.pop();
            if( _last.type ==='JSXExpressionContainer' ){
                _last = _last.expression;
            }
            if( _last.type ==="ConditionalExpression" ){
                _last.alternate = lastElement;
                lastElement = _last;
            }else{
                throw new Error('Invaild expression');
            }
        }
        return lastElement;
    }

    makeDirectives(child, element, prevResult){
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

    createChildNode(child){
        if( child ){
            if( child.isJSXExpressionContainer && child.parentStack ){
                if( child.parentStack.isDirective || child.parentStack.isSlot || child.parentStack.isComponent ){
                    return this.createToken(child.expression)
                }
            }
            return this.createToken(child);
        }
        return null;
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
                const elem = this.makeDirectives(child, this.createChildNode(child) , last) || next();
                if( child.hasAttributeSlot ){
                    const attributeSlot = child.openingElement.attributes.find(attr=>attr.isAttributeSlot);
                    if( attributeSlot ){

                        const name = attributeSlot.name.value();
                        const scopeName = attributeSlot.value ? attributeSlot.value.value() : null;
                        let childrenNodes = elem.content;
                        if( childrenNodes.length ===1 ){
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
                push(content, value);
            }
            last = result;
            if( !result )break;
        }

        if( !content.length )return null;
        return content;
    }

    createIterationNode(name, refs, refName, element, item, key, index){
    
        let fnNode = null
        if( name ==="each"){
            const args = [ this.createIdentifierNode(item) ];
            if(key){
                args.push( this.createIdentifierNode(key) );
            }
            if( element.type ==='ArrayExpression' && element.elements.length === 1){
                element =  element.elements[0];
            }
            const node = this.createCalleeNode( 
                this.createMemberNode([
                    refs,
                    this.createIdentifierNode('map')
                ]),
                [
                    this.createEachNode(element, args)
                ] 
            );
            if( element.type ==='ArrayExpression' ){
                fnNode = this.createCalleeNode( 
                    this.createMemberNode([
                        node,
                        this.createIdentifierNode('reduce')
                    ]),
                    [
                        this.createArrowFunctionNode([
                            this.createIdentifierNode('acc'),
                            this.createIdentifierNode('item')
                        ],  this.createCalleeNode( 
                            this.createMemberNode([
                                this.createIdentifierNode('acc'),
                                this.createIdentifierNode('concat')
                            ]),
                            [
                                this.createIdentifierNode('item')
                            ] 
                        )),
                        this.createArrayNode()
                    ] 
                );
            }else{
                fnNode = node;
            }
        }else{
            fnNode = this.createCalleeNode(
                this.createParenthesNode( 
                    this.createForInNode(refName, element, item, key, index) 
                ),
                [
                    refs
                ]
            );
        }

        return this.createExpressionContainerNode(fnNode);
    }

    makeDirectiveElement(stack, children){
        const openingElement = stack.openingElement;
        const name = openingElement.name.value().toLowerCase();
        switch( name ){
            case 'custom' :
            case 'show' :
                return children;
            case 'if' :
            case 'elseif' :
                let valueStack = stack.attributes[0].parserAttributeValueStack();
                if(valueStack.isJSXExpressionContainer){
                    valueStack = valueStack.expression;
                }
                const condition = this.createToken( valueStack );
                const node = this.createNode('ConditionalExpression')
                node.test = condition;
                node.consequent = children
                return this.createExpressionContainerNode(node);
            case 'else' :
                return children;
            case 'for' :
            case 'each' :
                const attrs = stack.openingElement.attributes;
                const argument = {};
                attrs.forEach( attr=>{
                    if( attr.name.value()==='name'){
                        let valueStack = attr.parserAttributeValueStack();
                        if(valueStack.isJSXExpressionContainer){
                            valueStack = valueStack.expression;
                        }
                        argument[ 'refs' ] = this.createToken( valueStack );
                    }else{
                        argument[ attr.name.value() ] = attr.value.value();
                    }
                });
                const fun = this.createIterationNode(
                    name, 
                    argument.refs, 
                    this.checkRefsName('_refs'),
                    children, 
                    argument.item || 'item',
                    argument.key || 'key', 
                    argument.index
                );
                fun.isForNode = true;
                return fun;
        } 
        return null;
    }

    makeAttributes(stack, childNodes, data, spreadAttributes){

        const pushEvent=(name,callback, category)=>{
            const events =  data[ category ] || (data[ category ]=[]);
            const property = this.createAttrNode(name, callback);
            if(name.computed ){
                property.computed = true;
                property.name.computed = false;
            }
            events.push( property );
        }

        const toFun = (item,content)=>{
            if( item.value.isJSXExpressionContainer ){
                const expr = item.value.expression;
                if( expr.isAssignmentExpression ){
                    return this.createCalleeNode(
                        this.createMemberNode([
                            this.createParenthesNode(
                                this.createFunctionNode((block)=>{
                                    block.body=[
                                        content
                                    ]
                                })
                            ),
                            this.createIdentifierNode('bind')
                        ]),
                        [
                            this.createThisNode()
                        ]
                    );
                }
            }
            return content;
        }

        let binddingModelValue = null;
        let custom = null;

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

            if( !item.value ){
                propValue = this.createExpressionContainerNode( this.createLiteralNode(true) )
            }

            if( (ns ==="@events" || ns ==="@natives") && name.includes('-') ){
                name = name.replace(/-([a-z])/g, (a,b)=>b.toUpperCase());
            }

            if( ns && ns.includes('::') ){
                // let [seg, className] = ns.split('::',2);
                // ns = seg;
                // const moduleType = stack.getModuleById(className);
                // const moduleClass = this.getModuleReferenceName( moduleType );
                // this.addDepend( moduleType );
                // name = this.createMemberNode([
                //     this.createIdentifierNode( moduleClass ),
                //     name
                // ], name);
                // name.computed = true;
                // custom = name;
                item.name.warn(11002)
                return;
            }

            if( ns ==="@events" ){
                pushEvent( name, toFun(item,value.value), 'on')
                return;
            }else if( ns ==="@natives" ){
                pushEvent( name, toFun(item,value.value), 'on')
                return;
            }else if( ns ==="@binding" ){
                binddingModelValue = value.value;
                if(binddingModelValue.type==='JSXExpressionContainer'){
                    binddingModelValue = binddingModelValue.expression;
                }
            }
            
            if( item.isMemberProperty ){
                let isDOMAttribute = false;
                let attrDesc = item.getAttributeDescription( stack.getSubClassDescription() );
                if( attrDesc ){
                    isDOMAttribute = attrDesc.annotations.some( item=>item.name.toLowerCase() === 'domattribute' );
                    const alias = attrDesc.annotations.find( item=>item.name.toLowerCase() === 'alias' );
                    if( alias ){
                        const args = alias.getArguments();
                        if( args.length > 0) {
                            propName = args[0].value;
                        }
                    }
                }

                if( !isDOMAttribute ){
                    data.props.push( this.createAttrNode( this.createIdentifierNode(propName, value.name.stack ), propValue ) );
                    if( ns !=="@binding" )return;
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
                }else if( (stack.isWebComponent) && binddingModelValue ){
                    if( propName ==='value' ){
                        propName = 'v-model';
                        data.props.push( this.createAttrNode( this.createIdentifierNode(propName, value.name.stack ), binddingModelValue ) );

                        // pushEvent(
                        //     this.createLiteralNode('onUpdate:modelValue', void 0, value.name.stack),
                        //     this.createArrowFunctionNode(
                        //         [
                        //             this.createIdentifierNode('value')
                        //         ], 
                        //         this.createAssignmentNode(
                        //             binddingModelValue,
                        //             this.createIdentifierNode('value')
                        //         )
                        //     ),
                        //     'props'
                        // );
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
                                propValue,
                                this.createIdentifierNode('node'),
                                this.createLiteralNode( inFor )
                            ]
                        )
                    );
                }
            }

            const property = this.createAttrNode( this.createIdentifierNode(propName, value.name.stack), propValue );
            switch(name){
                case "class" :
                case "style" :
                case "key" :
                case "tag" :
                case "staticStyle" :
                case "staticClass" :
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
                    data.key = this.createAttrNode( this.createIdentifierNode('key'), binary );
                }else if(!fillFor){
                    data.key = this.createAttrNode( this.createIdentifierNode('key'), this.createLiteralNode( String(getAt(stack)) ) ); 
                }
            }else if(!fillFor){
                data.key = this.createAttrNode( this.createIdentifierNode('key'), this.createLiteralNode( String(getAt(stack)) ) ); 
            }
        }
    }


    makeHTMLElement(stack,data,children){
        var name = null;
        if( stack.isComponent ){
            const desc = stack.description();
            if( desc.isModule && desc.isClass ){
                name = this.createIdentifierNode( this.getModuleReferenceName( desc ) );
            }else{
                name = this.createIdentifierNode(stack.openingElement.name.value(), stack.openingElement.name);
            }
        }else{
            name = this.createIdentifierNode(stack.openingElement.name.value(), void 0, stack.openingElement.name);
        }

        if( children && !Array.isArray(children) ){
            children = [
                this.createExpressionContainerNode(children)
            ]
        }
        const attrs = this.makeConfig(data);
        return this.createElementNode(name, name, children, attrs, stack);
    }

    normalChildren(childNodes){
        if( childNodes && Array.isArray(childNodes) ){
            if( childNodes.length > 1 ){
                childNodes = this.createArrayNode(childNodes);
                childNodes.newLine = true;
            }else{
                childNodes = childNodes[0];
            }
        }
        if(childNodes && childNodes.type==='JSXElement'){
            childNodes = this.createParenthesNode(childNodes);
        }
        return childNodes;
    }

    createElementRefsNode(stack){
        return this.createIdentifierNode('h', stack);
    }

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
                childNodes = this.normalChildren(childNodes)
                properties.push( this.createPropertyNode(
                    this.createIdentifierNode('default'), 
                    this.createArrowFunctionNode([],childNodes)
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
            childNodes = this.normalChildren(childNodes)
            nodeElement = this.makeSlotElement(stack, childNodes);
        }else if(stack.isDirective){
            childNodes = this.normalChildren(childNodes)
            nodeElement = this.makeDirectiveElement(stack, childNodes);
        }else{
            nodeElement = this.makeHTMLElement(stack, data, childNodes);
        }

        if( !stack.isDirective && data.directives && data.directives.length > 0 ){
            nodeElement = this.createWithDirectivesNode(nodeElement,data.directives);
            nodeElement = this.createExpressionContainerNode(nodeElement)
        }

        if( isRoot ){
            if( stack.compilation.JSX && stack.parentStack.isProgram ){
                nodeElement = this.createClassNode(stack, nodeElement);
            }else{
                const block =  this.getParentByType( ctx=>{
                    return ctx.type === "BlockStatement" && ctx.parent.type ==="MethodDefinition"
                });
                if( block && !block.existCreateElementHandle ){
                    block.existCreateElementHandle = true;
                    block.body.unshift( this.createElementHandleNode(stack) );
                }
            }
        }
        return nodeElement;
    }


}
module.exports = VueJsxV3;
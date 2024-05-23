const JSXTransformV3 = require('./JSXTransformV3');
const Utils = require('./Utils')
const toUpperCaseFirst=(str)=>{
    return str.substring(0,1).toUpperCase()+str.substring(1);
}
const childrenNumKey = Symbol('childrenNumKey');

/**
* TEXT = 1  动态文本的元素
CLASS = 2  动态绑定 class 的元素
STYLE = 4  动态绑定 style 的元素
PROPS = 8  动态 props 的元素，且不含有 class、style 绑定
FULL_PROPS = 16  动态 props 和带有 key 值绑定的元素
HYDRATE_EVENTS = 32  事件监听的元素
STABLE_FRAGMENT = 64  子元素的订阅不会改变的 Fragment 元素
KEYED_FRAGMENT = 128  自己或子元素带有 key 值绑定的 Fragment 元素
UNKEYED_FRAGMENT = 256  没有 key 值绑定的 Fragment 元素
NEED_PATCH=512  带有 ref、指令的元素
DYNAMIC_SLOTS = 1024  动态 slot 的组件元素
HOISTED = -1  静态的元素
BAIL = -2  不是 render 函数生成的一些元素，例如 renderSlot
*/

const ELEMENT_TEXT = 1 
const ELEMENT_CLASS = 2 
const ELEMENT_STYLE = 4 
const ELEMENT_PROPS = 8 
const ELEMENT_FULL_PROPS = 16 
const ELEMENT_HYDRATE_EVENTS = 32 
const ELEMENT_STABLE_FRAGMENT = 64 
const ELEMENT_KEYED_FRAGMENT = 128 
const ELEMENT_UNKEYED_FRAGMENT = 256
const ELEMENT_NEED_PATCH=512
const ELEMENT_DYNAMIC_SLOTS = 1024  
const ELEMENT_HOISTED = -1
const ELEMENT_BAIL = -2

const privateKey = Symbol('TransformHoistePrivateKey');
class JSXTransformV3Optimize extends JSXTransformV3{
    constructor(stack, ctx){
        super(stack, ctx);
        this.hoisteNodes = [];
        const program = this.getParentByType('Program', true);
        if(program){
            if(!program[privateKey]){
                program[privateKey] = this.hoisteNodes;

                program.once('createComplated',(body)=>{
                    const find = ( body )=>{
                        let index = 0;
                        let len = body.length;
                        while( index < len ){
                            if(body[index]){
                                const type = body[index].type;
                                if( type ==='ClassDeclaration' ){
                                    return body[index];
                                }else if( type ==='PackageDeclaration' ){
                                    return find( body[index].body );
                                }
                            }
                            index++;
                        }
                        return null;
                    }
                    const classBlock = find(body);
                    let items = classBlock ? classBlock.body : body;
                    if( classBlock && classBlock.isVueBuilder){
                        const script = items.find( item=>item.type ==='JSXElement' && item.openingElement.name.value==='script' );
                        if(script){
                            items = script.children;
                        }
                    }
                    let index = 0;
                    let len = items.length;
                    while( index < len ){
                        if( items[index] && items[index].type ==='ImportDeclaration' && (index+1) < len && items[index+1].type !=='ImportDeclaration' ){
                            break;
                        }
                        index++;
                    }
                    items.splice( index+1, 0, ...this.hoisteNodes.splice(0, this.hoisteNodes.length) );
                });
            }else{
                this.hoisteNodes = program[privateKey];
            }
        }
    }

    isUnexplicitExpressionChild(type){
        if(!type)return true;
        if( type.isUnionType ){
            return type.elements.some( item=>this.isUnexplicitExpressionChild(item.type()) )
        }else if( type.isIntersectionType ){
            return this.isUnexplicitExpressionChild(type.left.type()) || this.isUnexplicitExpressionChild(type.right.type());
        }else if( type.isAnyType || type.isLiteralArrayType || type.isTupleType || this.builder.getAvailableOriginType(type) ==="Array" ){
            return true;
        }
        return false;
    }

    createComponentNormalChildrenNode(elementNode){
        const Component = this.builder.getModuleById('web.components.Component')
        this.addDepend( Component );
        const node = this.createCalleeNode(
            this.createMemberNode([
                this.getModuleReferenceName(Component), 
                this.createIdentifierNode('normalChildrenVNode')
            ]),
            [
                elementNode
            ]
        );
        node.isElementNode = true;
        return node;
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
                    content[0] = this.createIterationNode(name, refs , this.checkRefsName('_refs'), content[0], item, key, void 0, content[0].hasKey );
                }else{
                    content[0] = this.createIterationNode(name, refs , this.checkRefsName('_refs'), content[0], item, key, index, content[0].hasKey );
                }
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

    makeChildren(children, data, stack){
        const content = [];
        let len = children.length;
        let index = 0;
        let last = null;
        let result = null;
        let pureStaticChildren = true;
        data.defineSlots = {};
        const next = ()=>{
            if( index<len ){
                const child = children[index++];
                const childVNode = this.createToken(child);
                const elem = this.makeDirectives(child, childVNode, last) || next();
                if( child.directives && child.directives.length > 0 ){
                    pureStaticChildren = false;
                }else if( childVNode && childVNode.pureStaticChildren === false ){
                    pureStaticChildren = false;
                }
                if( child.hasAttributeSlot ){
                    pureStaticChildren = false;
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
                        const params = scopeName ? [ this.createAssignmentNode(this.createIdentifierNode('_slotCtx'),this.createObjectNode()) ] : [];
                        const renderSlots= this.createSlotCalleeNode(
                            child, 
                            //this.createLiteralNode(name), 
                            this.createArrowFunctionNode(params,childrenNodes)
                        );
                        data.defineSlots[name] = {
                            node:renderSlots,
                            scope:scopeName,
                            child
                        }
                        return next();
                    }
                }else if( child.isSlot && !child.isSlotDeclared ){
                    pureStaticChildren = false;
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
                    pureStaticChildren = false;
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

        let hasDynnmicText = false;
        let hasStaticText = false;
        let hasDynamicChild = false;
        let hasUnexplicitExpressionChild = false;
        const isLiteralNode = (target)=>{
            if(target.isLiteral || target.isJSXText){
                hasStaticText = true;
                return true;
            }
            if(target.isJSXExpressionContainer){
                const isLiteral = target.expression.isLiteral;
                if( isLiteral ){
                    hasStaticText = true;
                    return true; 
                }
                pureStaticChildren = false;
                const type =  target.expression.type();
                const scalarType = this.builder.getAvailableOriginType(type);
                if( scalarType==="String" || scalarType==="Number" || scalarType==="Boolean" || scalarType==="RegExp"){
                    hasDynnmicText = true;
                    return true;
                }
                //hasUnexplicitExpressionChild = this.isUnexplicitExpressionChild(type)
                hasDynamicChild = true;
            }
            pureStaticChildren = false;
            return false;
        }

        let lastIsLiteralType = false;
        let cache = new WeakSet();
        while(true){
            result = next();
            let isLiteralType = result && isLiteralNode(result.child);
            if( last ){
                let value = null;
                const hasIf = last.cmd.includes('if');
                if( hasIf ){
                    pureStaticChildren = false;
                    if( result && result.cmd.includes('elseif') ){
                        result.cmd = last.cmd.concat( result.cmd );
                        result.content = last.content.concat( result.content );
                    }else if(result && result.cmd.includes('else') ){
                        value = this.cascadeConditionalNode( last.content.concat( result.content ) );
                        result.ifEnd = true;
                    }else{
                        if(result)result.ifEnd = true;
                        last.content.push( this.createVueCommentVNodeNode('end if', true) );
                        value = this.cascadeConditionalNode( last.content );
                    }
                }else if( !( last.ifEnd && last.cmd.includes('else') ) ) {
                    value = last.content;
                }

                if( lastIsLiteralType && isLiteralType ){
                    const mergeNode = this.createBinaryNode(
                        last.child.isJSXExpressionContainer && !cache.has(last) ? this.createVueToDisplayStringNode(last.content[0]) : last.content[0], 
                        result.child.isJSXExpressionContainer && !cache.has(result) ? this.createVueToDisplayStringNode(result.content[0]) : result.content[0],
                        '+'
                    );
                    mergeNode.isMergeStringNode = true;
                    result.content = [mergeNode];
                    value = null;
                    if(result.child.isJSXExpressionContainer)cache.add( result );
                }
                push(content, value);
            }
            last = result;
            lastIsLiteralType = isLiteralType;
            if( !result )break;
        }

        data.hasTextChild = !hasDynamicChild && (hasDynnmicText || hasStaticText);
        data.pureStaticChildren = !hasDynamicChild && pureStaticChildren;

        const isElementNode = !(stack.isComponent || stack.isDirective || stack.isSlot);
        let normalizeChildren = true;
        if( isElementNode && content.length === 1 && !hasDynamicChild){
            if( hasDynnmicText ){
                normalizeChildren = false;
                this.addPatchFlag(data, ELEMENT_TEXT);
            }else if( hasStaticText ){
                normalizeChildren = false;
            }
        }

        data.hasDynamicChild = hasDynamicChild;
        data.hasUnexplicitExpressionChild = hasUnexplicitExpressionChild;
        if( normalizeChildren ){
            return content.map( child=>{
                if( child.isElementVNode )return child;
                if( child.type ==="Literal" || child.isMergeStringNode || child.isNeedCreateTextNode){
                    return this.createVueTextVNodeNode( child , ELEMENT_TEXT);
                }else if(child.isNeedUseCreateElementNode){
                    return this.createFragmentComponentNode(child);
                    //return this.createCalleeCreateVNode(child.stack||stack, child);
                }
                return child;
            });
        }

        return content;
    }

    createFragmentComponentNode( value ){
        const Fragment = this.builder.getGlobalModuleById('web.components.Fragment');
        this.addDepend(Fragment);
        const componentName = this.getModuleReferenceName(Fragment);
        return this.createVueBlockVNode(true,[
            this.createIdentifierNode(componentName),
            this.createObjectNode([
                this.createPropertyNode('value', value)
            ]),
            this.createLiteralNode(null),
            this.createLiteralNode(8),
            this.createArrayNode([
                this.createLiteralNode('value')
            ])
        ])
    }

    createCalleeCreateVNode(stack, ...args){
        return this.createCalleeNode(
            this.createMemberNode([
                this.createThisNode(),
                this.createIdentifierNode('createVNode'),
            ]),
            args,
            stack
        )
    }

    createVueTextVNodeNode(textNode, flags){
        const args = [textNode];
        if( flags ){
            args.push( this.createLiteralNode( flags ) );
        }
        const node = this.createCalleeNode(
            this.createIdentifierNode( this.getVueImportContext('createTextVNode') ),
            args
        );
        node.isElementVNode = true;
        return node;
    }

    createVueCommentVNodeNode(text, flag){
        const node = this.createCalleeNode(
            this.createIdentifierNode( this.getVueImportContext('createCommentVNode') ),
            [
                this.createLiteralNode(text),
                this.createLiteralNode( !!flag )
            ]
        );
        node.isElementVNode = true;
        return node;
    }

    addPatchFlag(data, flag, isProps=false){
        if( (data.patchFlag & flag) !== flag ){
            if(data.hasDynamicKeys && isProps && flag !== ELEMENT_FULL_PROPS){
                return data;
            }
            if(flag===ELEMENT_HOISTED){
                data.patchFlag = ELEMENT_HOISTED
            }else if(flag===ELEMENT_BAIL){
                data.patchFlag = ELEMENT_BAIL
            }else{
                data.patchFlag |= flag;
            }
        }
        return data;
    };

    makeAttributes(stack, childNodes, data, spreadAttributes){
        const isSsr = !!this.plugin.options.ssr;
        const pushEvent=(name,callback, category)=>{
            if(isSsr)return;
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
        let pureStaticAttributes = true;
        let binddingModelValue = null;
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
                    pureStaticAttributes = false;
                    const name = item.name.value().toLowerCase();
                    if( name === 'show'){
                        if( stack.isWebComponent ){
                            item.name.warn(11000);
                        }
                        data.directives.push(
                            this.createDirectiveNode('vShow', this.createToken( item.valueArgument.expression ) )
                        );
                    }else if(name === 'custom'){
                        this.createAttriubeCustomDirective(item, data);
                    }
                }
                return;
            }else if( item.isJSXSpreadAttribute ){
                data.hasAttribbuteReferences = true;
                if( item.argument ){
                    const node = this.createNode(item.argument, 'SpreadElement');
                    node.argument = node.createToken(item.argument);
                    data.props.push(node);
                    data.hasDynamicKeys = true;
                    this.addPatchFlag(data, ELEMENT_FULL_PROPS, true);
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
                pureStaticAttributes = false;
                //this.addPatchFlag(data,ELEMENT_HYDRATE_EVENTS,true);
                pushEvent( name, this.makeAttributeBindEventFunctionNode(item,value.value), 'on')
                return;
            }else if( ns ==="@natives" ){
                pureStaticAttributes = false;
                //this.addPatchFlag(data,ELEMENT_HYDRATE_EVENTS,true);
                pushEvent( name, this.makeAttributeBindEventFunctionNode(item,value.value), 'on')
                return;
            }else if( ns ==="@binding" ){
                pureStaticAttributes = false;
                //this.addPatchFlag(data,ELEMENT_NEED_PATCH,true);
                binddingModelValue = value.value;
                if( !binddingModelValue || !(binddingModelValue.type ==='MemberExpression' || binddingModelValue.type ==='Identifier') ){
                    binddingModelValue = null
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

            let bindValuePropName = null;
            if( item.isMemberProperty && ns ==="@binding" && attrLowerName ==='value'){
                bindValuePropName = propName;
                if( !isDOMAttribute){
                    data.props.push( this.createPropertyNode( this.createPropertyKeyNode(propName, value.name.stack ), value.value ) );
                }
                propName = 'modelValue';
            }

            if( item.value && item.value.isJSXExpressionContainer && !item.value.expression.isLiteral ){
                pureStaticAttributes = false;
            }

            if( item.value && !item.value.isLiteral && (ns !=="@binding" || item.isMemberProperty || item.value.isJSXExpressionContainer) ){
                const isLiteral = item.value.isJSXExpressionContainer ? item.value.expression.isLiteral : false;
                if( !isLiteral ){
                    const keyProps = data.keyProps || (data.keyProps = []);
                    if( bindValuePropName ){
                        keyProps.push( this.createLiteralNode(bindValuePropName, void 0, value.name.stack) );
                    }
                    keyProps.push( this.createLiteralNode(propName, void 0, value.name.stack) );
                    this.addPatchFlag(data, ELEMENT_PROPS, true);
                }
            }

            if( item.isMemberProperty && !isDOMAttribute){
                data.props.push( this.createPropertyNode( this.createPropertyKeyNode(propName, value.name.stack ), value.value ) );
                if( ns !=="@binding" )return;
            }

            if( attrLowerName === 'type' && nodeType ==="input" && propValue  && propValue.type ==="Literal"){
                const value = propValue.value.toLowerCase();
                if( value ==='checkbox' ){
                    afterDirective = 'vModelCheckbox';
                }else if( value ==='radio' ){
                    afterDirective='vModelRadio';
                }
                pureStaticAttributes = false;
            }

            if( ns ==="@binding" ){
                if( custom && binddingModelValue){
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
                                binddingModelValue.isReflectSetter ? binddingModelValue : this.createAssignmentNode(
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

            if(!ns && (attrLowerName ==='ref' || attrLowerName ==='refs')){
                propName = name = 'ref';
                pureStaticAttributes = false;
                let useArray = inFor || attrLowerName ==='refs';
                if(useArray){
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

            const property = this.createPropertyNode( this.createPropertyKeyNode(propName, value.name.stack), propValue );
            switch(name){
                case "class" :
                    if( item.value && !item.value.isLiteral && !isComponent){
                        this.addPatchFlag(data, ELEMENT_CLASS, true);
                    }
                    data[name] = property
                    break;
                case "style" :
                    if( item.value && !item.value.isLiteral && !isComponent ){
                        this.addPatchFlag(data,ELEMENT_STYLE, true);
                    }
                    data[name] = property
                    break;
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
                    if(!isComponent && childNodes.length>1){
                        this.addPatchFlag(data,ELEMENT_NEED_PATCH,true);
                    }
                    data[name] = property
                    break;
                case "value" :
                default:
                    data.attrs.push( property );
            }
        });

        const fillKey = this.plugin.options.fillKey;
        if( !data.key && fillKey ){
            const fillAll = fillKey === true;
            const fillFlags = fillAll ? ['for','each','if','else'] : Array.isArray(fillKey) ? fillKey : [];
            if( inFor ){
                let allow = ['for','each'].filter( item=>fillAll || fillFlags.includes(item) );
                if( fillAll || allow.length > 0 ){
                    let key;
                    let isForContext = false
                    if( !stack.isDirective && stack.directives ){
                        const directive = stack.directives.find( directive=>allow.includes(directive.name.value()) );
                        if( directive ){
                            isForContext = true;
                            const valueArgument = directive.valueArgument;
                            key = valueArgument.declare.index || valueArgument.declare.key;
                        }
                    }
                    if( !isForContext && stack.parentStack.isDirective && allow.includes(stack.parentStack.openingElement.name.value())){
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
                        binary.left = binary.createLiteralNode( String(this.getNodeDepthPath(stack))+'.' );
                        binary.right = binary.createIdentifierNode( key || 'key');
                        binary.operator = '+';
                        data.key = this.createPropertyNode( this.createIdentifierNode('key'), binary );
                        pureStaticAttributes = false;
                    }else if(fillAll){
                        data.key = this.createKeyPropertyNode( stack ); 
                    }
                }

            }else{
                let hasDirective = fillAll;
                if( !hasDirective ){
                    let allow = ['if','else'].filter( item=>fillAll || fillFlags.includes(item) );
                    hasDirective = !stack.isDirective && allow.length > 0 && stack.directives && stack.directives.some( directive=>allow.includes(directive.name.value()) );
                    if( !hasDirective && allow.length > 0 && stack.parentStack.isDirective && allow.includes(stack.parentStack.openingElement.name.value()) ){
                        hasDirective = true;
                    }
                }
                if( hasDirective ){
                    data.key = this.createKeyPropertyNode( stack );
                }
            }
        }

        data.pureStaticAttributes = pureStaticAttributes;

        // if( data.key && ( (data.patchFlag & ELEMENT_PROPS) === ELEMENT_PROPS ) && stack.isWebComponent ){
        //     this.addPatchFlag(data,ELEMENT_FULL_PROPS);
        // }
    }

    createKeyPropertyNode( stack ){
        return this.createPropertyNode(
            this.createIdentifierNode('key'), 
            this.createLiteralNode( this.getNodeDepthPath(stack) )
        );
    }

    getNodeDepthPath(stack){
        let parentStack = stack.parentStack;
        while(parentStack){
            if(parentStack.isJSXElement || parentStack.isJSXExpressionContainer || parentStack.isMethodDefinition || parentStack.isBlockStatement || parentStack.isProgram)break;
            parentStack = parentStack.parentStack;
        }
        if( parentStack && (parentStack.isJSXElement || parentStack.isJSXExpressionContainer) ){
            const index = stack.childIndexAt;
            const prefix = this.getNodeDepthPath(parentStack);
            return prefix ? prefix+'.'+index : index;
        }
        return stack.childIndexAt;
    }

    createCalleeVueApiNode( name ){
        return this.createIdentifierNode( 
            this.getVueImportContext(name)
        );
    }

    createFragmentNode(children , props, flags, disableStack=true){
        const args = disableStack ? [
            this.createLiteralNode(true)
        ] : []
        const openBlock = this.createCalleeNode( this.createCalleeVueApiNode('openBlock'),args);
        const callee =  this.createCalleeNode(
            this.createCalleeVueApiNode('createElementBlock'),
            [
                this.createCalleeVueApiNode('Fragment'),
                props ? props : this.createLiteralNode( null),
                children,
                this.createLiteralNode(flags||ELEMENT_UNKEYED_FRAGMENT)
            ]
        );
        const node = this.createParenthesNode(this.createSequenceNode([openBlock,callee]));
        node.isElementVNode = true;
        node.isFragmentVNode = true;
        return node;
    }

    createVueToDisplayStringNode(node){
        return this.createCalleeNode( this.createCalleeVueApiNode('toDisplayString'),[
            node
        ]);
    }

    createConditionNode(test, consequent, alternate){
        const node = this.createNode('ConditionalExpression');
        node.test = test;
        node.consequent = consequent;
        node.alternate = alternate;
        test.parent = node;
        consequent.parent = node;
        alternate.parent = node;
        return node;
    }

    createBinaryNode(left, right, operator){
        const node = this.createNode('BinaryExpression');
        node.left = left;
        node.right = right;
        node.operator = operator;
        left.parent = node;
        right.parent = node;
        return node;
    }

    createIterationNode(name, refs, refName, element, item, key, index, flags){

        if(flags===true){
            flags = ELEMENT_KEYED_FRAGMENT;
        }
        
        if( name ==="each"){
            const args = [ this.createIdentifierNode(item) ];
            if(key){
                args.push( this.createIdentifierNode(key) );
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
            return this.createFragmentNode(node, null, flags);
        }else{
            const node = this.createCalleeNode(
                this.createParenthesNode( 
                    this.createForInNode(refName, element, item, key, index) 
                ),
                [
                    refs
                ]
            );
            return this.createFragmentNode( node, null, flags);
        }
    }

    createVueBlockVNode(isComponent, args, flag, stack){
        stack = stack && stack.openingElement ? stack.openingElement.name : null;
        const openBlockArgs  = [];
        if(flag){
            openBlockArgs.push( this.createLiteralNode(true) );
        }
        const openBlock = this.createCalleeNode( this.createCalleeVueApiNode('openBlock'), openBlockArgs );
        const callee =  this.createCalleeNode(
            this.createCalleeVueApiNode( isComponent ? 'createBlock' : 'createElementBlock'),
            args,
            stack
        );
        let node = this.createParenthesNode(this.createSequenceNode([openBlock,callee]));
        node.isElementVNode = true;
        return node;
    }

    createVueVNode(isComponent, args, stack, data){
        stack = stack && stack.openingElement ? stack.openingElement.name : null;
        if(data.patchFlag === ELEMENT_HOISTED && this.builder.__scopeId){
            const Component = this.builder.getModuleById('web.components.Component')
            this.addDepend(Component);
            const scopeId = String(this.plugin.options.scopeIdPrefix||"")+this.builder.__scopeId;
            const node = this.createCalleeNode(
                this.createMemberNode([
                    this.getModuleReferenceName(Component), 
                    this.createIdentifierNode('createHoistedVnode')
                ]),
                [...args.slice(0,3), this.createLiteralNode(scopeId)],
                stack
            );
            node.isElementVNode = true;
            return node;
        }
        let node = this.createCalleeNode(
            this.createCalleeVueApiNode( isComponent ? 'createVNode' : 'createElementVNode'),
            args,
            stack
        );
        node.isElementVNode = true;
        return node;
    }

    isBlockNode( stack ){
        const isRoot = stack.jsxRootElement === stack;
        if( isRoot )return true;
        if( stack.isDirective || (stack.directives && stack.directives.length>0)){
            let isShowDirective = false;
            if( !stack.isDirective && stack.directives.length === 1 ){
                isShowDirective = stack.directives[0].name.value() === 'show';
            }
            return !isShowDirective;
        }else if( stack.parentStack && stack.parentStack.isDirective ){
            let isShowDirective = stack.parentStack.openingElement.name.value() === 'show';
            return !isShowDirective && stack.parentStack[childrenNumKey]===1;
        }else if(stack.jsxRootElement === stack.parentStack){
            return stack.parentStack[childrenNumKey]===1;
        }else{
            const desc = stack.description();
            if(desc){
                const type = desc.type();
                if(type && type.isModule){
                    const Fragment = this.builder.getGlobalModuleById('web.components.Fragment');
                    return Fragment.is(type);
                }
            }
        }
        return false;
    }

    hasForAttrDirective(stack){
        if( stack.directives && stack.directives.length>0 ){
            return stack.directives.some( dir=>dir.name.value() === 'for' || dir.name.value()==='each') 
        }
        return false;
    }

    isForDirective(stack, flag=false){
        if(!stack)return false;
        if(stack.parentStack && stack.parentStack.isDirective){
            const openingElement = stack.parentStack.openingElement;
            const name = openingElement.name.value().toLowerCase();
            return name ==='for' || name ==='each';
        }
        return this.hasForAttrDirective(stack);
    }


    makeHTMLElement(stack, data, children, isBlockNode){
        const isJsxProgram = stack.compilation.JSX && stack.parentStack.isProgram;
        const isComponent = stack.isComponent && !isJsxProgram;
        const isRoot = stack.jsxRootElement === stack;
        let isBlock = isBlockNode;
        let name = null;
        let isFragment = false;
        let childNodes = null;
        let props = data.keyProps;
        let patchFlag = data.patchFlag;

        if( !isComponent && Array.isArray(children) && children.length > 0 ){
            if(children.length === 1 && data.hasTextChild){
                childNodes = children[0];
            }else if(data.hasUnexplicitExpressionChild){
                childNodes = this.createComponentNormalChildrenNode(children.length===1 ? children[0] : this.createArrayNode(children));
            }
            else{
                if(isRoot && children.length >1)isFragment = true;
                childNodes = this.createArrayNode(children);
                childNodes.newLine=true;
            }
        }else if(children && (children.type==="ObjectExpression" || children.type==="ArrayExpression") ){
            childNodes = children;
        }

        if( isRoot && isJsxProgram && !isFragment && childNodes && childNodes.type==="ArrayExpression" && childNodes.elements.length ===1 ){
            return childNodes.elements[0];
        }
      
        if( isComponent ){
            const desc = stack.description();
            if( desc.isModule && desc.isClass ){
                name = this.createIdentifierNode( this.getModuleReferenceName( desc ) );
            }else{
                name = this.createIdentifierNode(stack.openingElement.name.value(), stack.openingElement.name);
            }
        }
        else{
            name = this.createLiteralNode(stack.openingElement.name.value(), void 0, stack.openingElement.name);
        }
        
        const dataObject = this.makeConfig(data);
        const items = [name, null, null, null, null];

        let pos = 1;
        if( dataObject ){
            pos = 2;
            items[1] = dataObject;
        }

        if( childNodes ){
            pos = 3;
            items[2] = childNodes;
        }

        if( patchFlag ){
            pos = 4;
            items[3] = this.createLiteralNode( patchFlag );
        }

        if( props && props.length > 0 ){
            pos = 5;
            items[4] = this.createArrayNode( props );
        }

        const args = items.slice(0,pos).map( item=>item || this.createLiteralNode(null));
        if( isBlock ){
            return this.createVueBlockVNode(isComponent, args, false, stack);
        }else{
            return this.createVueVNode(isComponent, args, stack, data);
        }
    }

    makeDirectiveElement(stack, children){
        const openingElement = stack.openingElement;
        const name = openingElement.name.value().toLowerCase();
        if( children && Array.isArray(children) ){
            if(children.length === 1){
                children = children[0];
            }else{
                const isFor = name ==='each' || name==='for';
                const hasKey = isFor && children.every( item=>!!item.hasKey );
                children = this.createArrayNode(children);
                children.newLine=true;
                if( isFor ){
                    children = this.createFragmentNode(children, null, hasKey ? ELEMENT_KEYED_FRAGMENT : ELEMENT_UNKEYED_FRAGMENT, false);
                }else{
                    children = this.createFragmentNode(children, this.createObjectNode([this.createKeyPropertyNode( stack )]), ELEMENT_STABLE_FRAGMENT, false);
                }
            }
        }

        switch( name ){
            case 'custom' :
            case 'show' :
                return children;
            case 'if' :
            case 'elseif' :
                const condition = this.createToken( stack.attributes[0].parserAttributeValueStack() )
                const node = this.createNode('ConditionalExpression')
                node.test = condition;
                node.consequent = children
                return node;
            case 'else' :
                return children;
            case 'for' :
            case 'each' :
                const attrs = stack.openingElement.attributes;
                const argument = {};
                attrs.forEach( attr=>{
                    if( attr.name.value()==='name'){
                        argument[ 'refs' ] = this.createToken( attr.parserAttributeValueStack() );
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

    create(stack, ctx){

        const isRoot = stack.jsxRootElement === stack;
        const data = this.getElementConfig();
        const keyProps = data.keyProps || (data.keyProps = []);
        const children = stack.children.filter(child=>!( (child.isJSXScript && child.isScriptProgram) || child.isJSXStyle) );
        const isWebComponent = stack.isWebComponent && !(stack.compilation.JSX && stack.parentStack.isProgram);
        let componentDirective = this.getComponentDirectiveForDefine( stack );
        let hasDynamicSlots = false;
        data.patchFlag = 0;
        stack[childrenNumKey] = children.length;
        
        let childNodes =this.makeChildren(children, data, stack);

        
        if( stack.isDirective && stack.openingElement.name.value().toLowerCase() ==="custom" ){
            componentDirective = true;
        }

        if( componentDirective ){
            if( childNodes.length > 1 ){
                const hasKey = childNodes.every( item=>!!item.hasKey );
                return this.createFragmentNode(this.createArrayNode(childNodes), null, hasKey ? ELEMENT_KEYED_FRAGMENT : ELEMENT_UNKEYED_FRAGMENT);
            }else if(childNodes.length > 0){
                return childNodes[0];
            }
            return null;
        }

        let isInheritComponentDirective = false;
        if(stack.parentStack && stack.parentStack.isDirective ){
            let dName = stack.parentStack.openingElement.name.value();
            if( dName === 'show' ){
                if( stack.isWebComponent ){
                    stack.parentStack.openingElement.warn(11000);
                }
                const condition= stack.parentStack.openingElement.attributes[0];
                data.directives.push(
                    this.createDirectiveNode('vShow', this.createToken( condition.parserAttributeValueStack() ) )
                );
            }else if( dName ==="custom" ){
                isInheritComponentDirective = this.createCustomDirective(stack.parentStack, data, (attr)=>{
                    if( attr.isInheritDirectiveProp ){
                        keyProps.push( this.createLiteralNode(attr.key.value) )
                        this.addPatchFlag(data, ELEMENT_PROPS);
                    }
                });
            }
        }

        if(this.makeDirectiveComponentProperties(stack, data, (attr)=>{
            if( attr.isInheritDirectiveProp ){
                keyProps.push( this.createLiteralNode(attr.key.value) )
                this.addPatchFlag(data, ELEMENT_PROPS);
            }
        })){
            isInheritComponentDirective = true;
        }
        
        this.makeAttributes(stack, childNodes, data, /*spreadAttributes*/);
        this.makeProperties(children, data);

        let normalDirectives = [];
        if( data.directives && data.directives.length > 0 ){
            normalDirectives = data.directives.filter( dire=>!dire.isInheritComponentDirective );
            if( normalDirectives.length > 0 ){
                this.addPatchFlag(data, ELEMENT_NEED_PATCH);
            }
        }

        if(isWebComponent && children.length>0){
            const desc = stack.description();
            if(desc && desc.isModule){
                const fullname = desc.getName();
                if(fullname === 'web.components.KeepAlive'){
                    hasDynamicSlots = true;
                }
            }
        }

        const ps = stack.parentStack.scope;
        if(!hasDynamicSlots){
            hasDynamicSlots = isWebComponent && (ps.isSlotScope || ps.isAttributeSlotScope || this.isForDirective(stack) || this.hasForAttrDirective(stack.parentStack) );
        }

        const isBlockNode = hasDynamicSlots || this.isBlockNode(stack) || isInheritComponentDirective;
        const isStaticHoisted = !(stack.isComponent || stack.isDirective || stack.isSlot || isBlockNode || normalDirectives.length > 0) 
                                && data.pureStaticChildren && data.pureStaticAttributes && !isInheritComponentDirective;

        if( isStaticHoisted ){
            this.addPatchFlag(data, ELEMENT_HOISTED);
        }

        if(hasDynamicSlots){
            this.addPatchFlag(data, ELEMENT_DYNAMIC_SLOTS);
        }

        if( isWebComponent && !(stack.isDirective || stack.isSlot) ){
            const properties = []
            if( childNodes && childNodes.length > 0 ){
                childNodes = this.createArrayNode(childNodes);
                childNodes.newLine=true;
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
                        node 
                    ));
                }
            } 

            if( properties.length > 0 ){

                if( (data.patchFlag & ELEMENT_DYNAMIC_SLOTS) === ELEMENT_DYNAMIC_SLOTS){
                    properties.push( this.createPropertyNode(
                        this.createIdentifierNode('_'), 
                        this.createLiteralNode(2) 
                    ))
                }else{
                    properties.push( this.createPropertyNode(
                        this.createIdentifierNode('_'), 
                        this.createLiteralNode(1)
                    ))
                }
                childNodes = this.createObjectNode( properties );
            }
        }

        var nodeElement = null;
        if( stack.isSlot ){
            childNodes = this.createArrayNode(childNodes);
            childNodes.newLine=true;
            nodeElement = this.makeSlotElement(stack, childNodes );
        }else if( stack.isDirective ){
            nodeElement = this.makeDirectiveElement(stack, childNodes);
        }else{
            nodeElement = this.makeHTMLElement(stack, data, childNodes, isBlockNode);
        }

        if( !nodeElement )return null;

        nodeElement.pureStaticChildren = false;
        if( isStaticHoisted ){
            let program = this.getParentByType('Program');
            if( !program.isProgram ){
                program = this.getParentByType('ClassDeclaration');
            }
            if(program){
                const hoisteKey = this.checkRefsName(`_hoisted_${this.hoisteNodes.length}_`, true, 0, program, false);
                const hoistedNode = this.createDeclarationNode( 'const', [this.createDeclaratorNode( hoisteKey, nodeElement)] );
                if( program.isProgram  ){
                    this.hoisteNodes.push(hoistedNode)
                }else{
                    program.body.push(hoistedNode);
                }
                nodeElement = this.createIdentifierNode(hoisteKey, stack.openingElement.name);
                nodeElement.isElementVNode = true;
                nodeElement.pureStaticChildren = true;
            }
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
            }
        }

        if( data.key ){
            nodeElement.hasKey = true;
        }

        return nodeElement;
    }


}
module.exports = JSXTransformV3Optimize;
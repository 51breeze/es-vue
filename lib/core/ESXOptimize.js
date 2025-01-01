import {
    getChildren,
    createChildNode,
    createSlotCalleeNode,
    getCascadeConditional,
    createCommentVNode,
    getComponentDirectiveAnnotation,
    getComponentEmitAnnotation,
    getBinddingEventName,
    createCustomDirectiveProperties,
    createComponentDirectiveProperties,
    createWithCtxNode,
    isDirectiveInterface,
    createSlotElementNode,
    createDirectiveElementNode,
    createDirectiveArrayNode,
    createWithDirectives,
    createElementKeyPropertyNode,
    createAttributeBindingEventNode,
    getDepth,
    createResolveAttriubeDirective,
    createElementPropsNode


} from "@easescript/transform/lib/core/ESX";

import NodeToken from "@easescript/transform/lib/core/Node"

import Namespace from "easescript/lib/core/Namespace";
import Utils from "easescript/lib/core/Utils";
import { compare, hasStyleScoped, createStaticReferenceNode, getMethodAnnotations, toFirstUpperCase,toCamelCase } from "./Common";


import {getCacheManager} from '@easescript/transform/lib/core/Cache'
const Cache = getCacheManager('common');
let hasStyleScopedKey = Symbol('hasStyleScoped')




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

function addPatchFlag(data, flag, isProps=false){
    if( (data.patchFlag & flag) !== flag ){
        if(data.hasDynamicKeys && isProps && flag !== ELEMENT_FULL_PROPS){
            return
        }
        if(flag===ELEMENT_HOISTED){
            data.patchFlag = ELEMENT_HOISTED
        }else if(flag===ELEMENT_BAIL){
            data.patchFlag = ELEMENT_BAIL
        }else{
            data.patchFlag |= flag;
        }
    }
};

function createToDisplayStringNode(ctx, node){
    return ctx.createCallExpression(
        ctx.getVNodeApi('toDisplayString'),
        [
            node
        ]
    );
}

function isOpenBlock( stack, childrenNum ){
    const isRoot = stack.jsxRootElement === stack;
    if( isRoot )return true;
    if( stack.isDirective || (stack.directives && stack.directives.length>0)){
        let isShowDirective = false;
        if( !stack.isDirective && stack.directives.length === 1 ){
            isShowDirective = compare(stack.directives[0].name.value(), 'show');
        }
        return !isShowDirective;
    }else if( stack.parentStack && stack.parentStack.isDirective ){
        let isShowDirective = compare(stack.parentStack.openingElement.name.value(),'show');
        return !isShowDirective && childrenNum===1;
    }else if(stack.jsxRootElement === stack.parentStack){
       // return childrenNum===1;
    }else{
        const desc = stack.descriptor();
        if(desc){
            const type = desc.type();
            if(Utils.isModule(type)){
                return Namespace.globals.get('web.components.Fragment').is(type);
            }
        }
    }
    return false;
}

function createChildren(ctx, children, data, stack, isWebComponent){
    let content = [];
    let len = children.length;
    let index = 0;
    let last = null;
    let result = null;
    let pureStaticChild = true;
    let next = ()=>{
        if(index<len){
            const child = children[index++];
            const childNode = createChildNode(
                ctx,
                child,
                ctx.createToken(child),
                last
            ) || next();

            if( child.directives && child.directives.length > 0 ){
                pureStaticChild = false;
            }else if( childNode && childNode.pureStaticChild === false ){
                pureStaticChild = false;
            }

            if( child.hasAttributeSlot ){
                pureStaticChild = false;
                const attributeSlot = child.openingElement.attributes.find(attr=>attr.isAttributeSlot);
                if( attributeSlot ){
                    const name = attributeSlot.name.value();
                    const scopeName = attributeSlot.value ? 
                            ctx.createToken(
                                attributeSlot.parserSlotScopeParamsStack()
                            ) : null;
                    let childrenNodes = childNode.content;
                    if( childrenNodes.length ===1 && childrenNodes[0].type ==="ArrayExpression" ){
                        childrenNodes = childrenNodes[0];
                    }else{
                        childrenNodes = ctx.createArrayExpression(childrenNodes);
                    }
                    const params = scopeName ? [ 
                        ctx.createAssignmentExpression(
                            scopeName,
                            ctx.createObjectExpression()
                        ) 
                    ] : [];
                    const renderSlots= createSlotCalleeNode(
                        ctx,
                        child, 
                        ctx.createArrowFunctionExpression(childrenNodes, params)
                    );
                    data.slots[name] = renderSlots
                    return next();
                }
            }else if( child.isSlot && !child.isSlotDeclared ){
                pureStaticChild = false;
                const name = child.openingElement.name.value();
                data.slots[name] = childNode.content[0]
                return next();
            }else if( child.isDirective ){
                pureStaticChild = false;
                childNode.cmd.push(
                    child.openingElement.name.value().toLowerCase()
                )
            }
            return childNode;
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
                pureStaticChild = false;
                if( result && result.cmd.includes('elseif') ){
                    result.cmd = last.cmd.concat( result.cmd );
                    result.content = last.content.concat( result.content );
                }else if(result && result.cmd.includes('else') ){
                    value = getCascadeConditional( last.content.concat( result.content ) );
                    result.ifEnd = true;
                }else{
                    if(result)result.ifEnd = true;
                    last.content.push( createCommentVNode(ctx, 'end if') );
                    value = getCascadeConditional( last.content );
                }
            }else if( !( last.ifEnd && last.cmd.includes('else') ) ) {
                value = last.content;
            }
            push(content, value);
        }
        last = result;
        if( !result )break;
    }

    data.pureStaticChild = pureStaticChild;

    if(content.length>1){
        let hasText = false;
        const nodes = content.reduce((acc, item)=>{
            if(!hasText && item.type==="Literal"){
                hasText = true;
            }
            if((item.type==="Literal" || item.isScalarType) && acc.length>0){
                let index = acc.length-1;
                let last = acc[index];
                if(item.type === last.type && last.type==="Literal"){
                    last.value += item.value;
                    last.raw = `"${last.value}"`;
                    return acc;
                }else if(last.type==="Literal" || last.isScalarType){
                    const node = ctx.createBinaryExpression(
                        last,
                        item,
                        '+'
                    );
                    node.isMergeStringNode = true;
                    node.isScalarType = true;
                    node.isExpressionContainer = !!(last.isExpressionContainer || item.isExpressionContainer);
                    acc.splice(index,1,node);
                    return acc;
                }
            }
            acc.push(item);
            return acc;
        },[]);
        if(hasText){
            return makeTextChildrenNodes(ctx, nodes);
        }
        return nodes;
    }
    if(isWebComponent){
        return makeTextChildrenNodes(ctx, content);
    }
    return content;
}

function makeTextChildrenNodes(ctx, nodes){
    return nodes.map(node=>{
        if(node.type==="Literal" || (node.isMergeStringNode && !node.isExpressionContainer)){
            node = ctx.addStaticHoisted(
                createTextVNode(ctx, node, ELEMENT_HOISTED)
            );
            node.pureStaticChild = true;
        }
        return node;
    })
}


function createAttributes(ctx, stack, data){
    const ssr = !!ctx.options.ssr;
    const pushEvent=(name, node, category)=>{
        if(ssr && category==='on')return;
        let events =  data[ category ] || (data[category]=[]);
        if(!NodeToken.is(name)){
            name = String(name)
            name = name.includes(':') ? ctx.createLiteral(name) : ctx.createIdentifier(name)
        }

        let property = ctx.createProperty(name, node);
        if( property.key.computed ){
            property.computed = true;
            property.key.computed = false;
        }

        if(category==='on'){
            if(property.computed){
                property.key = ctx.createTemplateLiteral([
                    ctx.createTemplateElement('on')
                ],[
                    ctx.createCallExpression(
                        createStaticReferenceNode(ctx, stack, 'System', 'firstUpperCase'),
                        [
                            property.key
                        ]
                    )
                ]);
            }else{
                property.key.value = 'on'+toFirstUpperCase(property.key.value);
                if(property.key.type==="Literal"){
                    property.key.raw = `"${property.key.value}"`;
                }
            }
        }
           
        events.push( property );
    }

    const createPropertyNode = (propName, propValue)=>{
        return ctx.createProperty(
            propName.includes('-') ? ctx.createLiteral(propName) : ctx.createIdentifier(propName),
            propValue
        )
    }

    let isComponent = stack.isComponent || stack.isWebComponent;
    let nodeType = !isComponent ? stack.openingElement.name.value().toLowerCase() : null;
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

    const forStack = stack.getParentStack(stack=>{
        return stack.scope.isForContext || !(stack.isJSXElement || stack.isJSXExpressionContainer)
    },true);
    const inFor = forStack && forStack.scope && forStack.scope.isForContext ? true : false;

    const descModule = stack.isWebComponent ? stack.description() : null;
    const definedEmits = getComponentEmitAnnotation(descModule);
    const getDefinedEmitName = (name)=>{
        if(definedEmits && Object.prototype.hasOwnProperty.call(definedEmits, name)){
            name = toCamelCase(definedEmits[name]);
        }
        return name;
    }

    let pureStaticAttributes = true;

    stack.openingElement.attributes.forEach(item=>{
        if(item.isAttributeXmlns)return;
        if(item.isAttributeDirective){
            if( item.isAttributeDirective ){
                pureStaticAttributes = false;
                const name = item.name.value();
                if(compare(name, 'show')){
                    data.directives.push(
                        createDirectiveArrayNode(
                            ctx,
                            'vShow',
                            ctx.createToken( item.valueArgument.expression )
                        )
                    );
                }else if(compare(name, 'custom')){
                    data.directives.push(
                        createResolveAttriubeDirective(
                            ctx,
                            item
                        )
                    )
                }
            }
            return;
        }else if(item.isJSXSpreadAttribute){
            if(item.argument){
                data.props.push(
                    ctx.createSpreadElement(
                        ctx.createToken(item.argument),
                        item
                    )
                );
                addPatchFlag(data, ELEMENT_FULL_PROPS, true);
            }
            return;
        }else if( item.isAttributeSlot ){
            return;
        }

        let value = ctx.createToken( item );
        if(!value)return;

        let ns = value.namespace;
        let name = value.name.value;
        let propName = name;
        let propValue = value.value;
        let attrLowerName = name.toLowerCase();

        if(propValue && propValue.isExpressionContainer && propValue.type !== 'Literal'){
            pureStaticAttributes = false;
        }

        if( (ns ==="@events" || ns ==="@natives") ){
            pureStaticAttributes = false;
            name = getDefinedEmitName(name);
        }

        if( ns && ns.includes('::') ){
            let [seg, className] = ns.split('::',2);
            ns = seg;
            name = createStaticReferenceNode(ctx, item, className, name);
            name.computed = true;
            custom = name;
        }

        let isDOMAttribute = false;
        if( item.isMemberProperty ){
            let attrDesc = item.getAttributeDescription( stack.getSubClassDescription() );
            if( attrDesc ){
                isDOMAttribute = getMethodAnnotations(attrDesc, ['domattribute']).length > 0;
            }
        }

        if( ns ==="@events" || ns ==="@natives" ){
            pushEvent(name, createAttributeBindingEventNode(ctx, item, propValue), 'on')
            return;
        }else if( ns ==="@binding" ){
            pureStaticAttributes = false;
            binddingModelValue = propValue;
            if( !binddingModelValue || !(binddingModelValue.type ==='MemberExpression' || binddingModelValue.type ==='Identifier') ){
                binddingModelValue = null;
                if(item.value && item.value.isJSXExpressionContainer){
                    const stack = item.value.expression;
                    if(stack && stack.isMemberExpression && !stack.optional){
                        binddingModelValue = ctx.createCallExpression(
                            createStaticReferenceNode(ctx, stack, 'Reflect', 'set'),
                            [
                                stack.module ? ctx.createIdentifier(stack.module.id) : ctx.createLiteral(null), 
                                ctx.createToken(stack.object), 
                                stack.computed ? ctx.createToken(stack.property) : ctx.createLiteral(stack.property.value()),
                                ctx.createIdentifier('value')
                            ],
                            stack
                        );
                        binddingModelValue.isReflectSetter = true;
                    }
                }
            }
        }
        
        let bindValuePropName = null;
        if( item.isMemberProperty ){
            if( ns ==="@binding" && attrLowerName ==='value'){
                bindValuePropName = propName;
                data.props.push(
                    createPropertyNode(
                        propName,
                        propValue
                    )
                );
                propName = 'modelValue';
            }
            if(!isDOMAttribute){
                data.props.push(
                    createPropertyNode(
                        propName,
                        propValue
                    )
                );
            }
        }

        if(propValue && propValue.type != 'Literal' && (ns !=="@binding" || item.isMemberProperty || propValue.isExpressionContainer)){
            if(bindValuePropName){
                data.keyProps.push( ctx.createLiteral(bindValuePropName) );
            }
            data.keyProps.push(ctx.createLiteral(propName));
            addPatchFlag(data, ELEMENT_PROPS, true);
        }

        if(item.isMemberProperty && !isDOMAttribute && ns !=="@binding"){
            return;
        }

        if( attrLowerName === 'type' && nodeType ==="input" && propValue  && propValue.type ==="Literal"){
            const value = propValue.value.toLowerCase();
            if( value ==='checkbox' ){
                afterDirective = 'vModelCheckbox';
                pureStaticAttributes = false;
            }else if( value ==='radio' ){
                afterDirective='vModelRadio';
                pureStaticAttributes = false;
            }
        }

        if( ns ==="@binding" ){
            const createBinddingParams = (getEvent=false)=>{
                return [
                    binddingModelValue.isReflectSetter ? 
                        binddingModelValue : 
                            ctx.createAssignmentExpression(
                                binddingModelValue,
                                getEvent ? 
                                    createGetEventValueNode(ctx) : 
                                        ctx.createIdentifier('e')
                            ),
                    [
                        ctx.createIdentifier('e')
                    ], 
                ]
            }

            if( custom && binddingModelValue ){
                pushEvent(custom , ctx.createArrowFunctionExpression(
                    ...createBinddingParams(!stack.isWebComponent)
                ), 'on');
            }else if( (stack.isWebComponent || afterDirective) && binddingModelValue ){

                let eventName = propName;
                if(propName ==='modelValue'){
                    eventName = 'update:modelValue';
                }

                if(item.isMemberProperty){
                    let _name = getBinddingEventName(item.description())
                    if(_name){
                        eventName = toCamelCase(_name);
                    }
                }

                pushEvent(
                    getDefinedEmitName(eventName),
                    ctx.createArrowFunctionExpression(
                        ...createBinddingParams()
                    ),
                'on');
    
            }else if( binddingModelValue ){
                pushEvent(
                    ctx.createIdentifier('input'),
                    ctx.createArrowFunctionExpression(
                        ...createBinddingParams(true)
                    ),
                'on');
            }
    
            if(afterDirective && binddingModelValue){
                data.directives.push(
                    createDirectiveArrayNode(ctx, afterDirective, binddingModelValue)
                );
            }
            return;
        }

        if( !ns && (attrLowerName ==='ref' || attrLowerName ==='refs') ){
            pureStaticAttributes = false;
            name = propName = 'ref';
            let useArray = inFor || attrLowerName ==='refs';
            if( useArray ){
                propValue = ctx.createArrowFunctionExpression(
                    ctx.createCallExpression(
                        ctx.createMemberExpression([
                            ctx.createThisExpression(),
                            ctx.createIdentifier('setRefNode')
                        ]),
                        [
                            value.value,
                            ctx.createIdentifier('node'),
                            ctx.createLiteral( true )
                        ]
                    ),
                    [
                        ctx.createIdentifier('node')
                    ], 
                );
            }
        }
        
        if(name==='class' || name==='staticClass'){
            if(propValue && propValue.type !== 'Literal'){
                propValue = ctx.createCallExpression(
                    ctx.createIdentifier(
                        ctx.getVNodeApi('normalizeClass')
                    ),
                    [
                        propValue
                    ]
                );
            }
        }else if(name==='style' || name==='staticStyle'){
            if(propValue && !(propValue.type === 'Literal' || propValue.type === 'ObjectExpression')){
                propValue = ctx.createCallExpression(
                    ctx.createIdentifier(
                        ctx.getVNodeApi('normalizeStyle')
                    ),
                    [propValue]
                );
            }
        }else if(attrLowerName==='key' || attrLowerName==='tag'){
            name = attrLowerName
        }

        const property = createPropertyNode(
            propName,
            propValue
        );

        switch(name){
            case "class" :
                if(item.value && !item.value.isLiteral && !isComponent){
                    addPatchFlag(data, ELEMENT_CLASS, true);
                }
            case "style" :
                if(item.value && !item.value.isLiteral && !isComponent ){
                    addPatchFlag(data, ELEMENT_STYLE, true);
                }
            case "ref" :
            case "key" :
            case "tag" :
                data[name] = property
                break;
            default:
                if(item.isMemberProperty){
                    data.props.push( property );
                }else{
                    data.attrs.push( property );
                }
        }
    });

    if(!data.key){
        data.key = createElementKeyPropertyNode(ctx, stack)
    }
    data.pureStaticAttributes = pureStaticAttributes;
}

function createTextVNode(ctx, node, flags=null){
    let args = [
        node
    ];
    if(flags!==null){
        args.push(ctx.createLiteral(flags))
    }
    let text = ctx.createCallExpression(
        ctx.createIdentifier(ctx.getVNodeApi('createTextVNode')),
        args
    );
    text.isTextVNode = true;
    return text;
}

function createFragmentVNode(ctx, children, props, flags, disableStack=true){
    const openBlock = ctx.createCallExpression(
        ctx.createIdentifier(
            ctx.getVNodeApi('openBlock')
        ),
        disableStack ? [
            ctx.createLiteral(true)
        ] : []
    );
    const nodeFlags = flags>0 ? ctx.createLiteral(flags) : null;
    const args = [
        ctx.createIdentifier(ctx.getVNodeApi('Fragment')),
        props ? props : ctx.createLiteral( null),
        children
    ]
    if(nodeFlags){
        args.push(nodeFlags);
    }
    const createVNode =  ctx.createCallExpression(
        ctx.createIdentifier(
            ctx.getVNodeApi('createElementBlock')
        ),
        args
    );
    const node = ctx.createParenthesizedExpression(
        ctx.createSequenceExpression([openBlock,createVNode])
    );
    node.isElementVNode = true;
    node.isFragmentVNode = true;
    return node;
}

function createElementBlockVNode(ctx, stack, isComponent, args, disableStack){
    stack = stack && stack.openingElement ? stack.openingElement.name : null;
    let openBlockArgs  = [];
    if(disableStack){
        openBlockArgs.push(ctx.createLiteral(true));
    }
    let openBlock = ctx.createCallExpression(
        ctx.createIdentifier(
            ctx.getVNodeApi("openBlock")
        ), 
        openBlockArgs
    );
    let callee =  ctx.createCallExpression(
        ctx.createIdentifier(ctx.getVNodeApi(isComponent ? 'createBlock' : 'createElementBlock')),
        args,
        stack
    );
    let node = ctx.createParenthesizedExpression(
        ctx.createSequenceExpression([
            openBlock,
            callee
        ])
    );
    node.isElementVNode = true;
    return node;
}

function createElementVNode(ctx, stack, isComponent, args, data){
    stack = stack && stack.openingElement ? stack.openingElement.name : null;
    if(data.patchFlag === ELEMENT_HOISTED && data['class'] && stack.isModuleForWebComponent(stack.module)){
        let scopeId = Cache.get(stack.compilation, hasStyleScopedKey);
        if(scopeId==null){
            if(hasStyleScoped(stack.compilation)){
                Cache.set(stack.compilation, hasStyleScopedKey, scopeId=ctx.getHashId())
            }else{
                Cache.set(stack.compilation, hasStyleScopedKey, scopeId="")
            }
        }
        if(scopeId){
            scopeId = String(ctx.options.vue.scopePrefix||"")+scopeId;
            const node = ctx.createCallExpression(
                createStaticReferenceNode(ctx, stack, "web.components.Component", "createHoistedVnode"),
                [
                    ...args.slice(0,3),
                    ctx.createLiteral(scopeId)
                ],
                stack
            );
            node.isElementVNode = true;
            return node;
        }
    }
    let node = ctx.createCallExpression(
        ctx.createIdentifier(
            ctx.getVNodeApi( isComponent ? 'createVNode' : 'createElementVNode')
        ),
        args,
        stack
    );
    node.isElementVNode = true;
    return node;
}

const excludes = ["patchFlag", "hasMultipleChildNodes","pureStaticAttributes","pureStaticChild"];
function makeElementVNode(ctx,stack,data,children,isBlock){

    const isJsxProgram = stack.compilation.JSX && stack.parentStack.isProgram;
    const isComponent = stack.isComponent && !isJsxProgram;
    const isRoot = stack.jsxRootElement === stack;
    let name = null;
    let isFragment = stack.isJSXFragment;
    let childNodes = children;
    let props = data.keyProps;
    let patchFlag = data.patchFlag;
    let desc = null;

    if(!isComponent){
        if(data.hasMultipleChildNodes){
            isFragment = true;
        }
    }

    if( isRoot && isJsxProgram && !isFragment && childNodes && !data.hasMultipleChildNodes && childNodes.type==="ArrayExpression" && childNodes.elements.length ===1){
        return childNodes.elements[0];
    }

    if(isComponent){
        desc = stack.descriptor();
        if(Utils.isModule(desc)){
            ctx.addDepend(desc)
            name = ctx.createIdentifier(
                ctx.getModuleReferenceName(desc, stack.module)
            );
        }else{
            name = ctx.createIdentifier(
                stack.openingElement.name.value()
            );
        }
    }
    else{
        name = ctx.createLiteral(stack.openingElement.name.value());
    }

    let dataObject = createElementPropsNode(ctx, data, stack, excludes);
    let items = [name, null, null, null, null];
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
        items[3] = ctx.createLiteral( patchFlag );
    }

    if( props && props.length > 0 ){
        pos = 5;
        items[4] = ctx.createArrayExpression( props );
    }

    const args = items.slice(0,pos).map( item=>item || ctx.createLiteral(null));
    if(isBlock){
        return createElementBlockVNode(ctx, stack, isComponent, args, false);
    }else{
        return createElementVNode(ctx, stack, isComponent, args, data);
    }
}

function makeNormalChildren(ctx, children, data){
    if(!children.length)return null;
    if(children.some(item=>!!item.maybeIsArrayNodes)){
        let childNods = ctx.createArrayExpression(children);
        if( children.length > 1 ){
            childNods.newLine = children.some(item=>item.type ==="CallExpression");
        }
        data.hasMultipleChildNodes = true;
        return ctx.createCallExpression( 
            ctx.createMemberExpression([
                childNods,
                ctx.createIdentifier('reduce')
            ]),
            [
                ctx.createArrowFunctionExpression(
                    ctx.createCallExpression( 
                        ctx.createMemberExpression([
                            ctx.createIdentifier('acc'),
                            ctx.createIdentifier('concat')
                        ]),
                        [
                            ctx.createIdentifier('item')
                        ] 
                    ),
                    [
                        ctx.createIdentifier('acc'),
                        ctx.createIdentifier('item')
                    ]
                ),
                ctx.createArrayExpression()
            ]
        );
    }

    if(children.length === 1){
        let first = children[0];
        if(first.type == 'ArrayExpression' || first.isForNode){
            data.hasMultipleChildNodes = true;
            return first;
        }
    }else if(children.length > 1 && children.some(item=>item.type == 'ArrayExpression' || item.isForNode)){
        let base =  children.shift();
        if(!base.isForNode){
            base = ctx.createArrayExpression([base]);
        }
        data.hasMultipleChildNodes = true;
        return ctx.createCallExpression( 
            ctx.createMemberExpression([
                base,
                ctx.createIdentifier('concat')
            ]),
            children
        );
    }

    if( children.length > 1 ){
        let childNods = ctx.createArrayExpression(children);
        data.hasMultipleChildNodes = true;
        childNods.newLine = children.some(item=>item.type ==="CallExpression");
        return childNods;
    }
    return children[0];
}

function hasForAttrDirective(stack){
    if( stack.directives && stack.directives.length>0 ){
        return stack.directives.some( dir=>{
            const name = dir.name.value();
            return compare(name, 'for') || compare(name, 'each');
        }) 
    }
    return false;
}

function isForDirective(stack){
    if(!stack)return false;
    if(stack.parentStack && stack.parentStack.isDirective){
        const openingElement = stack.parentStack.openingElement;
        const name = openingElement.name.value();
        return compare(name, 'for') || compare(name, 'each');
    }
    return hasForAttrDirective(stack);
}

function createKeyPropertyNode(ctx, stack ){
    return ctx.createProperty(
        ctx.createIdentifier('key'), 
        ctx.createLiteral(getDepth(stack))
    );
}

function isPureStaticChild(children){
    return children.every(item=>!!(item.type==="Literal" || (item.isMergeStringNode && !item.isExpressionContainer) || item.pureStaticChild))
}

function createElement(ctx, stack){
    let data = {
        directives:[],
        slots:{},
        attrs:[],
        props:[],
        keyProps:[]
    };
    let isRoot = stack.jsxRootElement === stack;
    let isWebComponent = stack.isWebComponent && !(stack.compilation.JSX && stack.parentStack.isProgram);
    let rawChildren = getChildren(stack);
    let children = createChildren(ctx, rawChildren, data, stack, isWebComponent);
    let childNodes = makeNormalChildren(ctx, children, data);
    let desc = stack.descriptor();
    let componentDirective = getComponentDirectiveAnnotation(desc, true);
    let hasDynamicSlots = false;
    let nodeElement = null;
    let ps = stack.parentStack.scope;

    if( stack.isDirective && stack.openingElement.name.value().toLowerCase() ==="custom" ){
        componentDirective = true;
    }else if(stack.isComponent && isDirectiveInterface(desc)){
        componentDirective = true;
    }

    if(componentDirective){
        if(childNodes){
            if(data.hasMultipleChildNodes){
                let hasKey = children.every( item=>!!item.hasKeyAttribute );
                return createFragmentVNode(ctx, childNodes, null, hasKey ? ELEMENT_KEYED_FRAGMENT : ELEMENT_UNKEYED_FRAGMENT);
            }
        }
        return childNodes;
    }

    let isInheritComponentDirective = false;
    if(stack.parentStack && stack.parentStack.isDirective ){
        let dName = stack.parentStack.openingElement.name.value().toLowerCase();
        if( dName === 'show' ){
            const condition= stack.parentStack.openingElement.attributes[0];
            data.directives.push(
                createDirectiveArrayNode(
                    ctx,
                    'vShow',
                    ctx.createToken(condition.parserAttributeValueStack())
                )
            );
        }else if( dName ==="custom" ){
            isInheritComponentDirective = createCustomDirectiveProperties(ctx, stack.parentStack, data, (prop)=>{
                if(prop.isInheritDirectiveProp){
                    data.keyProps.push( ctx.createLiteral(prop.key.value) )
                    addPatchFlag(data, ELEMENT_PROPS);
                }
            });
        }
    }else{
        isInheritComponentDirective = createComponentDirectiveProperties(ctx, stack.parentStack, data,(prop)=>{
            if(prop.isInheritDirectiveProp){
                data.keyProps.push( ctx.createLiteral(prop.key.value) )
                addPatchFlag(data, ELEMENT_PROPS);
            }
        })
    }

    if(!stack.isJSXFragment){
        if(!(isRoot && stack.openingElement.name.value()==='root') ){
            createAttributes(ctx, stack, data)
        }
    }

    let normalDirectives = [];
    if( data.directives && data.directives.length > 0 ){
        normalDirectives = data.directives.filter( dire=>!dire.isInheritComponentDirective);
        if( normalDirectives.length > 0 ){
            addPatchFlag(data, ELEMENT_NEED_PATCH);
        }
    }

    if(!hasDynamicSlots){
        hasDynamicSlots = isWebComponent && (ps.isSlotScope || ps.isAttributeSlotScope || isForDirective(stack) || hasForAttrDirective(stack.parentStack) );
    }

    let pureStaticChild = data.pureStaticAttributes && data.pureStaticChild && isPureStaticChild(children);
    let isBlock = hasDynamicSlots || isOpenBlock(stack, children.length) || isInheritComponentDirective;
    let isStaticHoisted = !(stack.isComponent || stack.isDirective || stack.isSlot || isBlock || normalDirectives.length > 0) && pureStaticChild;
    if(!stack.isWebComponent){
        if(data.ref && data.hasMultipleChildNodes){
            addPatchFlag(data,ELEMENT_NEED_PATCH,true);
        }
        if(!isStaticHoisted && !data.hasMultipleChildNodes && childNodes && childNodes.isExpressionContainer){
            if(childNodes.isMergeStringNode || childNodes.isScalarType){
                addPatchFlag(data,ELEMENT_TEXT);
            }
        }
    }

    if(isStaticHoisted){
        addPatchFlag(data, ELEMENT_HOISTED);
    }

    if(hasDynamicSlots){
        addPatchFlag(data, ELEMENT_DYNAMIC_SLOTS);
    }

    if( isWebComponent && !(stack.isDirective || stack.isSlot)){
        let properties = []
        if(childNodes){
            if(Utils.isModule(desc)){
                let fullname = desc.getName();
                if(fullname === 'web.components.KeepAlive'){
                    hasDynamicSlots = true;
                }
            }

            if(!data.hasMultipleChildNodes && childNodes.type !=="ArrayExpression"){
                childNodes = ctx.createArrayExpression([childNodes])
            }

            properties.push( ctx.createProperty(
                ctx.createIdentifier('default'), 
                createWithCtxNode(
                    ctx,
                    ctx.createArrowFunctionExpression(childNodes)
                )
            ));
            childNodes = null;
        }

        if(data.slots){
            for(let key in data.slots){
                properties.push( 
                    ctx.createProperty(
                        ctx.createIdentifier(key), 
                        data.slots[key]
                    )
                );
            }
        } 

        if( properties.length > 0 ){
            childNodes = ctx.createObjectExpression( properties );
        }
    }

    if(stack.isSlot ){
        if(childNodes && !data.hasMultipleChildNodes && childNodes.type !=="ArrayExpression"){
            childNodes = ctx.createArrayExpression([childNodes])
        }
        nodeElement = createSlotElementNode(ctx, stack, childNodes);
    }else if(stack.isDirective){
        if(childNodes && data.hasMultipleChildNodes){
            nodeElement = createFragmentVNode(
                ctx,
                childNodes,
                ctx.createObjectExpression([createKeyPropertyNode(ctx,stack)]),
                ELEMENT_STABLE_FRAGMENT,
                false
            );
            nodeElement.hasKeyAttribute = true;
            childNodes = nodeElement;
        }
        nodeElement = createDirectiveElementNode(ctx, stack, childNodes);
    }else{
        if(stack.isJSXFragment || (isRoot && !isWebComponent && stack.openingElement.name.value()==='root')){
            if(data.hasMultipleChildNodes){
                nodeElement = createFragmentVNode(ctx, childNodes, null, ELEMENT_STABLE_FRAGMENT, !isRoot);
            }else{
                nodeElement = childNodes;
            }
        }else{
            nodeElement = makeElementVNode(ctx, stack, data, childNodes, isBlock);
        }
    }

    pureStaticChild = false;
    if(nodeElement && isStaticHoisted){
        pureStaticChild = true;
        nodeElement = ctx.addStaticHoisted(nodeElement);
    }

    if(nodeElement && data.directives && data.directives.length > 0){
        nodeElement = createWithDirectives(ctx, nodeElement, data.directives);
    }

    nodeElement.pureStaticChild = pureStaticChild;
    nodeElement.hasKeyAttribute = !!data.key;
    return nodeElement;
}


export * from "@easescript/transform/lib/core/ESX";
export {
    createElement,
}
import {
    getChildren,
    createForMapNode,
    createForEachNode,
    getCascadeConditional,
    createGetEventValueNode,
    createCommentVNode,
    getComponentDirectiveAnnotation,
    getComponentEmitAnnotation,
    getBinddingEventName,
    createCustomDirectiveProperties,
    createComponentDirectiveProperties,
    createWithCtxNode,
    isDirectiveInterface,
    createDirectiveArrayNode,
    createWithDirectives,
    createElementKeyPropertyNode,
    createAttributeBindingEventNode,
    getDepth,
    createSlotNode,
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
const emptyArray = [];

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


/**
 * 
 * 1、如果元素有指定key或者是顶级元素使用 createElementBlock 创建
 * 2、动态循环使用 Fragment 类型元素，通过 createElementBlock 创建，并禁用 openBlock(true) 元素栈。 第一级子级应使用 createElementBlock 创建。
 *      如果第一级子级都指定了 key 则 PatchFlag 指定为  KEYED_FRAGMENT 否则为 UNKEYED_FRAGMENT
 * 3、固定循环使用 Fragment 类型元素， 直接指定 PatchFlag 为 STABLE_FRAGMENT
 * 4、组件或者元素 指定了 ref 属性或者使用了指令 PatchFlag 指定为 NEED_PATCH
 * 5、组件子级是通过循环创建的(所有子级)  PatchFlag 指定为 DYNAMIC_SLOTS 则插槽对象添加 "_:2"（动态） 的属性， 否则添加 "_:1"（固定） 的属性
 * 
 */

function addPatchFlag(data, flag){
    if( (data.patchFlag & flag) !== flag ){
        if(flag===ELEMENT_HOISTED){
            data.patchFlag = ELEMENT_HOISTED
        }else if(flag===ELEMENT_BAIL){
            data.patchFlag = ELEMENT_BAIL
        }else{
            data.patchFlag |= flag;
            if(data.patchFlag & ELEMENT_PROPS){
                if(data.patchFlag & ELEMENT_CLASS)data.patchFlag ^= ELEMENT_CLASS;
                if(data.patchFlag & ELEMENT_STYLE)data.patchFlag ^= ELEMENT_STYLE;
                if(data.patchFlag & ELEMENT_NEED_PATCH)data.patchFlag ^= ELEMENT_NEED_PATCH;
            }
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

function isOpenBlock( stack ){
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
        return !isShowDirective;
    }else{
        const type = stack.type();
        if(Utils.isModule(type)){
            return Namespace.globals.get('web.components.Fragment').is(type);
        }
    }
    return false;
}

function createDirectiveDescriptor(ctx, stack, child, prev=null){
    if(!child)return null;
    let hasKeyAttribute = child.hasKeyAttribute;
    let pureStaticChild = child.pureStaticChild;
    if(stack.isJSXExpressionContainer && !child.isExplicitVNode && child.type==="CallExpression"){
        let origin = stack.expression.type();
        if(origin && origin.isTupleType){
            child = createFragmentVNode(ctx, child, null, hasKeyAttribute ? ELEMENT_KEYED_FRAGMENT : ELEMENT_UNKEYED_FRAGMENT, true);
        }
    }
    const cmd=[];
    if( !stack.directives || !(stack.directives.length > 0) ){
        return {
            cmd,
            stack,
            child
        };
    }
    const directives = stack.directives.slice(0).sort( (a,b)=>{
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
            let refs = ctx.createToken(valueArgument.expression);
            let item = ctx.createIdentifier(valueArgument.declare.item);
            let key  = ctx.createIdentifier(valueArgument.declare.key || 'key');
            let index = valueArgument.declare.index;
            if(index){
                index = ctx.createIdentifier(index)
            }
            makeNeedAddForIndexOfCacheNodes(ctx, stack, index || key);
            
            if( name ==="each"){
                child = createForEachNode(
                    ctx,
                    refs,
                    child,
                    item,
                    key,
                    stack
                );
            }else{
                child = createForMapNode(
                    ctx,
                    refs,
                    child,
                    item,
                    key,
                    index,
                    stack
                );
            }
            child = createFragmentVNode(ctx, child, null, hasKeyAttribute ? ELEMENT_KEYED_FRAGMENT : ELEMENT_UNKEYED_FRAGMENT, true);
            child.hasKeyAttribute = hasKeyAttribute;
            child.isForVNode = true;
            cmd.push(name);
        }else if( name ==="if" ){
            child = ctx.createConditionalExpression(ctx.createToken(valueArgument.expression), child);
            child.hasKeyAttribute = hasKeyAttribute;
            child.pureStaticChild = pureStaticChild;
            cmd.push(name);
        }else if( name ==="elseif" ){
            if(!prev || !(prev.cmd.includes('if') || prev.cmd.includes('elseif')) ){
                directive.name.error(1114, name);
            }else{
                cmd.push(name);
            }
            child = ctx.createConditionalExpression(ctx.createToken(valueArgument.expression), child)
            child.hasKeyAttribute = hasKeyAttribute;
            child.pureStaticChild = pureStaticChild;
        }else if( name ==="else"){
            if( !prev || !(prev.cmd.includes('if') || prev.cmd.includes('elseif')) ){
                directive.name.error(1114, name);
            }else{
                cmd.push(name);
            }
        }
    }
    return {
        cmd,
        stack,
        child
    };
}

function mergeConditionalNode(conditionExp, alternate){
    if(conditionExp.type !=="ConditionalExpression"){
        throw new Error('Invaild expression');
    }
    conditionExp.alternate = alternate;
    alternate.top = conditionExp.top || conditionExp;
    return alternate;
}

function createChildren(ctx, children, data){
    let content = [];
    let len = children.length;
    let index = 0;
    let last = null;
    let result = null;
    let pureStaticChild = true;
    let next = ()=>{
        if(index<len){
            const childStack = children[index++];
            const descriptor = createDirectiveDescriptor(
                ctx,
                childStack,
                ctx.createToken(childStack),
                last
            ) || next();

            if(pureStaticChild){
                if(childStack.directives && childStack.directives.length > 0){
                    pureStaticChild = false;
                }else if(descriptor.child){
                    pureStaticChild = isPureStaticChild(descriptor.child);
                }
            }

            if( childStack.hasAttributeSlot ){
                pureStaticChild = false;
                const attributeSlot = childStack.openingElement.attributes.find(attr=>attr.isAttributeSlot);
                if( attributeSlot ){
                    let name = attributeSlot.name.value();
                    let scopeName = attributeSlot.value ? 
                            ctx.createToken(
                                attributeSlot.parserSlotScopeParamsStack()
                            ) : null;
                    let childrenNodes = ctx.createArrayExpression(descriptor.child ? [descriptor.child] : []);
                    let params = scopeName ? [ 
                        ctx.createAssignmentExpression(
                            scopeName,
                            ctx.createObjectExpression()
                        ) 
                    ] : [];

                    let slotFn = ctx.createArrowFunctionExpression(childrenNodes, params);
                    if(isPureStaticChild(descriptor.child)){
                        slotFn = ctx.addStaticHoisted(slotFn);
                    }
                    let renderSlots= createSlotNode(
                        ctx,
                        childStack, 
                        slotFn
                    );
                    data.slots[name] = renderSlots
                    return next();
                }
            }else if( childStack.isSlot && !childStack.isSlotDeclared ){
                pureStaticChild = false;
                const name = childStack.openingElement.name.value();
                data.slots[name] = descriptor.child
                return next();
            }else if( childStack.isDirective ){
                pureStaticChild = false;
                descriptor.cmd.push(
                    childStack.openingElement.name.value().toLowerCase()
                )
            }
            return descriptor;
        }
        return null;
    }

    while(true){
        result = next();
        if(last){
            let value = null;
            const hasIf = last.cmd.includes('if');
            if( hasIf ){
                if( result && result.cmd.includes('elseif') ){
                    result.cmd = last.cmd.concat( result.cmd );
                    result.child = mergeConditionalNode(last.child, result.child);
                    if(last.child.hasKeyAttribute && result.child.hasKeyAttribute){
                        result.child.hasKeyAttribute =  true;
                    }
                }else if(result && result.cmd.includes('else') ){
                    value = mergeConditionalNode(last.child, result.child).top;
                    if(last.child.hasKeyAttribute && result.child.hasKeyAttribute){
                        value.hasKeyAttribute =  true;
                    }
                    result.ifEnd = true;
                }else{
                    if(result)result.ifEnd = true;
                    value = mergeConditionalNode(last.child, createCommentVNode(ctx, 'end if', true)).top;
                    if(last.child.hasKeyAttribute){
                        value.hasKeyAttribute =  true;
                    }
                }
            }else if( !(last.ifEnd && last.cmd.includes('else')) ) {
                value = last.child;
            }
            if(value){
                content.push(value);
            }
        }
        last = result;
        if( !result )break;
    }

    data.pureStaticChild = pureStaticChild;
    if(content.length>1){
        content = content.reduce((acc, item)=>{
            if((item.type==="Literal" || (item.isScalarType && item.isExpressionContainer)) && acc.length>0){
                let index = acc.length-1;
                let last = acc[index];
                if(item.type === last.type && last.type==="Literal"){
                    last.value += item.value;
                    last.raw = `"${last.value}"`;
                    return acc;
                }else if(last.type==="Literal" || (last.isScalarType && last.isExpressionContainer)){
                    const node = ctx.createBinaryExpression(
                        last,
                        item,
                        '+'
                    );
                    node.isMergeStringNode = true;
                    node.isScalarType = true;
                    acc.splice(index,1,node);
                    return acc;
                }
            }
            acc.push(item);
            return acc;
        },[]);
    }
    return content;
}

const forIndexMaps = new Map();
function needAddForIndexOfCacheNode(ctx, stack, node){
    if(!stack || !stack.jsxElement)return node;
    if(node.disableCacheForVNode)return node;
    let root = stack.jsxElement.jsxRootElement;
    let parent = root.getParentStack(parent=>parent.isFunctionExpression);
    if(!parent.isFunctionExpression || !parent.parentStack.isMethodDefinition){
        return node;
    }
    if(parent.parentStack.value() !=="render"){
        return node;
    }
    node = ctx.createCacheForVNode(stack, node)
    let scope = stack.scope;
    if(!scope.isForContext){
        return node;
        //scope = root.scope;
    }
    let items = forIndexMaps.get(scope);
    if(!items){
        forIndexMaps.set(scope, items=[]);
    }
    items.push(node);
    return node;
}

function makeNeedAddForIndexOfCacheNodes(ctx, stack, indexNode){
    if(!stack || !stack.jsxElement)return;
    let scope = stack.scope;
    if(!scope.isForContext){
        scope = stack.jsxElement.jsxRootElement.scope;
    }
    const cacheNodes = forIndexMaps.get(scope);
    if(cacheNodes && cacheNodes.length>0){
        if(indexNode){
            cacheNodes.forEach((node)=>{
                if(node.type==="LogicalExpression" && node.left.property.type === 'Literal'){
                    node.left.property = ctx.createBinaryExpression(ctx.createLiteral(node.left.property.value+":"), indexNode, '+');
                    node.right.expression.left.property = node.left.property;
                }
            });
        }
        forIndexMaps.delete(scope);
    }
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

        let property = ctx.createProperty(name, needAddForIndexOfCacheNode(ctx, stack, node));
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
    let inFor = !!stack.scope.isForContext;
    if( nodeType ==="input" ){
        afterDirective='vModelText';
    }else if( nodeType ==="select" ){
        afterDirective = 'vModelSelect';
    }else if( nodeType ==="textarea" ){
        afterDirective = 'vModelText';
    }
    
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
                pureStaticAttributes = false;
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

        if(propValue && propValue.hasInvokeHook){
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
        let binddingEventName = null;
        if( item.isMemberProperty ){
            if(ns==="@binding"){
                const bindding = getBinddingEventName(item.description())
                if(bindding){
                    if(bindding.alias){
                        propName = bindding.alias;
                    }
                    binddingEventName = toCamelCase(bindding.event);
                }else if(attrLowerName ==='value'){
                    bindValuePropName = propName;
                    data.props.push(
                        createPropertyNode(
                            propName,
                            propValue
                        )
                    );
                    propName = 'modelValue';
                }
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
            }else if( (stack.isWebComponent || afterDirective) && binddingModelValue){
                let eventName = binddingEventName;
                if(!eventName){
                    eventName = propName;
                    if(propName ==='modelValue'){
                        eventName = 'update:modelValue';
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

        if( !ns && (attrLowerName ==='ref'  || attrLowerName ==='refs') ){
            pureStaticAttributes = false;
            name = propName = 'ref';
            if(attrLowerName ==='refs' && !isDOMAttribute){
                inFor = true;
            }
            
            // let useArray = inFor || attrLowerName ==='refs';
            // if( useArray ){
            //     propValue = ctx.createArrowFunctionExpression(
            //         ctx.createCallExpression(
            //             ctx.createMemberExpression([
            //                 ctx.createThisExpression(),
            //                 ctx.createIdentifier('setRefNode')
            //             ]),
            //             [
            //                 value.value,
            //                 ctx.createIdentifier('node'),
            //                 ctx.createLiteral( true )
            //             ]
            //         ),
            //         [
            //             ctx.createIdentifier('node')
            //         ], 
            //     );
            // }
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

    if(data.ref && inFor){
        data.attrs.push(ctx.createProperty(
            ctx.createIdentifier('ref_for'),
            ctx.createLiteral(true)
        ));
    }

    if(!data.key){
        data.key = createElementKeyPropertyNode(ctx, stack);
        if(data.key && data.key.type !=='Literal'){
            pureStaticAttributes = false;
        }
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

function createFragmentVNode(ctx, children, props, flags=ELEMENT_STABLE_FRAGMENT, disableStack=true){
    const openBlock = ctx.createCallExpression(
        ctx.createIdentifier(
            ctx.getVNodeApi('openBlock')
        ),
        disableStack ? [
            ctx.createLiteral(true)
        ] : []
    );
    const nodeFlags = flags>0 ? makePatchFlagNode(ctx, flags) : null;
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
    node.isElementBlockVNode = true
    node.isElementVNode = true;
    return node;
}

function createElementVNode(ctx, stack, isComponent, args, data){
    stack = stack && stack.openingElement ? stack.openingElement.name : null;
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
function makeElementVNode(ctx,stack,data,childNodes,isBlock){
    let isComponent = stack.isComponent;
    let name = null;
    let props = data.keyProps;
    let patchFlag = data.patchFlag;
    let desc = null;
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

    if(dataObject){
        if(data.pureStaticAttributes && data.patchFlag !== ELEMENT_HOISTED){
            dataObject = ctx.addStaticHoisted(dataObject);
        }
        pos = 2;
        items[1] = dataObject;
    }

    if( childNodes ){
        pos = 3;
        items[2] = childNodes;
    }

    if( patchFlag ){
        pos = 4;
        items[3] = makePatchFlagNode(ctx, patchFlag );
    }

    if( props && props.length > 0 ){
        pos = 5;
        items[4] = ctx.addStaticHoisted(
            ctx.createArrayExpression(props)
        );
    }

    const args = items.slice(0,pos).map( item=>item || ctx.createLiteral(null));
    if(isBlock){
        return createElementBlockVNode(ctx, stack, isComponent, args, false);
    }else{
        return createElementVNode(ctx, stack, isComponent, args, data);
    }
}

function makePatchFlagNode(ctx, patchFlag){
    const comments = [];
    if(patchFlag===ELEMENT_HOISTED){
        comments.push('HOISTED');
    }else if(patchFlag===ELEMENT_BAIL){
        comments.push('BAIL');
    }else{
        if(patchFlag & ELEMENT_TEXT){
            comments.push('TEXT');
        }
        if(patchFlag & ELEMENT_CLASS){
            comments.push('CLASS');
        }
        if(patchFlag & ELEMENT_STYLE){
            comments.push('STYLE');
        }
        if(patchFlag & ELEMENT_PROPS){
            comments.push('PROPS');
        }
        if(patchFlag & ELEMENT_FULL_PROPS){
            comments.push('FULL_PROPS');
        }
        if(patchFlag & ELEMENT_HYDRATE_EVENTS){
            comments.push('HYDRATE_EVENTS');
        }
        if(patchFlag & ELEMENT_STABLE_FRAGMENT){
            comments.push('STABLE_FRAGMENT');
        }
        if(patchFlag & ELEMENT_KEYED_FRAGMENT){
            comments.push('KEYED_FRAGMENT');
        }
        if(patchFlag & ELEMENT_UNKEYED_FRAGMENT){
            comments.push('UNKEYED_FRAGMENT');
        }
        if(patchFlag & ELEMENT_NEED_PATCH){
            comments.push('NEED_PATCH');
        }
        if(patchFlag & ELEMENT_DYNAMIC_SLOTS){
            comments.push('DYNAMIC_SLOTS');
        }
    }
    return ctx.createChunkExpression( patchFlag +  [' /*',comments.join(', '),'*/'].join(''), false);
}

function createNormalVNode(ctx, childNode, toTextNode=false, disableHoisted=false, stack=null){
    if(!childNode)return createCommentVNode(ctx, 'is null');
    let node = childNode;
    if(childNode.type==="Literal"){
        if(toTextNode){
            node = createTextVNode(ctx, childNode, ELEMENT_HOISTED)
            node.isTextVNode = true;
            node.isElementVNode = true;
            node.pureStaticChild = true;
        }
    }else if(childNode.isExpressionContainer || childNode.isMergeStringNode){
        if(childNode.isScalarType){
            node = createTextVNode(ctx, node, ELEMENT_TEXT);
        }else if(!childNode.isExplicitVNode && !childNode.isNormalVNode){
            node = ctx.createCallExpression(
                createStaticReferenceNode(ctx, stack, 'web.components.Component', 'normalVNode'),
                [
                    childNode
                ]
            );
            node.isNormalVNode = true;
            node.pureStaticChild = false;
        }
        node.isElementVNode = true;
    }

    if(!disableHoisted && node && node.pureStaticChild && !node.isStaticHoistedNode){
        if(node.isTextVNode){
            node = ctx.addStaticHoisted(node);
        }else{ 
            node =needAddForIndexOfCacheNode(ctx, stack, node)
        }
    }
    return node;
}

function makeChildrenNodes(ctx, children, toTextNode=false, disableHoisted=false, stack=null){
    if(!children.length)return null;
    let num = 0;
    let newLine = false;
    let childNods = ctx.createArrayExpression(children.map(child=>{
        if(child.type==="Literal"||child.type==="Identifier"||child.isTextVNode){
            num++;
        }
        if(!newLine){
            if(child.type ==="CallExpression" || child.type==="ConditionalExpression" || child.isFragmentVNode){
                newLine = true;
            }
        }
        return createNormalVNode(ctx, child, toTextNode, disableHoisted, stack)
    }));
    childNods.newLine = newLine;
    if(num>1){
        childNods.newLine = true;
    }
    return childNods;
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

function isPureStaticChild(node){
    if(!node)return true;
    return !!(node.type ==="Literal" || node.pureStaticChild);
}

function createDirectiveElementNode(ctx, stack, children, hasKeys, hasChildForNode=false){
    const openingElement = stack.openingElement;
    const name = openingElement.name.value().toLowerCase();
    let childNodes = children[0];
    if(!childNodes){
        childNodes = createCommentVNode(ctx, 'child is null')
    }
    if(children.length>1){
        childNodes = createFragmentVNode(
            ctx,
            makeChildrenNodes(ctx, children, true, false, stack),
            null,
            hasChildForNode ? hasKeys ? ELEMENT_KEYED_FRAGMENT : ELEMENT_UNKEYED_FRAGMENT : ELEMENT_STABLE_FRAGMENT,
            hasChildForNode
        );
    }else{
        childNodes = createNormalVNode(ctx,childNodes,false,true,stack);
    }

    switch( name ){
        case 'custom' :
        case 'show' :
            return childNodes;
        case 'if' :
        case 'elseif' :
            {
                const condition = ctx.createToken( stack.attributes[0].parserAttributeValueStack() )
                const node = ctx.createNode('ConditionalExpression')
                node.test = condition;
                node.consequent = childNodes
                return node;
            }
        case 'else' :
            return childNodes;
        case 'for' :
        case 'each' :
            {
                const attrs = stack.openingElement.attributes;
                const argument = {};
                attrs.forEach( attr=>{
                    if( attr.name.value()==='name'){
                        argument[ 'refs' ] = ctx.createToken( attr.parserAttributeValueStack() );
                    }else{
                        argument[attr.name.value()] = ctx.createIdentifier(attr.value.value());
                    }
                });
                let item = argument.item || ctx.createIdentifier('item');
                let key = argument.key || ctx.createIdentifier('key');
                let node = name === 'for' ? 
                    createForMapNode(ctx, argument.refs, childNodes, item, key, argument.index, stack) :
                    createForEachNode(ctx, argument.refs, childNodes, item, key, stack);
                node.isForVNode = true;
                makeNeedAddForIndexOfCacheNodes(ctx, stack, key);
                return createFragmentVNode(ctx, node, null, hasKeys ? ELEMENT_KEYED_FRAGMENT : ELEMENT_UNKEYED_FRAGMENT, true);
            }
    } 
    return null;
}


function createSlotElementNode(ctx, stack , children, pureStaticChildWhole=false){
    const openingElement = ctx.createToken(stack.openingElement);
    const args = [ctx, stack];
    let props = null;
    let params = [];
    if( stack.isSlotDeclared ){
        args.push( ctx.createLiteral(stack.openingElement.name.value()) )
        if( openingElement.attributes.length > 0 ){
            const properties = openingElement.attributes.map(attr=>{
                return ctx.createProperty(
                    attr.name,
                    attr.value
                )
            });
            props = ctx.createObjectExpression(properties);
        }else{
            props = ctx.createObjectExpression();
        }
        args.push( props );
    }else if( stack.openingElement.attributes.length > 0 ){
        const attribute = stack.openingElement.attributes[0];
        if( attribute.value ){
            const stack = attribute.parserSlotScopeParamsStack();
            params.push(
                ctx.createAssignmentExpression(
                    ctx.createToken(stack),
                    ctx.createObjectExpression()
                )
            );
        }
    }
    if( children ){
        let slotFn = ctx.createArrowFunctionExpression(children, params);
        if(pureStaticChildWhole){
            slotFn = ctx.addStaticHoisted(slotFn)
        }
        args.push(slotFn);
    }
    return createSlotNode(...args);
}


function getElementStats(ctx, stack, data, children, isRoot=false){
    let desc = stack.descriptor();
    let hasForNode = false;
    let hasKeys = false;
    let hasDynamicSlots = false;
    let pureStaticChild = false;
    let isKeepAlive = false;
    let isWebComponent = stack.isWebComponent;
    let hasInheritDirectiveAttr = false;
    let pureStaticAttributes = data.pureStaticAttributes;
    let componentDirective = getComponentDirectiveAnnotation(desc, true);
    if(isWebComponent && Utils.isModule(desc)){
        let fullname = desc.getName();
        if(fullname === 'web.components.KeepAlive'){
            isKeepAlive = true;
        }
    }

    if( stack.isDirective && stack.openingElement.name.value().toLowerCase() ==="custom" ){
        componentDirective = true;
    }else if(stack.isComponent && isDirectiveInterface(desc)){
        componentDirective = true;
    }

    if(!componentDirective){
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
                hasInheritDirectiveAttr = createCustomDirectiveProperties(ctx, stack.parentStack, data, (prop)=>{
                    if(prop.isInheritDirectiveProp){
                        data.keyProps.push( ctx.createLiteral(prop.key.value) )
                        addPatchFlag(data, ELEMENT_PROPS)
                    }
                });
            }
        }else{
            hasInheritDirectiveAttr = createComponentDirectiveProperties(ctx, stack.parentStack, data, (prop)=>{
                if(prop.isInheritDirectiveProp){
                    data.keyProps.push( ctx.createLiteral(prop.key.value) )
                    addPatchFlag(data, ELEMENT_PROPS)
                }
            })
        }
    }
    
    if(hasInheritDirectiveAttr){
        pureStaticAttributes = data.pureStaticAttributes = false;
    }

    let hasUseDirective = false;
    if( data.directives && data.directives.length > 0 ){
        hasUseDirective = data.directives.some( dire=>!dire.isInheritComponentDirective)
    }
    children.forEach(child=>{
        hasKeys = !!child.hasKeyAttribute;
        pureStaticChild = data.pureStaticChild ? isPureStaticChild(child) : false;
        if(child.isForVNode || child.hasForNode){
            hasForNode = true;
            if(isWebComponent){
                hasDynamicSlots = true;
            }
        }
        if(isWebComponent && child.hasDynamicSlots){
            hasDynamicSlots = true;
        }
    });
    let isBlock = isKeepAlive || isRoot || isOpenBlock(stack);
    let isStaticHoisted = !(isWebComponent || stack.isDirective || stack.isSlot || isBlock || hasUseDirective) && pureStaticAttributes && pureStaticChild;
    return {
        componentDirective,
        pureStaticAttributes,
        hasUseDirective,
        hasInheritDirectiveAttr,
        hasForNode,
        hasKeys,
        hasDynamicSlots,
        isStaticHoisted,
        isBlock,
        isWebComponent,
        isKeepAlive,
        pureStaticChild
    }
}

function createElement(ctx, stack){
    let isRoot = stack.jsxRootElement === stack;
    let data = {
        directives:[],
        slots:{},
        attrs:[],
        props:[],
        keyProps:[]
    };

    if(!stack.isJSXFragment && !(isRoot && stack.openingElement.name.value()==='root')){
        createAttributes(ctx, stack, data)
    }
   
    let nodeElement = null;
    let rawChildren = getChildren(stack);
    let children = createChildren(ctx, rawChildren, data);
    let {
        componentDirective,
        hasUseDirective,
        hasForNode,
        hasKeys,
        hasDynamicSlots,
        isStaticHoisted,
        isBlock,
        isWebComponent,
        pureStaticChild
    } = getElementStats(ctx, stack, data, children, isRoot);

    if(componentDirective){
        let flags = hasKeys ? ELEMENT_KEYED_FRAGMENT : ELEMENT_UNKEYED_FRAGMENT;
        if(children.length>1){
            nodeElement = createFragmentVNode(
                ctx,
                makeChildrenNodes(ctx, children, true, false, stack),
                null, 
                hasForNode ? flags : ELEMENT_STABLE_FRAGMENT,
                hasForNode
            );
        }else{
            nodeElement = createNormalVNode(ctx, children[0], false, true, stack);
        }
        nodeElement.hasForNode = hasForNode;
        nodeElement.hasKeyAttribute = hasKeys;
        nodeElement.pureStaticChild = false;
    }else{

        if(hasUseDirective || data.ref){
            addPatchFlag(data, ELEMENT_NEED_PATCH);
        }
    
        if(isStaticHoisted){
            addPatchFlag(data, ELEMENT_HOISTED);
        }

        if(hasDynamicSlots){
            addPatchFlag(data, ELEMENT_DYNAMIC_SLOTS);
        }

        if(stack.isSlot ){
            nodeElement = createSlotElementNode(
                ctx,
                stack,
                makeChildrenNodes(ctx, children, true, isStaticHoisted, stack),
                isStaticHoisted
            );
        }else if(stack.isDirective){
            nodeElement = createDirectiveElementNode(ctx, stack, children, hasKeys, hasForNode);
            if(nodeElement.isForVNode){
                hasForNode = true;
            }
        }else{
            if(stack.isJSXFragment || (isRoot && !isWebComponent && stack.openingElement.name.value()==='root')){
                if(children.length>1){
                    nodeElement = createFragmentVNode(
                        ctx,
                        makeChildrenNodes(ctx, children, true, false, stack),
                        null,
                        ELEMENT_STABLE_FRAGMENT,
                        false
                    );
                }else{
                    nodeElement = createNormalVNode(ctx, children[0],false,true,stack);
                }
            }else{
                let childNodes = null;
                if(isWebComponent){
                    let properties = [];
                    if(children.length>0){
                        let slotFn = ctx.createArrowFunctionExpression(
                            makeChildrenNodes(ctx, children, true, pureStaticChild, stack)
                        );
                        if(pureStaticChild){
                            slotFn = ctx.addStaticHoisted(slotFn);
                        }
                        properties.push( ctx.createProperty(
                            ctx.createIdentifier('default'), 
                            createWithCtxNode(ctx,slotFn)
                        ));
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
                        if(data.patchFlag & ELEMENT_DYNAMIC_SLOTS){
                            properties.push( ctx.createProperty(
                                ctx.createIdentifier('_'), 
                                ctx.createLiteral(2) 
                            ))
                        }else{
                            properties.push( ctx.createProperty(
                                ctx.createIdentifier('_'), 
                                ctx.createLiteral(1)
                            ))
                        }
                        childNodes = ctx.createObjectExpression( properties );
                    }

                }else if(children.length>0){
                    childNodes = makeChildrenNodes(ctx, children, true, pureStaticChild, stack); 
                }
                nodeElement = makeElementVNode(ctx, stack, data, childNodes, isBlock);
            }
        }

        if(nodeElement && data.directives && data.directives.length > 0){
            nodeElement = createWithDirectives(ctx, nodeElement, data.directives);
            nodeElement.isWithDirective = true;
        }

        nodeElement.hasForNode = hasForNode;
        nodeElement.hasDynamicSlots = hasDynamicSlots;
        nodeElement.pureStaticChild = isStaticHoisted;
        nodeElement.hasKeyAttribute = !!data.key;
        nodeElement.isElementVNode = true;
    }

    if(isRoot){
        let {method, refs, count, created} = ctx.getRenderContextForVNode(stack);
        if(count>0 && !created()){
            let methodBlock = ctx.getNode(method.body)
            if(methodBlock){
                let isEntry = method.value() === "render";
                if(isEntry && !(stack.module && stack.module.isWebComponent())){
                    isEntry = false;
                }
                let createCache =  ctx.createVariableDeclaration('const',[
                    ctx.createVariableDeclarator(
                        ctx.createIdentifier(refs), 
                        ctx.createCallExpression(
                            ctx.createMemberExpression([
                                ctx.createThisExpression(),
                                ctx.createIdentifier('getCacheForVNode')
                            ]),
                            [
                                ctx.createLiteral(isEntry ? true : method.value())
                            ]
                        )
                    )
                ]);
                methodBlock.body.unshift(createCache);
            }else{
                console.error("[ESX] Not found body of render-method in element context")
            }
        }
    }
    return nodeElement;
}

export * from "@easescript/transform/lib/core/ESX";
export {
    createElement,
}
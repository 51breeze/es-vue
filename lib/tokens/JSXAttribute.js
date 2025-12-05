import JSXAttribute from '@easescript/transform/lib/tokens/JSXAttribute'
import {hasDynamicRef} from '../core/Common'
export default function(ctx,stack){
    if(!stack.hasNamespaced && !stack.value && stack.name.value()==="__SSID__"){
        const scopeId = ctx.getStyleScopeId(stack.compilation);
        if(!scopeId)return null;
        const options = ctx.plugin.options;
        const vueOpts =  options.vue || {};
        const node = ctx.createNode(stack);
        node.namespace = null;
        node.name = ctx.createLiteral((vueOpts.scopePrefix||"")+scopeId);
        node.value = ctx.createLiteral('');
        return node;
    }
    const scope = stack.scope.forContextScope;
    let dynamicRefs = false;
    if(scope && stack.value && stack.value.isJSXExpressionContainer){
        dynamicRefs = hasDynamicRef(scope, stack.value.expression)    
    }
    const node = JSXAttribute(ctx,stack)
    node.hasDynamicRefs = dynamicRefs
    return node
}
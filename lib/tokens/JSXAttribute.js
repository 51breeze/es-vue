import JSXAttribute from '@easescript/transform/lib/tokens/JSXAttribute'
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
    return JSXAttribute(ctx,stack)
}
module.exports = function(ctx,stack){
    const parent = stack.module.inherit;
    const fnScope = stack.scope.getScopeByType("function");
    const version = ctx.builder.getBuildVersion();
    if( version < 3 && fnScope.isConstructor && !stack.parentStack.isMemberExpression ){
        if( stack.isModuleForWebComponent( parent ) ){
            return ctx.createMemberNode([
                ctx.getModuleReferenceName(parent),
                ctx.createIdentifierNode('prototype'),
                ctx.createIdentifierNode('_init')
            ], stack);
        }
    }

    const node = ctx.createNode(stack);
    node.value = ctx.getModuleReferenceName(parent);
    node.raw = node.value;
    return node;
}
module.exports = function(ctx,stack){
    if( stack.callee.isSuperExpression && !(stack.arguments && stack.arguments.length > 0) ){
        const parent = stack.module.inherit;
        const desc = stack.callee.description();
        if( desc.isConstructor && stack.isModuleForWebComponent( parent )  ){
            if( stack.isModuleForWebComponent( parent ) ){
                const node = ctx.createNode( stack );
                node.callee = node.createMemberNode([node.createToken( stack.callee ),node.createIdentifierNode('call')]);
                node.arguments = [
                    node.createThisNode(),
                    node.createMemberNode([ 
                        node.createIdentifierNode('arguments'), 
                        node.createLiteralNode(0) 
                    ]) 
                ];
                node.arguments[1].computed = true;
                return node;
            }
        }
    }
    const CallExpression = ctx.plugin.getTokenNode('CallExpression', true);
    return CallExpression(ctx,stack);
}
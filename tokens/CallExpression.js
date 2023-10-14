const Utils = require('../core/Utils')
module.exports = function(ctx,stack){
    if( stack.callee.isSuperExpression ){
        const version = ctx.builder.getBuildVersion();
        if( version < 3 ){
            const parent = stack.module.inherit;
            const desc = stack.callee.description();
            if( desc.isConstructor ){
                if( stack.isModuleForWebComponent( parent ) ){
                    const node = ctx.createNode( stack );
                    node.callee = node.createMemberNode([node.createToken( stack.callee ),node.createIdentifierNode('call')]);
                    node.arguments = [
                        Utils.createThisNode(node, stack),
                        node.createMemberNode([ 
                            node.createIdentifierNode('arguments'), 
                            node.createLiteralNode(1)
                        ]) 
                    ];
                    node.arguments[1].computed = true;
                    if( stack.arguments && stack.arguments.length > 0 ){
                        node.arguments.push( ...stack.arguments.map(item=>node.createToken(item) ) );
                    }
                    return node;
                }
            }
        }
    }
    const CallExpression = ctx.plugin.getTokenNode('CallExpression', true);
    return CallExpression(ctx,stack);
}
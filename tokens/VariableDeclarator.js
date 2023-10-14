const Core = require("../core/Core");
const Utils = require('../core/Utils')
module.exports = function(ctx,stack){
    if(!stack.parentStack.isPropertyDefinition && stack.useRefItems.size == 0){
        if( !(stack.id.isArrayPattern || stack.id.isObjectPattern) ){
            return null;
        }
    }

    const Identifier = ctx.plugin.getTokenNode('VariableDeclarator', true)
    const declareNode = Identifier(ctx,stack);

    if( !stack.flag && stack.useRefItems.size > 0 && stack.init && ctx.builder.isBuildVueTemplateFormat() ){
        const desc = stack.description();
        if(desc && ctx.builder.isVueComponent(desc.module) ){
            let parent = desc.getParentStack( stack=>{
                return !!stack.isBlockStatement;
            });

            if( parent && parent.isBlockStatement && parent.parentStack.isFunctionExpression && parent.parentStack.parentStack.isMethodDefinition ){
                parent = parent.parentStack.parentStack;
                if( !parent.isAccessor && parent.key.value() ==='render'){
                    const block = ctx.getParentByType('BlockStatement');
                    if( block ){
                        
                        const enablePrivateChain = ctx.plugin.options.enablePrivateChain;
                        const name =ctx.builder.genMembersName(desc.module, stack.id.value(), desc);
                        const property = ctx.createIdentifierNode(name,stack.id);
                        let object = null;
                        if(enablePrivateChain){
                            object = ctx.createMemberNode([
                                ctx.createThisNode(), 
                                ctx.checkRefsName(Core.Constant.REFS_DECLARE_PRIVATE_NAME)
                            ]);
                            object.computed = true;
                        }else{
                            object = ctx.createThisNode();
                        }
                       
                        const vueBuilder =  block.getParentByType( item=>item.isVueBuilder );
                        if(vueBuilder){
                            vueBuilder.cratePrivatePropertyNodeOf(name, ctx.createLiteralNode(null))
                        }

                        declareNode.init = ctx.createAssignmentNode(
                            ctx.createMemberNode([object, property]), declareNode.init
                        );
                    }
                }
            }
        }
    }

    return declareNode
}
const Utils = require('../core/Utils')
const Core = require("../core/Core");
module.exports = function(ctx,stack,type){
    const name = stack.name;
    switch( name.toLowerCase() ){
        case 'url':{
            const args = stack.getArguments();
            const arg = args[0];
            if(arg && arg.resolveFile){
                const asset = (stack.module||stack.compilation).assets.get( arg.resolveFile );
                if(asset && asset.assign){
                    const format = ctx.plugin.options.format
                    if(format === 'vue-template' || format==='vue-raw'){
                        const inReenderMethod = (stack)=>{
                            let parent = stack.getParentStack( stack=>{
                                 return !!stack.isBlockStatement;
                            });
                            if( parent && parent.isBlockStatement && parent.parentStack.isFunctionExpression && parent.parentStack.parentStack.isMethodDefinition ){
                                 parent = parent.parentStack.parentStack;
                                 if( !parent.isAccessor && parent.key.value() ==='render'){
                                      return true;
                                 }
                            }
                            return false;
                        }
                        let parent = stack.getParentStack((parent)=>{
                            return parent.isBlockStatement || parent.isJSXElement
                        });
                        if(parent && parent.isJSXElement && inReenderMethod(parent.jsxRootElement)){
                            const vueBuilder = ctx.getParentByType( parent=>{
                                return parent.isVueBuilder
                            });
                            if( vueBuilder ){
                                const property = ctx.builder.genMembersName(stack.module, asset.assign, asset)
                                if( !vueBuilder.annotationUrlProperties[property] ){
                                    vueBuilder.annotationUrlProperties[property] = asset.assign;
                                }
                                if( ctx.plugin.options.enablePrivateChain ){
                                    let object = ctx.createMemberNode([
                                        Utils.createThisNode(ctx, stack, true), 
                                        ctx.checkRefsName(Core.Constant.REFS_DECLARE_PRIVATE_NAME)
                                    ]);
                                    object.computed = true;
                                    return ctx.createMemberNode([object, property], stack);
                                }else{
                                    return ctx.createMemberNode([Utils.createThisNode(ctx, stack, true), property], stack);
                                }
                            }
                        }
                    }
                    return ctx.createIdentifierNode( asset.assign );
                }
            }
            return ctx.createLiteralNode('');
        } 
    }
    const AnnotationExpression = ctx.plugin.getTokenNode('AnnotationExpression', true);
    return AnnotationExpression(ctx, stack, type);
};
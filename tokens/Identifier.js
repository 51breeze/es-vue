const Utils = require('../core/Utils')
const Core = require("../core/Core");
module.exports = function(ctx,stack){
     if( !(stack.parentStack.isProperty && stack.parentStack.key === stack) && ctx.builder.isBuildVueTemplateFormat() ){
          const parent = stack.getParentStack( parent=>{
              return !!(parent.isBlockStatement || parent.isJSXElement || parent.jsxRootElement)
          });
          if( parent && (parent.isJSXElement || parent.jsxRootElement) && ctx.builder.isBuildVueTemplateFormat(parent.jsxRootElement) ){
               const desc = stack.description();
               if( desc && (desc.isPropertyDefinition || desc.isMethodDefinition || desc.isVariableDeclarator) ){

                    const inReenderMethod = ()=>{
                         let parent = desc.getParentStack( stack=>{
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

                    const enablePrivateChain = ctx.plugin.options.enablePrivateChain;
                    const thisComplete = ctx.plugin.options.thisComplete;
                    const ownerModule = desc.module;
                    const isStatic = !!(desc.static || ownerModule.static);
                    const property = desc.isVariableDeclarator ? ctx.builder.genMembersName(desc.module, stack.value(), desc) : ctx.createIdentifierNode(stack.value(), stack);
                    const modifier = stack.compiler.callUtils('getModifierValue', desc);
                    const isPrivate = ((modifier ==="private" && desc.isPropertyDefinition && !isStatic) || (desc.isVariableDeclarator && inReenderMethod()) );
                    var object = isStatic ? ctx.createIdentifierNode(ownerModule.id) : Utils.createThisNode(ctx, stack, true);
                    if( enablePrivateChain && isPrivate){
                         object = ctx.createMemberNode([
                              object, 
                              ctx.checkRefsName(Core.Constant.REFS_DECLARE_PRIVATE_NAME)
                         ]);
                         object.computed = true;
                         return ctx.createMemberNode([object, property], stack);
                    }else if(thisComplete){
                         return ctx.createMemberNode([object, property], stack);
                    }
               }else if( desc && (desc.isDeclaratorFunction || desc.isDeclaratorVariable) ){
                    const p = stack.parentStack;
                    const isIden = !p.isMemberExpression || p.computed || p.object === stack;
                    if( isIden ){
                         const vueBuilder = ctx.getParentByType( (parent)=>parent.isVueBuilder );
                         if( vueBuilder && vueBuilder.exposeGlobalRefs instanceof Set ){
                              vueBuilder.exposeGlobalRefs.add( stack.value() );
                         }
                    }
               }
          }
     }
     const Identifier = ctx.plugin.getTokenNode('Identifier', true)
     return Identifier(ctx,stack);
};
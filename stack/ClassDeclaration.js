const Core = require("../core/Core");
const ClassBuilder = Core.ClassBuilder;
const JSXClassBuilder = require("../core/JSXClassBuilder");
function ClassDeclaration(ctx,stack,type){
    if( stack.isModuleForWebComponent( stack.module ) ){
        const builder = new JSXClassBuilder(stack, ctx);
        return builder.create();
    }
    return ClassBuilder.createClassNode(stack,ctx,type);
}
module.exports = ClassDeclaration;



const Core = require("../core/Core");
const ClassBuilder = Core.ClassBuilder;
const JSXClassBuilder = require("../core/JSXClassBuilder");
const VueBuilder = require("../core/vue/VueBuilder");
module.exports = function(ctx,stack,type){
    if( ctx.builder.isBuildVueTemplateFormat() || ctx.builder.isBuildVueJsxFormat() ){
        if(ctx.builder.isVueComponent( stack.module ) ){
            const builder = new VueBuilder(stack, ctx);
            return builder.create();
        }
    }
    if( stack.isModuleForWebComponent( stack.module ) ){
        const builder = new JSXClassBuilder(stack, ctx);
        return builder.create();
    }
    return ClassBuilder.createClassNode(stack,ctx,type);
};



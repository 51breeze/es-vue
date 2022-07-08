const Core = require("../core/Core");
const JSXClassBuilder = require("../core/JSXClassBuilder");
const _ClassDeclaration = Core.plugin.modules.get('ClassDeclaration');
function ClassDeclaration(ctx,stack,type){
    if( stack.isModuleForWebComponent( stack.module ) ){
        const builder = new JSXClassBuilder(stack, ctx);

        // builder.builder.getDependencies( stack.module).forEach( item=>{
        //     console.log( item.id , builder.isActiveForModule( item )  )
        // })


        return builder.create();
    }
    return _ClassDeclaration(ctx,stack,type);
}
module.exports = ClassDeclaration;



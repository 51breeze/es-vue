const Core = require("../core/Core");
const ClassBuilder = Core.ClassBuilder;
const DeclaratorDeclaration = Core.plugin.modules.get('DeclaratorDeclaration');
module.exports = function(ctx, stack, type){
    const module = stack.module;
    const polyfillModule = ctx.plugin.getPolyfill( module.getName() );
    if( !polyfillModule && stack.isModuleForWebComponent( module ) ){
        const componentClass = stack.compiler.options.jsx.componentClass;
        const component = ctx.builder.getGlobalModuleById( componentClass );
        const node = new ClassBuilder(stack, ctx, type);
        const body = node.body;
        node.addDepend( component );
        node.createDependencies(module).forEach( item=>body.push( item ) );
        node.createModuleAssets(module).forEach( item=>body.push( item ) );
        body.push( node.createExportDeclaration( node.getModuleReferenceName(module) ) );
        return node;
    }
    return DeclaratorDeclaration(ctx, stack, type);
}
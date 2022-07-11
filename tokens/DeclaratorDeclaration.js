const Core = require("../core/Core");
const ClassBuilder = Core.ClassBuilder;
module.exports = function(ctx, stack, type){
    const module = stack.module;
    const polyfillModule = ctx.builder.getPolyfillModule( module.getName() );
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
    const DeclaratorDeclaration = ctx.plugin.getTokenNode('DeclaratorDeclaration', true);
    return DeclaratorDeclaration(ctx, stack, type);
}
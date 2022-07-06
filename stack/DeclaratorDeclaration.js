const Core = require("../core/Core");
const _DeclaratorDeclaration = Core.plugin.modules.get('DeclaratorDeclaration');
const _ClassDeclaration = Core.plugin.modules.get('ClassDeclaration');
module.exports = function(ctx, stack, type){
    const module = stack.module;
    const polyfillModule = ctx.plugin.getPolyfill( module.getName() );
    if( !polyfillModule && stack.isModuleForWebComponent( module ) ){
        const componentClass = stack.compiler.options.jsx.componentClass;
        const component = ctx.builder.getGlobalModuleById( componentClass );
        ctx.addDepend( component );
        const node = ctx.createNode( stack );
        node.body = [];
        const body = node.body;
        _ClassDeclaration.createDependencies(node, module).forEach( item=>body.push( item ) );
        _ClassDeclaration.createModuleAssets(node, module).forEach( item=>body.push( item ) );
        body.push( _ClassDeclaration.createExportDeclaration(node, ctx.getModuleReferenceName(module) ) );
        return node;
    }
    return _DeclaratorDeclaration(ctx, stack, type);
}
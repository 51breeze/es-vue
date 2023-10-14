const Core = require("../core/Core");
const ClassBuilder = Core.ClassBuilder;
module.exports = function(ctx, stack, type){
    const module = stack.module;
    const polyfillModule = ctx.builder.getPolyfillModule( module.getName() );
    if( !polyfillModule && stack.isModuleForWebComponent( module ) ){
        const node = new ClassBuilder(stack, ctx, type);
        const body = node.body;
        body.push( ...node.createDependencies(module) )
        node.createModuleAssets(module);
        const references = node.builder.geImportReferences( module );
        if( references ){
            body.push( ...Array.from( references.values() ) );
        }
        body.push( node.createExportDeclaration( node.getModuleReferenceName(module) ) );
        return node;
    }
    const DeclaratorDeclaration = ctx.plugin.getTokenNode('DeclaratorDeclaration', true);
    return DeclaratorDeclaration(ctx, stack, type);
}
const Core = require("../core/Core");
const Polyfill = require("../core/Polyfill");
const _DeclaratorDeclaration = Core.plugin.modules.get('DeclaratorDeclaration')
class DeclaratorDeclaration extends _DeclaratorDeclaration{
    emitter(){
        const module = this.module;
        const polyfillModule = Polyfill.modules.get( module.getName() );
        if( !polyfillModule && this.getConfig('webComponent') ==='vue' && this.isInheritWebComponent(module) ){
            const content = [];
            const refs = [];
            const component = this.getGlobalModuleById('web.components.Component');
            this.addDepend( component );
            this.createDependencies(module,refs);
            if( refs.length > 0 ){
                content.unshift( refs.join("\r\n") );
            }
            const exports = `${this.getModuleReferenceName(component,module)}.createComponent(null,${module.id})`;
            content.push( this.emitExportClass(module, exports ) );
            return content.join("\r\n");
        }else{
            return super.emitter();
        }
    }
}

module.exports = DeclaratorDeclaration;
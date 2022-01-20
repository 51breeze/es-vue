const Core = require("../core/Core");
const Polyfill = require("../core/Polyfill");
const _DeclaratorDeclaration = Core.plugin.modules.get('DeclaratorDeclaration')
class DeclaratorDeclaration extends _DeclaratorDeclaration{
    emitter(){
        const module = this.module;
        const polyfillModule = Polyfill.modules.get( module.getName() );
        if( !polyfillModule && this.isInheritWebComponent(module) ){
            const content = [];
            const componentClass = this.compiler.options.jsx.componentClass;
            const component = this.getGlobalModuleById( componentClass );
            this.addDepend( component );
            this.createDependencies(module,content);
            content.push( this.emitExportClass(module, this.getModuleReferenceName(module) ) );
            return content.join("\r\n");
        }else{
            return super.emitter();
        }
    }
}

module.exports = DeclaratorDeclaration;
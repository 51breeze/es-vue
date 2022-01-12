const Core = require("../core/Core");
const Polyfill = require("../core/Polyfill");
const _DeclaratorDeclaration = Core.plugin.modules.get('DeclaratorDeclaration')
class DeclaratorDeclaration extends _DeclaratorDeclaration{

    isDependModule(depModule,context){
        const result = super.isDependModule(depModule,context);
        if( result || !depModule.isDeclaratorModule ){
            return result;
        }
        if( this.compilation.isPolicy(2,depModule) ){
            return false;
        }
        const isUsed = this.isUsed(depModule);
        const isRequire = !depModule.isDeclaratorModule && 
                            isUsed &&
                            this.compiler.callUtils("isLocalModule", depModule) && 
                            !this.compiler.callUtils("checkDepend",this.module, depModule);         
        const isPolyfill = depModule.isDeclaratorModule && Polyfill.modules.has( depModule.getName() );
        return isRequire || isPolyfill;
    }

    emitter(){
        const module = this.module;
        const polyfillModule = Polyfill.modules.get( module.getName() );
        if( !polyfillModule && this.isInheritWebComponent(module) ){
            const content = [];
            const refs = [];
            const componentClass = this.compiler.options.jsx.componentClass;
            const component = this.getGlobalModuleById( componentClass );
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
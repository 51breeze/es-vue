const Core = require("../core/Core");
const VueClass = require("../core/VueClass");
const Polyfill = require("../core/Polyfill");
const _ClassDeclaration = Core.plugin.modules.get('ClassDeclaration');
class ClassDeclaration extends _ClassDeclaration{
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
    getReserved(){
        return this._reserved || (this._reserved = this.getConfig('reserved') || []);
    }
    emitStack(item,name,isStatic,properties,modifier){
        if( this.getReserved().includes( name ) && this.isInheritWebComponent( item.module ) ){
            (item.key || item.id || item).error(1124, name);
        }
        return super.emitStack(item,name,isStatic,properties,modifier);
    }
    emitter(){
        const module = this.module;
        if( this.isInheritWebComponent( module ) ){
            const obj = this.factory(VueClass, this.stack );
            return obj.emitter();
        }else{
            return super.emitter();
        }
    }
}

module.exports = ClassDeclaration;
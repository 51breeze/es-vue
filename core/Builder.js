const fs = require("fs");
const path = require("path");
const Core = require('./Core');
const Polyfill = require('./Polyfill');
class Builder extends Core.builder{
    isActiveForModule(depModule,ctxModule){
        if( !depModule )return false;
        ctxModule = ctxModule || this.module;
        if( this.compilation.isPolicy(2,depModule) ){
            return false;
        }
        const result = super.isActiveForModule(depModule,ctxModule);
        if( result ){
            return result;
        }
        const isUsed = this.isUsed(depModule, ctxModule);
        if( !isUsed || !depModule.isDeclaratorModule )return false;
        if( Polyfill.modules.has( depModule.getName() ) ){
            return true;
        }
        return depModule.requires && depModule.requires.has( depModule.id ) && this.stack && this.stack.isModuleForWebComponent(depModule);
    }

    getPolyfillModule( id ){
        const module = Polyfill.modules.get( id );
        if( module )return module;
        return super.getPolyfillModule( id );
    }
}
module.exports = Builder;
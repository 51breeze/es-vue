const fs = require("fs");
const path = require("path");
const Core = require('./Core');
const Polyfill = require('./Polyfill');
class Builder extends Core.builder{

    isActiveForModule(depModule,ctxModule){
        ctxModule = ctxModule || this.module;
        if( this.compilation.isPolicy(2,depModule) ){
            return false;
        }
        const result = super.isActiveForModule(depModule,ctxModule);
        if( result ){
            return result;
        }
        const isUsed = this.isUsed(depModule);
        if( !isUsed || !depModule.isDeclaratorModule )return false;
        if( Polyfill.modules.has( depModule.getName() ) ){
            return true;
        }
        return depModule.requires && depModule.requires.has( depModule.id ) && this.stack.isInheritWebComponent(depModule);
    }

}
module.exports = Builder;
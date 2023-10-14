const JSXClassBuilder = require("./JSXClassBuilder.js");
class SkinClass extends JSXClassBuilder{
    constructor(stack, ctx, type){
        super(stack, ctx, type);
        this.isSkinClass = true;
    }
    isActiveForModule(module, ctxModule){
        if( module === this.module.inherit){
            return true;
        }
        return super.isActiveForModule(module, ctxModule);
    }
    checkConstructMethod(){
        if( !this.construct ){
            this.construct = this.createDefaultConstructMethod(this.module.id, [this.createIdentifierNode('context')]);
        }
    }
}
module.exports = SkinClass;
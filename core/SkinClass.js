const JSXClassBuilder = require("./JSXClassBuilder.js");
class SkinClass extends JSXClassBuilder{
    isActiveForModule(module, ctxModule){
        if( module === this.module.inherit){
            return true;
        }
        return super.isActiveForModule(module, ctxModule);
    }
    checkConstructMethod(){
        if( !this.construct ){
            this.construct = this.createSkinDefaultConstructMethod(this.module.id, null, null, [this.createIdentifierNode('context')]);
        }
    }
}
module.exports = SkinClass;

const Core = require("./Core.js");
const JSXClassBuilder = require("./JSXClassBuilder.js");
class SkinClass extends JSXClassBuilder{
    isActiveForModule(module, ctxModule){
        if( module === this.module.inherit){
            return true;
        }
        return super.isActiveForModule(module, ctxModule);
    }
    adjustConstructor(node, module){
        if( !node.construct ){
            node.construct = this.createDefaultConstructMethod(node, module, null, null, [this.createIdentifierNode('context')]);
        }
    }
}
module.exports = SkinClass;
const Core = require('./Core');
class JSXClassBuilder extends Core.JSXClassBuilder{
    getReserved(){
        return this.builder.getConfig('reserved') || [];
    }
    createDefaultConstructMethod(node, module, privateProperties, initProperties, params){
        if( !params ){
            params = [ this.createIdentifierNode('options') ];
        }
        return super.createDefaultConstructMethod(node, module, privateProperties, initProperties, params );
    }
}
module.exports = JSXClassBuilder;
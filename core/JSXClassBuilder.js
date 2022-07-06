const Core = require('./Core');
class JSXClassBuilder extends Core.JSXClassBuilder{
    getReserved(){
        return this.builder.getConfig('reserved') || [];
    }
}
module.exports = JSXClassBuilder;
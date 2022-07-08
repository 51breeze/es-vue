const Core = require('./Core');
const SkinClass = require('./SkinClass');
const JSXClassBuilder = require('./JSXClassBuilder');
class JSXTransform extends Core.JSXTransform{
    getJSXClassBuilder(stack , ctx){
        if( stack.jsxRootElement.isSkinComponent ){
            return new SkinClass(stack,ctx);
        }
        return new JSXClassBuilder(stack , ctx);
    }
}
module.exports = JSXTransform;
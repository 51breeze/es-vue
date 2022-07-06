const Core = require('./Core');
const SkinClass = require('./SkinClass');
class JSXTransform extends Core.JSXTransform{
    getJSXClassBuilder(stack , ctx){
        if( stack.jsxRootElement.isSkinComponent ){
            return new SkinClass(stack,ctx);
        }
        return super.getJSXClassBuilder(stack , ctx);
    }
}
module.exports = JSXTransform;
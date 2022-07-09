const Core = require('./Core');
const SkinClass = require('./SkinClass');
const JSXClassBuilder = require('./JSXClassBuilder');
class JSXTransform extends Core.JSXTransform{
    createClassNode(stack, renderMethod, initProperties){
        if( stack.jsxRootElement.isSkinComponent ){
            return new SkinClass(stack,this);
        }else{
            const obj = new JSXClassBuilder(stack, this, 'ClassDeclaration');
            if(renderMethod){
                obj.members.push( renderMethod )
            }
            if( initProperties && initProperties.length>0 ){
                obj.initProperties.push( ...initProperties );
            }
            obj.create();
            return obj;
        }
    }
}
module.exports = JSXTransform;
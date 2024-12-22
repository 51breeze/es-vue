const JSXClassBuilder = require("./JSXClassBuilder.js");
class SkinClass extends JSXClassBuilder{
    #initProperties = null;
    #renderMethod = null;
    constructor(stack, ctx, type){
        super(stack.module.moduleStack, ctx, type);
        this.isSkinClass = true;
    }
    create(renderMethod, initProperties){
        this.#renderMethod = renderMethod;
        this.#initProperties = initProperties;
        return super.create();
    }

    createClassStructuralBody(){
        super.createClassStructuralBody();
        const renderMethod = this.#renderMethod;
        const initProperties = this.#initProperties;
        if(renderMethod){
            this.members.push( renderMethod )
        }
        if(initProperties && initProperties.length>0 ){
            this.initProperties.push( ...initProperties );
        }
        return this;
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
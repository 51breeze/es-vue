import ClassBuilder from '../core/ClassBuilder.js'
import ESXClassBuilder from '../core/ESXClassBuilder.js'
export default function(ctx, stack){
    if(stack.isModuleForWebComponent(stack.module)){
        const builder = new ESXClassBuilder(stack);
        return builder.create(ctx);
    }else{
        const builder = new ClassBuilder(stack)
        return builder.create(ctx);
    }
}
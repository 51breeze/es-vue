import {createElement} from '../core/ESX.js';
import {createElement as createElementOptimize} from '../core/ESXOptimize.js';
export default function JSXElement(ctx, stack){
    if(!ctx.options.esx.enable)return;
    try{
        if(ctx.options.vue.optimize){
            return createElementOptimize(ctx, stack)
        }
        return createElement(ctx, stack)
    }catch(e){
        console.error(e)
    }
    return null;
}
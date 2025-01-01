import Utils from "easescript/lib/core/Utils";
import {compare} from "@easescript/transform/lib/core/Common";

function hasStyleScoped(compilation){
    if(!Utils.isCompilation(compilation))return false;
    return compilation.jsxStyles.some( style=>{
        return style.openingElement.attributes.some( attr=>{
            if(compare(attr.name.value(),'scoped')){
                if(!attr.value)return true;
                return !compare(attr.value.value(),'false');
            }
        })
    });
}

export * from "@easescript/transform/lib/core/Common";
export {
    hasStyleScoped
}
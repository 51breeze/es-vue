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

function hasDynamicRef(scope, stack){
    if(!stack)return false;
    if(stack.isIdentifier){
        return scope.isDefine(stack.value(), 'function')
    }else if(stack.isCallExpression){
        return stack.arguments.some(stack=>hasDynamicRef(scope,stack))
    }else if(stack.isParenthesizedExpression){
        return hasDynamicRef(scope, stack.expression)
    }else if(stack.isMemberExpression){
        return hasDynamicRef(scope, stack.getFirstMemberStack())
    }else if(stack.isLogicalExpression){
        return hasDynamicRef(scope, stack.left) || hasDynamicRef(scope, stack.right)
    }else if(stack.isConditionalExpression){
        return hasDynamicRef(scope, stack.test) || hasDynamicRef(scope, stack.consequent) || hasDynamicRef(scope, stack.alternate)
    }
    return false;
}

export * from "@easescript/transform/lib/core/Common";
export {
    hasStyleScoped,
    hasDynamicRef
}
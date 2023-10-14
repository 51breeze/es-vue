module.exports = function(ctx, stack){
    let value = stack.value();
    if( value ){ 
        if( ctx.builder.isBuildVueJsxFormat() ){
            if( stack.parentStack && (stack.parentStack.isDirective || stack.parentStack.isSlot || stack.parentStack.isComponent) ){
                value = value.replace(/\s+/g,' ').replace(/(\u0022|\u0027)/g,'\\$1');
                return ctx.createLiteralNode(value);
            }
            const token = ctx.createNode(stack);
            token.value = value;
            token.raw = stack.raw();
            return token;
        }

        value = value.replace(/\s+/g,' ').replace(/(\u0022|\u0027)/g,'\\$1');
        if( value ){
            const isTemplate = ctx.builder.isBuildVueTemplateFormat(stack.parentStack.jsxRootElement);
            if(isTemplate){
                return ctx.createIdentifierNode(value, stack);
            }
            return ctx.createLiteralNode(value);
        }
    }
    return null;
}

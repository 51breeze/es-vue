function normalizePropertyKey(name, prefix=''){
    name = name.replace(/[\.\-\s]/g,(v)=>{
        if(v=='-'||v=='.'||v=='_')return '_';
        return '';
    }).toLowerCase();
    if( prefix ){
        name = name.slice(0,1).toUpperCase() + name.slice(1);
    }
    return prefix + name
}

function createThisNode(ctx, stack, flag=false){
    if( createThisNode.enable !== false ){
        if( flag===true ){
            const name = ctx.builder.genMembersName(stack.module,'esInstance',stack.module)
            return ctx.createIdentifierNode(name, stack);
        }
        if( ctx.builder.isBuildVueTemplateFormat() ){
            const parent = stack.getParentStack( parent=>{
                return !!(parent.isBlockStatement || parent.isJSXElement || parent.jsxRootElement)
            });
            if( parent && (parent.isJSXElement || parent.jsxRootElement) && ctx.builder.isBuildVueTemplateFormat(parent.jsxRootElement) ){
                const name = ctx.builder.genMembersName(stack.module,'esInstance',stack.module)
                return ctx.createIdentifierNode(name, stack);
            }
        }
    }
    return ctx.createThisNode(stack);
}

module.exports={
    normalizePropertyKey,
    createThisNode
}
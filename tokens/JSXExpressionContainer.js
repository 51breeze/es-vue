
function createTemplateNode(ctx, componentName, children, attributes ){
    const node = ctx.createNode('JSXElement')
    node.openingElement = node.createNode('JSXOpeningElement')
    node.openingElement.attributes = attributes || [];
    node.openingElement.name = node.createIdentifierNode(componentName);
    node.closingElement = node.createNode('JSXClosingElement')
    node.closingElement.name = node.createIdentifierNode(componentName);
    node.children = children || [];
    return node;
}

function createAttrNode(ctx, name, value){
    const node = ctx.createNode('JSXAttribute')
    node.name = name
    node.value = value
    if(name)name.parent = node;
    if(value)value.parent = node;
    return node;
}

function checkNeedFragmentWrap( type ){
    if(!type || type.isAnyType)return true;
    if(type.isAliasType){
        return checkNeedFragmentWrap( type.inherit.type() )
    }
    if(type.isUnionType){
        return type.elements.some( el=>checkNeedFragmentWrap(el.type()) )
    }
    if( type.isLiteralType || type.isNullableType || type.isEnumType)return false;
    if( type.isModule && (type.id==='String' || type.id==="Number" || type.id==="Boolean" || type.id==="RegExp") )return false;
    return true;
}

module.exports = function(ctx, stack){

    let isWrap = stack.parentStack && stack.parentStack.isJSXElement && checkNeedFragmentWrap(stack.type());
    if( !ctx.builder.isRawJsx() ){
        const node = ctx.createToken( stack.expression );
        if( node ){
            if( isWrap ){
                node.isNeedUseCreateElementNode = true;
            }else{
                node.isNeedCreateTextNode = true;
            }
        }
        return node;
    }

    if( ctx.builder.isBuildVueJsxFormat() ){
        const node = ctx.createNode( stack );
        node.expression = node.createToken( stack.expression );
        return node;
    }
   
    if( stack.parentStack.isJSXAttribute ){
        return ctx.createToken( stack.expression );
    }

    if(isWrap){
        isScalar = false;
        const pCtx = ctx.getParentByType( (parent)=>parent.isVueTemplate );
        if( pCtx ){
            const expNode = ctx.createToken( stack.expression );
            if(expNode){
                const Fragment = ctx.builder.getGlobalModuleById('web.components.Fragment');
                ctx.addDepend(Fragment);
                const componentName = ctx.getModuleReferenceName(Fragment, stack.module)
                let expression = createTemplateNode(ctx, componentName, [], [
                    createAttrNode(ctx, ctx.createIdentifierNode('v-bind:value'), expNode )
                ]);
                return expression;
            }
        }
    }

    const isTemplate = ctx.builder.isBuildVueTemplateFormat(stack.parentStack.jsxRootElement);
    if( isTemplate ){ 
        const node = ctx.createNode( stack );
        node.left = '{{'
        node.right = '}}'
        node.expression = node.createToken( stack.expression );
        return node;
    }else{
        return ctx.createToken( stack.expression );
    }
    
}
import {
    createChildren,
    getChildren,
    getComponentDirectiveAnnotation,
    createCustomDirectiveProperties,
    createComponentDirectiveProperties,
    createAttributes,
    createWithCtxNode,
    isDirectiveInterface,
    createSlotElementNode,
    createDirectiveElementNode,
    createDirectiveArrayNode,
    createElementNode,
    createFragmentVNode,
    createWithDirectives
} from "@easescript/transform/lib/core/ESX";

function createElement(ctx, stack){
    let data = {
        directives:[],
        slots:{},
        attrs:[],
        props:[]
    };
    let isRoot = stack.jsxRootElement === stack;
    let children = getChildren(stack)
    let childNodes = createChildren(ctx, children, data, stack)
    let desc = stack.description();
    let componentDirective = getComponentDirectiveAnnotation(desc, true);
    let nodeElement = null;
    if( stack.isDirective && stack.openingElement.name.value().toLowerCase() ==="custom" ){
        componentDirective = true;
    }else if(stack.isComponent && isDirectiveInterface(desc)){
        componentDirective = true;
    }

    if(componentDirective){
        return childNodes;
    }

    if(stack.parentStack && stack.parentStack.isDirective ){
        let dName = stack.parentStack.openingElement.name.value().toLowerCase();
        if( dName === 'show' ){
            const condition= stack.parentStack.openingElement.attributes[0];
            data.directives.push(
                createDirectiveArrayNode(
                    ctx,
                    'vShow',
                    ctx.createToken(condition.parserAttributeValueStack())
                )
            );
        }else if( dName ==="custom" ){
            createCustomDirectiveProperties(ctx, stack.parentStack, data);
        }
    }else{
        createComponentDirectiveProperties(ctx, stack.parentStack, data)
    }

    if(!stack.isJSXFragment){
        if(!(isRoot && stack.openingElement.name.value()==='root') ){
            createAttributes(ctx, stack, data)
        }
    }

    const isWebComponent = stack.isWebComponent && !(stack.compilation.JSX && stack.parentStack.isProgram)
    if( isWebComponent ){
        const properties = []
        if( childNodes ){
            properties.push( ctx.createProperty(
                ctx.createIdentifier('default'), 
                createWithCtxNode(
                    ctx,
                    ctx.createArrowFunctionExpression(childNodes)
                )
            ));
            childNodes = null;
        }
        if(data.slots){
            for(let key in data.slots){
                properties.push( 
                    ctx.createProperty(
                        ctx.createIdentifier(key), 
                        data.slots[key]
                    )
                );
            }
        } 
        if( properties.length > 0 ){
            childNodes = ctx.createObjectExpression( properties );
        }
    }

    if(stack.isSlot ){
        nodeElement = createSlotElementNode(ctx, stack, childNodes);
    }else if(stack.isDirective){
        nodeElement = createDirectiveElementNode(ctx, stack, childNodes);
    }else{
        if(stack.isJSXFragment || (isRoot && !isWebComponent && stack.openingElement.name.value()==='root')){
            if(Array.isArray(childNodes) && childNodes.length===1){
                nodeElement = childNodes[0]
            }else{
                nodeElement = createFragmentVNode(ctx, childNodes)
            }
        }else{
            nodeElement = createElementNode(ctx, stack, data, childNodes);
        }
    }

    if( nodeElement && data.directives && data.directives.length > 0){
        nodeElement = createWithDirectives(ctx, nodeElement, data.directives);
    }
    
    return nodeElement;
}

export * from "@easescript/transform/lib/core/ESX";
export {
    createElement,
}
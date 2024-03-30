const Core = require('./Core');
const SkinClass = require('./SkinClass');
const JSXClassBuilder = require('./JSXClassBuilder');
class JSXTransform extends Core.JSXTransform{
    constructor(stack, ctx){
        super(stack,ctx);
    }
    createClassNode(stack, renderMethod, initProperties){
        if( stack.jsxRootElement.isSkinComponent ){
            const obj = new SkinClass(stack,this,'ClassDeclaration');
            return obj.create();
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

    isDirectiveInterface(type){
        if(!type || !type.isModule)return false;
        const directiveInterface = this._directiveInterface || (this._directiveInterface = this.builder.getGlobalModuleById('web.components.Directive'))
        if( directiveInterface && directiveInterface.isInterface ){
            return directiveInterface.type().isof( type );
        }
        return false;
    }

    getComponentDirectiveForDefine(stack){
        if(!stack)return null;
        const result = super.getComponentDirectiveForDefine(stack);
        if( result ){
            let hasStaticGetDirectiveMethod = false
            if( result[0].isModule ){
                const descMethod = result[0].getMethod('directive','get');
                if( descMethod && descMethod.isMethodGetterDefinition && this.isDirectiveInterface(descMethod.type()) ){
                    hasStaticGetDirectiveMethod = true;
                }
            }
            if( this.isDirectiveInterface(result[0]) ){
                return [...result, true, hasStaticGetDirectiveMethod];
            }else{
                return [...result, false, hasStaticGetDirectiveMethod];
            }
        }
        const type = stack.type();
        if( this.isDirectiveInterface(type) ){
            const descMethod = type.getMethod('directive','get');
            let hasStaticGetDirectiveMethod = false
            if( descMethod && descMethod.isMethodGetterDefinition && this.isDirectiveInterface(descMethod.type()) ){
                hasStaticGetDirectiveMethod = true;
            }
            return [type, type.getName('-'), null, true, hasStaticGetDirectiveMethod];
        }
        return null;
    }

    makeAttributeBindEventFunctionNode(attribute, valueTokenNode){
        if( attribute.value.isJSXExpressionContainer ){
            const expr = attribute.value.expression;
            if( expr.isAssignmentExpression || expr.isSequenceExpression){
                return this.createArrowFunctionNode([], valueTokenNode);
            }else if( !expr.isFunctionExpression ){
                if( expr.isCallExpression ){
                    const isbindFn = expr.callee.isMemberExpression && expr.callee.property.value() === 'bind' &&
                                expr.arguments.length > 0 && expr.arguments[0].isThisExpression;           
                    if(!isbindFn && valueTokenNode && valueTokenNode.type==='CallExpression'){
                        valueTokenNode.arguments.push(this.createIdentifierNode('...args'))
                        return this.createArrowFunctionNode(
                            [
                                this.createIdentifierNode('...args')
                            ], 
                            valueTokenNode
                        )
                    }
                }else if(expr.isMemberExpression || expr.isIdentifier){
                    const desc = expr.description();
                    const isMethod = desc && (desc.isMethodDefinition && !desc.isAccessor);
                    if( isMethod ){
                        return this.createCalleeNode(
                            this.createMemberNode([
                                valueTokenNode,
                                this.createIdentifierNode('bind')
                            ]), 
                            [this.createThisNode()]
                        );
                    }
                }
            }
        }
        return valueTokenNode;
    }

    makeAttributes(stack, childNodes, data, spreadAttributes){
        const isSsr = !!this.plugin.options.ssr;
        const pushEvent=(name,callback, category)=>{
            if(isSsr)return;
            const events =  data[ category ] || (data[ category ]=[]);
            const property = this.createPropertyNode(name, callback);
            if( property.key.computed ){
                property.computed = true;
                property.key.computed = false;
            }
            events.push( property );
        }
        const forStack = stack.getParentStack(stack=>{
            return stack.scope.isForContext || !(stack.isJSXElement || stack.isJSXExpressionContainer)
        },true);
        const inFor = forStack && forStack.scope && forStack.scope.isForContext ? true : false;

        stack.openingElement.attributes.forEach(item=>{
            if( item.isAttributeXmlns || item.isAttributeDirective ){
                if( item.isAttributeDirective ){
                    const name = item.name.value();
                    if( name === 'show'){
                        data.directives.push(
                            this.createObjectNode([
                                this.createPropertyNode(this.createIdentifierNode('name'), this.createLiteralNode('show') ),
                                this.createPropertyNode(this.createIdentifierNode('value'), this.createToken( item.valueArgument.expression ) ),
                            ])
                        );
                    }else if(name === 'custom'){
                        this.createAttriubeCustomDirective(item, data)
                    }
                }
                return;
            }else if( item.isJSXSpreadAttribute ){
                //spreadAttributes && spreadAttributes.push( this.createToken( item ) );
                if( item.argument ){
                    const node = this.createNode(item.argument, 'SpreadElement')
                    node.argument = node.createToken(item.argument)
                    data.props.push(node);
                }
                return;
            }else if( item.isAttributeSlot ){
                const name = item.name.value();
                const scopeName = item.value ? item.value.value() : null;
                if( scopeName ){
                   
                }else{
                    data.slot = this.createLiteralNode(name);
                }
                return;
            }

            let value = this.createToken( item );
            if( !value )return;

            let ns = value.namespace;
            let name = value.name.name;

            if( ns && ns.includes('::') ){
                let [seg,className] = ns.split('::',2);
                ns = seg;
                const moduleClass = this.getModuleReferenceName( stack.getModuleById(className) );
                name = this.createMemberNode([
                    this.createIdentifierNode( moduleClass ),
                    name
                ], name);
                name.computed = true;
            }

            if( ns ==="@events" ){
                pushEvent( name, this.makeAttributeBindEventFunctionNode(item,value.value), 'on')
                return;
            }else if( ns ==="@natives" ){
                pushEvent( name, this.makeAttributeBindEventFunctionNode(item,value.value), 'nativeOn')
                return;
            }else if( ns ==="@binding" ){
                data.directives.push(
                    this.createObjectNode([
                        this.createPropertyNode(this.createIdentifierNode('name'), this.createLiteralNode('model') ),
                        this.createPropertyNode(this.createIdentifierNode('value'), value.value ),
                    ])
                );
                const funNode = this.createCalleeNode(
                    this.createMemberNode([
                        this.createParenthesNode(
                            this.createFunctionNode((block)=>{
                                block.body=[
                                    block.createStatementNode(
                                        block.createAssignmentNode(
                                            value.value,
                                            block.createChunkNode(`event && event.target && event.target.nodeType===1 ? event.target.value : event`, false)
                                        )
                                    )
                                ]
                            },[ this.createIdentifierNode('event') ])
                        ),
                        this.createIdentifierNode('bind')
                    ]),
                    [
                        this.createThisNode()
                    ]
                );
                pushEvent(this.createIdentifierNode('input') , funNode , 'on');
            }

            let propName = name = value.name.value;
            let propValue = value.value;
            if( item.isMemberProperty ){
                let isDOMAttribute = false;
                let attrDesc = item.getAttributeDescription( stack.getSubClassDescription() );
                if( attrDesc ){
                    isDOMAttribute = attrDesc.annotations.some( item=>item.name.toLowerCase() === 'domattribute' );
                }
                if( !isDOMAttribute ){
                    data.props.push( this.createPropertyNode( this.createPropertyKeyNode(propName, value.name.stack ), propValue) );
                    return;
                }
            }

            const property = this.createPropertyNode( this.createPropertyKeyNode(propName, value.name.stack), propValue );
            switch(name){
                case "class" :
                case "style" :
                case "key" :
                case "tag" :
                case "staticStyle" :
                case "staticClass" :
                    data[name] = property
                    break;
                case "innerHTML" :
                    data.domProps.push( property );
                    break;
                case "ref" :
                    data.refInFor = this.createLiteralNode( inFor );
                    data[name] = property
                break;
                case "value" :
                default:
                    data.attrs.push( property );
            }
        });
    }
}
module.exports = JSXTransform;
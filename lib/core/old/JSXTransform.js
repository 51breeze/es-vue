const Core = require('./Core');
const SkinClass = require('./SkinClass');
const JSXClassBuilder = require('./JSXClassBuilder');
class JSXTransform extends Core.JSXTransform{
    constructor(stack, ctx){
        super(stack,ctx);
    }
    createClassNode(stack, renderMethod, initProperties){
        if( stack.jsxRootElement.parentStack.isJSXProgram ){
            const obj = new SkinClass(stack,this,'ClassDeclaration');
            return obj.create(renderMethod, initProperties);
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
        let type = stack.description();
        if( this.isDirectiveInterface(type) ){
            this.addDepend(type)
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

        const descModule = stack.isWebComponent ? stack.description() : null;
        const definedEmits = stack.compiler.callUtils('isModule',descModule) ? this.getModuleDefinedEmits(descModule) : null;
        const getDefinedEmitName = (name)=>{
            if(definedEmits && Object.prototype.hasOwnProperty.call(definedEmits, name)){
                name = definedEmits[name];
            }
            if(name.includes('-')){
                name = name.replace(/-([a-z])/g, (a,b)=>b.toUpperCase());
            }
            return name;
        }

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
                name = getDefinedEmitName(name)
                pushEvent( name, this.makeAttributeBindEventFunctionNode(item,value.value), 'on')
                return;
            }else if( ns ==="@natives" ){
                name = getDefinedEmitName(name)
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

    createInvokePolyfillsPropsHook(props, className){
        return this.createCalleeNode(
            this.createMemberNode([
                this.createThisNode(),
                this.createIdentifierNode('invokeHook')
            ]),
            [
                this.createLiteralNode('polyfills:props'),
                props,
                className
            ]
        );
    }

    getModuleDefinedEmits(module){
        const dataset = Object.create(null)
        if(!module || !module.isModule)return dataset;
        module.getAnnotations(annot=>{
            if(annot.getLowerCaseName() === 'define'){
                const args = annot.getArguments()
                if(args.length>1){
                    let value = String(args[0].value).toLowerCase()
                    let _args = args;
                    let _key = null;
                    if(value ==='emits' || value==='options'){
                        _args = value ==='emits' ? args.slice(1) : args.slice(2)
                        _key = value ==='emits' ? 'emits' : args[1].value;
                    }
                    _key = String(_key).toLowerCase();
                    if(_key ==='emits'){
                        let skip = _args.length > 1 ? _args[_args.length-1] : null;
                        if(skip && skip.assigned && String(skip.key).toLowerCase()==='type'){
                            if(skip.value !== '--literal'){
                                skip = null
                            }
                        }else{
                            skip = null
                        }
                        _args.forEach(arg=>{
                            if(arg===skip)return;
                            if(arg.assigned){
                                dataset[arg.key] = arg.value
                            }else{
                                dataset[arg.value] = arg.value
                            }
                        });
                    }
                }
            }
            return false;
        });
        return dataset;
    }

    getBinddingEventName(desc){
        if(!desc || !desc.isStack)return null;
        const bindding = desc.findAnnotation(annot=>{
            if(annot.getLowerCaseName() === 'bindding'){
                return annot;
            }
            return false;
        });
        if(bindding && Array.isArray(bindding)){
            const [annot] = bindding;
            const args = annot.getArguments();
            if(args[0]){
                return args[0].value
            }
        }
        return null;
    }
}
module.exports = JSXTransform;
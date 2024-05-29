const Core = require('./Core');
const ClassBuilder = require('./ClassBuilder');
const path = require('path');
const hotRecords = new Map();
const removeNewlineRE = /[\r\n\t]/g;
class JSXClassBuilder extends ClassBuilder{
    constructor(stack, ctx, type){
        super(stack, ctx, type);
        this.injectProperties = [];
        this.provideProperties = [];
        this.privateReactives = [];
        this.exportVueComponentNameRefNode = null;
        this.props = [];
    }

    getReserved(){
        return this.plugin.options.reserved;
    }

    createPrivatePropertyNode(stack,node,isStatic){
        const reactiveAnnotation = !isStatic && node.modifier === "private" && (stack.annotations || []).find( item=>item.name.toLowerCase() ==='reactive' );
        if( reactiveAnnotation ){
            this.privateReactives.push(
                [
                    node.key.value, 
                    this.createObjectNode([
                        this.createPropertyNode( 
                            this.createIdentifierNode('get'), 
                            this.createReactiveWrapNode(node.key.value, node.init, false),
                            node.key.stack
                        ),
                        this.createPropertyNode( 
                            this.createIdentifierNode('set'), 
                            this.createReactiveWrapNode(node.key.value, null, true),
                            node.key.stack
                        )
                    ]),
                ]
            );
            this.createPrivateRefsName();
            return true;
        }
        return super.createPrivatePropertyNode(stack,node,isStatic);
    }

    createConstructInitPrivateNode(block, appendAt=NaN){
        if( this.privateProperties.length > 0 || this.privateReactives.length > 0 ){
            super.createConstructInitPrivateNode(block, 0);
            const privateName = this.createPrivateRefsName();
            if(this.privateReactives.length > 0 && privateName ){
                appendAt = isNaN(appendAt) ? block.body.length : Math.max(appendAt < 0 ? block.body.length + appendAt : appendAt, 0);
                this.privateReactives.forEach( item=>{
                    const [key,property] = item;
                    const memberNode = this.createMemberNode([this.createThisNode(), this.createIdentifierNode( privateName )]);
                    memberNode.computed = true;
                    const node =this.createStatementNode( 
                        this.createCalleeNode( 
                            this.createMemberNode(['Object','defineProperty']),
                            [
                                memberNode,
                                this.createLiteralNode(key),
                                property
                            ]
                        )
                    );
                    block.body.splice(appendAt++, 0, node);
                });
            }
        }
    }

    createClassMemeberNode(memeberStack, classStack){
        var child = super.createClassMemeberNode(memeberStack, classStack);
        if(child && !child.static ){  
            if( child.modifier === "public" ){
                const reactiveAnnotation = child.injector ? (memeberStack.annotations || []).find( item=>item.name.toLowerCase() ==='reactive' ) : true;
                if( child.type==="PropertyDefinition" ){
                    const target ={
                        get:this.createGetterNode(child.key.value, /*child.init*/ false, false, reactiveAnnotation),
                        set:this.createSetterNode(child.key.value, false, reactiveAnnotation),
                        modifier:child.modifier,
                        isAccessor:true
                    }
                    target.init = child.init;
                    target.key = target.get.key;
                    target.kind = 'accessor';
                    if(!child.injector){
                        this.createComponentProps(child, memeberStack);
                    }
                    return target;
                }else if( child.type ==="MethodSetterDefinition" ){
                    this.createComponentProps(child, memeberStack);
                }
            }else if( child.type==="PropertyDefinition" && child.modifier !== "private" ){
                const reactiveAnnotation = (memeberStack.annotations || []).find( item=>item.name.toLowerCase() ==='reactive' );
                const target ={
                    get:this.createGetterNode(child.key.value, child.init, false, reactiveAnnotation),
                    set:this.createSetterNode(child.key.value, false, reactiveAnnotation),
                    modifier:child.modifier,
                    isAccessor:true
                }
                target.init = child.init;
                target.key = target.get.key;
                target.kind = 'accessor';
                return target;
            }
        }
        return child;
    }

    createComponentProps(node, stack){
        if(node.modifier !== "public" || !(node.type==="PropertyDefinition" || node.type==="MethodSetterDefinition") )return;
        if( stack.isMethodSetterDefinition || stack.isPropertyDefinition ){
            const annotations = stack.annotations;
            const injector = annotations && annotations.find( annotation=>annotation.name.toLowerCase() ==='injector' );
            if( injector ){
               return;
            }
        }
       
        const propName = node.key.value;
        let originType = null;
        if( node.type==="MethodSetterDefinition" ){
            let _type = null;
            if(stack.params[0]){
                _type = stack.params[0].type( stack.getContext() );
                originType = this.builder.getAvailableOriginType( _type );
            }
            if( (!_type || _type.isAnyType) && stack.module){
                const desc = stack.module.getMember(propName,'get');
                if( desc ){
                    originType = this.builder.getAvailableOriginType( desc.type( desc.getContext() ) );
                }
            }
        }else{
            originType = this.builder.getAvailableOriginType( stack.type() );
        }

        const properties = [
            this.createPropertyNode('type', originType ? this.createIdentifierNode(originType) : this.createLiteralNode(null) )
        ];

        if(node.init){
            if( node.init.type !=="Literal" ){
                properties.push( this.createPropertyNode('default', this.createFunctionNode((ctx)=>{
                    ctx.body.push( ctx.createReturnNode(node.init) );
                })));
            }else{
                properties.push( this.createPropertyNode('default',node.init) );
            }
        }

        this.props.push(this.createPropertyNode(
            propName, 
            this.createObjectNode(properties)
        ));
    }

    createAnnotations(node, memeberStack, isStatic){
        node = super.createAnnotations(node, memeberStack, isStatic);
        const annotations = memeberStack.annotations;
        if( isStatic || !annotations)return;
        if( !memeberStack.isConstructor && memeberStack.isMethodDefinition && !memeberStack.isAccessor ){
            const provider = annotations.find( annotation=>annotation.name.toLowerCase() ==='provider' );
            if( provider ){
                const args = provider.getArguments();
                this.provideProperties.push( this.createAddProviderNode( args[0] ? args[0].value : node.key.value, node.key.value, true) );
                node.provider=true;
            }
        }else if( memeberStack.isMethodGetterDefinition || memeberStack.isPropertyDefinition ){
            const provider = annotations.find( annotation=>annotation.name.toLowerCase() ==='provider' );
            if( provider ){
                const args = provider.getArguments();
                this.provideProperties.push( this.createAddProviderNode( args[0] ? args[0].value : node.key.value, node.key.value, false ) );
                node.provider=true;
            }
        }

        if( memeberStack.isMethodSetterDefinition || memeberStack.isPropertyDefinition ){
            const injector = annotations.find( annotation=>annotation.name.toLowerCase() ==='injector' );
            if( injector ){
                const injectorArgs = injector.getArguments();
                const name = node.key.value;
                var from = name;
                if( injectorArgs.length > 0 ){
                    from = injectorArgs[0].value || from;
                }
                this.injectProperties.push( this.createInjectPropertyNode(name, from, node.init || null) ); 
                node.injector=true;
            }
        }
        node.required = annotations.find( annotation=>annotation.name.toLowerCase() ==='required' );
        return node;
    }

    createInjectPropertyNode(name,from,value){
        const args = [
            this.createLiteralNode(name)
        ];

        if( from !== name ){
            args.push( this.createLiteralNode(from) );
        }

        if( value ){
            if( args.length ===1 ){
                args.push( this.createChunkNode('void 0', false) );
            }
            args.push( value instanceof Core.Token ? value : this.createLiteralNode(value) );
        }
        return this.createStatementNode(
            this.createCalleeNode(
                this.createMemberNode([
                    this.createThisNode(),
                    this.createIdentifierNode('inject')
                ]),
                args
            )
        );
    }

    createAddProviderNode(key, name, isMethod){

        const target = isMethod ? this.createMemberNode([
            this.createThisNode(),
            this.createIdentifierNode(name)
        ]) : this.createArrowFunctionNode([],this.createMemberNode([
            this.createThisNode(),
            this.createIdentifierNode(name)
        ]));

           
        return this.createStatementNode(
            this.createCalleeNode(
                this.createMemberNode([
                    this.createThisNode(),
                    this.createIdentifierNode('provide')
                ]),
                [
                    this.createLiteralNode(key),
                    isMethod ? this.createCalleeNode( 
                        this.createMemberNode([
                            target,
                            this.createIdentifierNode('bind')
                        ]), 
                        [
                            this.createThisNode()
                        ]
                    ) : target
                ]
            )
        );
    }

    createReactiveWrapNode(name, init, isset=false){
        const node = this.createArrowFunctionNode()
        const args = [
            node.createLiteralNode(name)
        ];
        if(isset){
            node.params.push( node.createIdentifierNode('value') )
            args.push( node.createIdentifierNode('value') );
        }else if( init ){
            if(init.type==='ObjectExpression'){
                init = node.createParenthesNode(init);
            }
            args.push(node.createChunkNode('void 0', false) )
            args.push(node.createArrowFunctionNode([], init));
        }
        const reactive = node.createCalleeNode( 
            node.createMemberNode([
                node.createThisNode(),
                node.createIdentifierNode('reactive')
            ]),
            args
        );
        node.body = reactive;
        return node;
    }

    createGetterNode(name, value, required, reactive){
        const args = [
            this.createLiteralNode(name)
        ];
        if( value ){
            args.push( this.createChunkNode('void 0', false) )
            args.push( this.createArrowFunctionNode([], value.type==='ObjectExpression' ? this.createParenthesNode(value) : value));
        }
        const node = this.createMethodNode(name,ctx=>{
            if( reactive ){
                ctx.body=[
                    ctx.createReturnNode( 
                        ctx.createCalleeNode( 
                            ctx.createMemberNode([
                                ctx.createThisNode(),
                                ctx.createIdentifierNode('reactive')
                            ]),
                            args
                        )
                    )
                ];
            }else{
                this.privateProperties.push(
                    this.createPropertyNode( ctx.createIdentifierNode(name), value)
                );
                const privateName = this.createPrivateRefsName();
                const memberNode = ctx.createMemberNode([
                    ctx.createThisNode(),
                    ctx.createIdentifierNode(privateName)
                ]);
                memberNode.computed = true;
                ctx.body=[
                    ctx.createReturnNode( ctx.createMemberNode([memberNode, ctx.createIdentifierNode(name)]) )
                ]
            }
        });
        node.kind = 'get';
        node.isAccessor = true;
        node.required = required;
        return node;
    }

    createSetterNode(name, required, reactive){
        const node = this.createMethodNode(name,ctx=>{
            if( reactive ){
                ctx.body=[
                    ctx.createStatementNode( 
                        ctx.createCalleeNode( 
                            ctx.createMemberNode([
                                ctx.createThisNode(),
                                ctx.createIdentifierNode('reactive')
                            ]),
                            [
                                this.createLiteralNode(name),
                                this.createIdentifierNode('value')
                            ]
                        )
                    )
                ];
            }else{
                const privateName = this.createPrivateRefsName();
                const memberNode = ctx.createMemberNode([
                    ctx.createThisNode(),
                    ctx.createIdentifierNode(privateName)
                ]);
                memberNode.computed = true;
                ctx.body=[
                    ctx.createStatementNode(
                        ctx.createAssignmentNode(
                            ctx.createMemberNode([memberNode, ctx.createIdentifierNode(name)]),
                            this.createIdentifierNode('value')
                        )
                    )
                ];
            }
        },[ this.createIdentifierNode('value') ]);
        node.kind = 'set';
        node.isAccessor = true;
        node.required = required;
        return node;
    }

    createDefaultConstructMethod(methodName, params=[]){
        if(this.isSkinClass)return super.createDefaultConstructMethod(methodName, params);
        const initProperties = this.initProperties;
        const inherit = this.inherit;
        var callSuper = null;
        if( !(initProperties && initProperties.length) && !(this.privateProperties.length > 0 || this.privateReactives.length > 0)){
            return null;
        }
        const version = this.builder.getBuildVersion();
        if( this.stack.isModuleForWebComponent( inherit ) ){
            if( version < 3 ){
                const propsNode = this.createMemberNode([ 
                    this.createIdentifierNode('arguments'), 
                    this.createLiteralNode(1)
                ]);
                propsNode.computed = true;
                callSuper = this.createMemberNode([
                    this.getModuleReferenceName(inherit),
                    this.createIdentifierNode('prototype'),
                    this.createIdentifierNode('_init')
                ]);
                params = [ propsNode ];
            }else{
                const propsNode = this.createMemberNode([ 
                    this.createIdentifierNode('arguments'), 
                    this.createLiteralNode(0)
                ]);
                propsNode.computed = true;
                callSuper = this.createIdentifierNode(this.getModuleReferenceName(inherit));
                params = [ propsNode ];
            }
        }else{
            callSuper = this.createNode('SuperExpression');
            callSuper.value =  this.getModuleReferenceName(inherit);
        }

        const node = this.createMethodNode( version < 3 ? null : methodName, (ctx)=>{
            this.createConstructInitPrivateNode(ctx)
            if( initProperties && initProperties.length ){
                initProperties.forEach( item=>{
                    ctx.body.push( item );
                });
            }
            if( inherit ){
                ctx.body.push( 
                    ctx.createStatementNode(
                        ctx.createCalleeNode( 
                            ctx.createMemberNode(
                                [
                                    callSuper,
                                    ctx.createIdentifierNode('call')
                                ]
                            ),[
                                ctx.createThisNode()
                            ].concat(params)
                        )
                    )
                );
            }
        }, []);
        if( version < 3 ){
            node.type ="FunctionExpression";
        }
        node.isDefaultConstructMethod = true;
        return node;
    }

    checkConstructMethod(){
        const version = this.builder.getBuildVersion();
        if( version>=3 ){
            this.checkV3ConstructMethod();
        }else{
            this.checkV2ConstructMethod();
        }
    }

    createHMRDependency( body ){
        const opts = this.plugin.options;
        if(!opts.hot || opts.mode === 'production')return null;
        const HMR = this.builder.getGlobalModuleById('dev.tools.HMR');
        this.addDepend( HMR );
    }

    getCodeSections(compilation){
        let jsx = '';
        let style = '';
        let script = compilation.source;
        let offset = 0;
        const substring = (stack)=>{
            let len = stack.node.end - stack.node.start;
            let start = stack.node.start - offset;
            let end = stack.node.end - offset;
            script = script.substring(0, start) + script.substring(end, script.length);
            offset+=len;
        }
        compilation.jsxElements.forEach(stack=>{
            jsx+=stack.raw();
            substring(stack);
        });
        compilation.jsxStyles.forEach(stack=>{
            style+=stack.raw();
            substring(stack);
        });
        style = style.replace(removeNewlineRE, '');
        jsx   = jsx.replace(removeNewlineRE, '');
        script = script.replace(removeNewlineRE, '');
        return {jsx, style, script};
    }

    createHMRHotAcceptNode(id){
        const opts = this.plugin.options;
        if(!opts.hot || opts.mode === 'production')return null

        const program = this.getParentByType('Program');
        if( program._createHMRHotAcceptNodeFlag )return null;

        const records = hotRecords.get(this.compilation);
        const sections = this.getCodeSections(this.compilation);
        let onlyRender = false;
        if(records){
            onlyRender = records.script === sections.script && records.style === sections.style && records.jsx !== sections.jsx;
        }
        hotRecords.set(this.compilation, sections);

        program._createHMRHotAcceptNodeFlag = true;
        const HMR = this.builder.getGlobalModuleById('dev.tools.HMR');
        const ifNode = this.createNode('IfStatement');
        const module = this.module;
        const moduleId = id instanceof Core.Token ? id : this.createIdentifierNode(id);
        const hmrHandler = this.builder.plugin.options.hmrHandler || 'module.hot';

        ifNode.condition = ifNode.createIdentifierNode(hmrHandler);
        const block = ifNode.createNode('BlockStatement');
        ifNode.consequent = block;

        const hashIdNode = this.createLiteralNode(this.getModuleHashId());
        const createApiNode = block.createNode('IfStatement');
        const unaryNode = createApiNode.createNode('UnaryExpression')
        unaryNode.argument = unaryNode.createCalleeNode(
            unaryNode.createMemberNode([
                unaryNode.createIdentifierNode(this.getModuleReferenceName(HMR, module)),
                unaryNode.createIdentifierNode('createRecord')
            ]),
            [
                hashIdNode,
                moduleId
            ]
        );
        unaryNode.operator='!';
        unaryNode.prefix = true;
        createApiNode.condition =  unaryNode;
        createApiNode.consequent = createApiNode.createNode('BlockStatement');
        createApiNode.consequent.body=[
            createApiNode.consequent.createCalleeNode(
                createApiNode.consequent.createMemberNode([
                    createApiNode.consequent.createIdentifierNode(this.getModuleReferenceName(HMR, module)),
                    createApiNode.consequent.createIdentifierNode( onlyRender ? 'rerender' : 'reload')
                ]),
                [
                    hashIdNode,
                    moduleId
                ]
            )
        ]

        block.body=[
            block.createStatementNode( block.createCalleeNode(
                block.createIdentifierNode( hmrHandler+'.accept' )
            )),
            createApiNode
        ];
        
        if(program.isProgram && program.afterBody){
            program.afterBody.push(ifNode);
        }else{
            this.afterBody.push(ifNode);
        }
    }

    checkV3ConstructMethod(){
       
        const initBody = [];
        const module = this.module;
        this.createHMRDependency(initBody);
        const injectAndProvide = this.provideProperties.concat(this.injectProperties);
        if( !this.construct ){
            if( this.module.inherit ){
                initBody.unshift(
                    this.createStatementNode(
                        this.createCalleeNode(
                            this.createMemberNode([
                                this.getModuleReferenceName(this.module.inherit, this.module),
                                this.createIdentifierNode('call')
                            ]),
                            [
                                this.createThisNode(),
                                this.createIdentifierNode('props')
                            ]
                        )
                    )
                );
            }
            this.construct = this.createMethodNode(module.id,ctx=>{
                    ctx.body = initBody;
                },
                [this.createIdentifierNode('props')]
            );
            this.construct.kind = 'method';
            this.construct.modifier = 'public';
        }else{
            this.construct.body.body.push( ...initBody );
        }

        if( injectAndProvide.length > 0){
            this.construct.body.body.push( ...injectAndProvide );
        }

        this.exportVueComponentNameRefNode = this.createStatementNode(
            this.createCreateVueComponentNode('createComponent', [
                this.createIdentifierNode(module.id),
                this.createCreateVueComponentOptionsNode(module.id, module)
            ])
        );
    }

    checkV2ConstructMethod(){
        const injectAndProvide = this.provideProperties.concat(this.injectProperties);
        const initBody = [];
        const module = this.module;
        this.createHMRDependency(initBody);
        if( this.construct ){
            this.construct.type = 'FunctionExpression';
            const callParams = [
                this.createThisNode()
            ];

            if( !this.construct.isDefaultConstructMethod ){
                const condition = this.createNode('ConditionalExpression');
                condition.test = condition.createNode('BinaryExpression');
                condition.test.operator = '>';
                condition.test.left = condition.createMemberNode([condition.createIdentifierNode('arguments'),condition.createIdentifierNode('length')]);
                condition.test.right = condition.createLiteralNode(1);
                condition.consequent = condition.createMemberNode([ 
                    condition.createIdentifierNode('arguments'), 
                    condition.createLiteralNode(1)
                ]);
                condition.consequent.computed = true;
                condition.alternate = this.createCalleeNode( this.createMemberNode([
                    this.createThisNode(),this.createIdentifierNode('getInitProps')
                ]), [this.createIdentifierNode('options')]);
                callParams.push( condition );
            }else{
                callParams.push( this.createLiteralNode(null) );
            }

            callParams.push( this.createIdentifierNode('options') );

            initBody.push( 
                this.createStatementNode(
                    this.createCalleeNode(
                        this.createMemberNode([
                            this.createParenthesNode( this.construct ),
                            this.createIdentifierNode('call')
                        ]),
                        callParams
                    )
                )
            );
        }

        if( initBody.length > 0 || injectAndProvide.length > 0 ){
            if( !this.construct && this.module.inherit ){
                initBody.push(
                    this.createStatementNode(
                        this.createCalleeNode(
                            this.createMemberNode([
                                this.getModuleReferenceName(this.module.inherit, this.module),
                                this.createIdentifierNode('prototype'),
                                this.createIdentifierNode('_init'),
                                this.createIdentifierNode('call')
                            ]),
                            [
                                this.createThisNode(),
                                this.createIdentifierNode('options')
                            ]
                        )
                    )
                );
            }

            initBody.push( ...injectAndProvide );
            initBody.push(
                this.createStatementNode(
                    this.createCalleeNode(
                        this.createMemberNode([
                            this.createThisNode(),
                            this.createIdentifierNode('_initialized')
                        ])
                    )
                )
            );
            const initMethod = this.createMethodNode(
                '_init',
                ctx=>{
                    ctx.body = initBody;
                },
                [
                    this.createIdentifierNode('options')
                ]
            );
            initMethod.kind = 'method';
            initMethod.modifier = 'public';
            initMethod.static = false;
            this.members.splice(0,0,initMethod);
        }

        this.construct = this.createDeclarationNode('const',[
            this.createDeclaratorNode(
                this.createIdentifierNode(module.id),
                this.createCreateVueComponentNode('createComponent', [this.createCreateVueComponentOptionsNode(module.id, module)])
            )
        ]);
        
    }

    createCreateVueComponentNode(methodName, args=[]){
        const module = this.module;
        const Component = this.builder.getGlobalModuleById('web.components.Component');
        this.addDepend( Component );
        return this.createCalleeNode(
            this.createMemberNode([
                this.createIdentifierNode( this.getModuleReferenceName(Component, module) ),
                this.createIdentifierNode(methodName)
            ]),
            args
        );
    }

    createCreateVueComponentOptionsNode(name, module){
        const properties = [
            this.createPropertyNode(this.createIdentifierNode('name'), this.createLiteralNode(`es-${name}`) )
        ];
        const opts =  this.plugin.options;
        if( opts.vueOptions.__file ){
            properties.push( this.createPropertyNode(this.createIdentifierNode('__file'), this.createLiteralNode(this.compilation.file) ) )
        }
        if( opts.vueOptions.__vccOpts ){
            properties.push( this.createPropertyNode(this.createIdentifierNode('__vccOpts'), this.createLiteralNode(true) ) )
        }
        if( opts.vueOptions.__asyncSetup ){
            const asyncSetup = opts.vueOptions.__asyncSetup;
            if( asyncSetup.mode !== 'none' ){
                let enable =asyncSetup.mode==='all' || opts.ssr && asyncSetup.mode ==='ssr' || !opts.ssr && asyncSetup.mode ==='nossr';
                if(enable && asyncSetup.filter && typeof asyncSetup.filter ==='function'){
                    enable = asyncSetup.filter(this.module.getName(), this.module.file)
                }
                if( enable ){
                    properties.push( this.createPropertyNode(this.createIdentifierNode('__asyncSetup'), this.createLiteralNode(true) ) )
                }
            }
        }

        if(this.builder.__scopeId){
            properties.push( this.createPropertyNode(this.createIdentifierNode('__scopeId'), this.createLiteralNode(this.plugin.options.scopeIdPrefix+this.builder.__scopeId) ) )
        }

        if(opts.hot !==false && opts.mode !== 'production'){
            properties.push( this.createPropertyNode(this.createIdentifierNode('__hmrId'), this.createLiteralNode(this.getModuleHashId()) ) )
        }

        if( opts.ssr && opts.vueOptions.__ssrContext !== false ){
            const compiler = this.compiler;
            const ws = compiler.workspace;
            const file = compiler.normalizePath(path.relative(ws, this.compilation.file));
            properties.push( this.createPropertyNode(this.createIdentifierNode('__ssrContext'), this.createLiteralNode(file) ) )
        }
        
        if( this.props.length > 0 ){
            properties.push( this.createPropertyNode('props',this.createObjectNode( this.props )) )
        }
        return this.createObjectNode( properties );
    }

    createExportDeclaration(id){
        this.createHMRHotAcceptNode(id);
        if( this.exportVueComponentNameRefNode ){
            return super.createExportDeclaration( this.exportVueComponentNameRefNode );
        }
        return super.createExportDeclaration(id);
    }
}

module.exports = JSXClassBuilder;
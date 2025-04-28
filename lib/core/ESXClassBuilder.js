import ClassBuilder from "./ClassBuilder";
import TokenNode from "@easescript/transform/lib/core/Node";
import Utils from "easescript/lib/core/Utils";
import { createStaticReferenceNode, getMethodAnnotations, getModuleAnnotations } from "./Common";

const hotRecords = new Map();
const removeNewlineRE = /[\r\n\t]/g;

class ESXClassBuilder extends ClassBuilder{
    #injectProperties = [];
    #provideProperties = [];
    #privateReactives = [];
    #exportVueComponentNode = null;
    #props = [];

    createInitMemberProperty(ctx, node, stack, staticFlag=false){
        const reactiveAnnotation = !staticFlag && node.modifier === "private" && getMethodAnnotations(stack, ['reactive'])[0];
        if(reactiveAnnotation){
            this.#privateReactives.push(
                [
                    node.key.value, 
                    ctx.createObjectExpression([
                        ctx.createProperty( 
                            ctx.createIdentifier('get'), 
                            this.createReactiveWrapNode(ctx, node.key.value, node.init, false),
                            node.key.stack
                        ),
                        ctx.createProperty( 
                            ctx.createIdentifier('set'), 
                            this.createReactiveWrapNode(ctx, node.key.value, null, true),
                            node.key.stack
                        )
                    ]),
                ]
            );
            return true;
        }
        super.createInitMemberProperty(ctx, node, stack, staticFlag);
    }

    createMemeberAccessor(ctx, child, stack, reactiveFlag){
        const target ={
            get:this.createGetterNode(ctx, child.key.value, false, false, reactiveFlag),
            set:this.createSetterNode(ctx, child.key.value, false, reactiveFlag),
            modifier:child.modifier,
            isAccessor:true
        }
        target.init = child.init;
        target.key = target.get.key;
        target.kind = 'accessor';
        if(!child.injector){
            this.createComponentProps(ctx, child, stack);
        }
        return target;
    }

    createMemeber(ctx, stack, staticFlag=false){
        const child = super.createMemeber(ctx, stack, staticFlag);
        if(child && !child.static ){  
            if(child.modifier === "public"){
                if(child.type==="PropertyDefinition" ){
                    const reactiveFlag = child.injector ? !!getMethodAnnotations(stack, ['reactive'])[0] : true;
                    const target =this.createMemeberAccessor(ctx, child, stack, reactiveFlag)
                    if(!child.injector){
                        this.createComponentProps(ctx, child, stack);
                    }
                    return target;
                }else if( child.type ==="MethodSetterDefinition" ){
                    this.createComponentProps(ctx, child, stack);
                }
            }else if( child.type==="PropertyDefinition" && child.modifier !== "private" ){
                this.privateProperties.push(
                    ctx.createProperty(child.key, child.init||ctx.createLiteral(null))
                );
                const reactiveFlag = !!getMethodAnnotations(stack, ['reactive'])[0];
                return this.createMemeberAccessor(ctx, child, stack, reactiveFlag)
            }
            if(child.type==='MethodGetterDefinition' || child.type==='MethodDefinition'){
                const opts = ctx.plugin.options;
                if(opts.hot && opts.mode !== 'production'){
                    child.isConfigurable = true;
                }
            }
        }
        return child;
    }

    createComponentProps(ctx, node, stack){
        if(node.modifier !== "public" || !(node.type==="PropertyDefinition" || node.type==="MethodSetterDefinition") )return;
        if( stack.isMethodSetterDefinition || stack.isPropertyDefinition ){
            if(node.injector){
               return;
            }
        }
        const propName = node.key.value;
        let originType = null;
        if( node.type==="MethodSetterDefinition" ){
            let _type = null;
            if(stack.params[0]){
                _type = stack.params[0].type();
                originType = ctx.getAvailableOriginType( _type );
            }
            if( (!_type || _type.isAnyType) && stack.module){
                const desc = stack.module.getDescriptor(propName,desc=>!!desc.isMethodGetterDefinition);
                if(desc){
                    originType = ctx.getAvailableOriginType( desc.type() );
                }
            }
        }else{
            originType =ctx.getAvailableOriginType( stack.type() );
        }

        const properties = [
            ctx.createProperty(
                ctx.createIdentifier('type'), 
                originType ? ctx.createIdentifier(originType) : ctx.createLiteral(null)
            )
        ];

        if(node.init){
            if( node.init.type !=="Literal" ){
                properties.push(
                    ctx.createProperty(
                        ctx.createIdentifier('default'),
                        ctx.createArrowFunctionExpression(
                           ctx.createParenthesizedExpression(node.init)
                        )
                    )
                );
            }else{
                properties.push(
                    ctx.createProperty(
                        ctx.createIdentifier('default'),
                        node.init
                    )
                );
            }
        }

        this.#props.push(ctx.createProperty(
            ctx.createIdentifier(propName), 
            ctx.createObjectExpression(properties)
        ));
    }

    createAnnotations(ctx, stack, node, staticFlag){
        node = super.createAnnotations(ctx, stack, node, staticFlag);
        const annotations = stack.annotations;
        if( staticFlag || !annotations)return;
        if( !stack.isConstructor && stack.isMethodDefinition && !stack.isAccessor ){
            const provider = getMethodAnnotations(stack, ['provider'])[0];
            if(provider){
                const args = provider.getArguments();
                this.#provideProperties.push( this.createAddProviderNode(ctx, args[0] ? args[0].value : node.key.value, node.key.value, true, Utils.isModifierPrivate(stack)) );
                node.provider=true;
            }
        }else if( stack.isMethodGetterDefinition || stack.isPropertyDefinition ){
            const provider = getMethodAnnotations(stack, ['provider'])[0];
            if(provider){
                const args = provider.getArguments();
                this.#provideProperties.push( this.createAddProviderNode(ctx, args[0] ? args[0].value : node.key.value, node.key.value, false , Utils.isModifierPrivate(stack)) );
                node.provider=true;
            }
        }

        if( stack.isMethodSetterDefinition || stack.isPropertyDefinition ){
            const injector = getMethodAnnotations(stack, ['injector'])[0];
            if(injector){
                const injectorArgs = injector.getArguments();
                const name = node.key.value;
                let from = name;
                if( injectorArgs.length > 0 ){
                    from = injectorArgs[0].value || from;
                }
                this.#injectProperties.push( this.createInjectPropertyNode(ctx, name, from, node.init || null) ); 
                node.injector=true;
            }
        }
        node.required = !!getMethodAnnotations(stack, ['required'])[0];
        return node;
    }

    createInjectPropertyNode(ctx, name,from,value){
        const args = [
            ctx.createLiteral(name)
        ];
        if( from !== name ){
            args.push( ctx.createLiteral(from) );
        }
        if(value){
            if(args.length ===1){
                args.push( ctx.createChunkExpression('void 0', false) );
            }
            args.push(TokenNode.is(value) ? value : ctx.createLiteral(value) );
        }
        return ctx.createExpressionStatement(
            ctx.createCallExpression(
                ctx.createMemberExpression([
                    ctx.createThisExpression(),
                    ctx.createIdentifier('inject')
                ]),
                args
            )
        );
    }

    createAddProviderNode(ctx, key, name, isMethod, isPrivate=false){
        const thisObj = isPrivate ? ctx.createComputeMemberExpression([
            ctx.createThisExpression(),
            ctx.createIdentifier(this.createPrivateRefsName(ctx))
        ]) : ctx.createThisExpression();
        const target = isMethod ? ctx.createMemberExpression([
            thisObj,
            ctx.createIdentifier(name)
        ]) : ctx.createArrowFunctionExpression(ctx.createMemberExpression([
            thisObj,
            ctx.createIdentifier(name)
        ]));
        return ctx.createExpressionStatement(
            ctx.createCallExpression(
                ctx.createMemberExpression([
                    ctx.createThisExpression(),
                    ctx.createIdentifier('provide')
                ]),
                [
                    ctx.createLiteral(key),
                    isMethod ? ctx.createCallExpression( 
                        ctx.createMemberExpression([
                            target,
                            ctx.createIdentifier('bind')
                        ]), 
                        [
                            ctx.createThisExpression()
                        ]
                    ) : target
                ]
            )
        );
    }

    createReactiveWrapNode(ctx, name, init, isset=false){
        const callArgs = [
            ctx.createLiteral(name)
        ];
        const args = [];
        if(isset){
            args.push( ctx.createIdentifier('value') )
            callArgs.push( ctx.createIdentifier('value') );
        }else if( init ){
            if(init.type==='ObjectExpression'){
                init = ctx.createParenthesizedExpression(init);
            }
            callArgs.push(ctx.createChunkExpression('void 0', false) )
            callArgs.push(ctx.createArrowFunctionExpression(init));
        }
        return ctx.createArrowFunctionExpression(ctx.createCallExpression(
            ctx.createMemberExpression([
                ctx.createThisExpression(),
                ctx.createIdentifier('reactive')
            ]),
            callArgs
        ), args);
    }

    createGetterNode(ctx, name, value, required, reactive){
        const args = [
            ctx.createLiteral(name)
        ];
        if( value ){
            args.push( ctx.createChunkExpression('void 0', false) )
            args.push( ctx.createArrowFunctionExpression(value.type==='ObjectExpression' ? ctx.createParenthesizedExpression(value) : value));
        }
        const block = ctx.createBlockStatement();
        if(reactive){
            block.body.push(ctx.createReturnStatement( 
                ctx.createCallExpression( 
                    ctx.createMemberExpression([
                        ctx.createThisExpression(),
                        ctx.createIdentifier('reactive')
                    ]),
                    args
                )
            ))
        }else{
            const privateName = this.createPrivateRefsName(ctx);
            const memberNode = ctx.createMemberExpression([
                ctx.createThisExpression(),
                ctx.createIdentifier(privateName)
            ]);
            memberNode.computed = true;
            block.body.push(
                ctx.createReturnStatement(ctx.createMemberExpression([
                    memberNode, ctx.createIdentifier(name)
                ]))
            );
        }
        const node = ctx.createMethodDefinition(name,block);
        node.kind = 'get';
        node.isAccessor = true;
        node.required = required;
        return node;
    }

    createSetterNode(ctx, name, required, reactive){
        const block = ctx.createBlockStatement();
        if(reactive){
            block.body.push(ctx.createExpressionStatement( 
                ctx.createCallExpression( 
                    ctx.createMemberExpression([
                        ctx.createThisExpression(),
                        ctx.createIdentifier('reactive')
                    ]),
                    [
                        ctx.createLiteral(name),
                        ctx.createIdentifier('value')
                    ]
                )
            ))
        }else{
            const privateName = this.createPrivateRefsName(ctx);
                const memberNode = ctx.createMemberExpression([
                    ctx.createThisExpression(),
                    ctx.createIdentifier(privateName)
                ]);
                memberNode.computed = true;
                block.body.push(
                    ctx.createExpressionStatement(
                        ctx.createAssignmentExpression(
                            ctx.createMemberExpression([memberNode, ctx.createIdentifier(name)]),
                            ctx.createIdentifier('value')
                        )
                    )
                );
        }
        const node = ctx.createMethodDefinition(name,block,[ctx.createIdentifier('value')]);
        node.kind = 'set';
        node.isAccessor = true;
        node.required = required;
        return node;
    }

    checkNeedInitPrivateNode(){
        if(this.#privateReactives.length>0)return true;
        return super.checkNeedInitPrivateNode();
    }

    checkConstructor(ctx, construct, module){
        super.checkConstructor(ctx, construct, module)
        const checkSupper = ()=>{
            if( this.inherit && module.inherit && construct.isDefaultConstructMethod && !construct.hasCallSupper){
                construct.body.body.unshift(this.createCallSuperNode(ctx));
                construct.hasCallSupper = true;
            }
        }
        if(this.#privateReactives.length>0){
            checkSupper();
            let privateName = this.createPrivateRefsName(ctx)
            const privateNode = ctx.createComputeMemberExpression([
                ctx.createThisExpression(),
                ctx.createIdentifier(privateName)
            ]);
            construct.body.body.push(ctx.createExpressionStatement( 
                ctx.createCallExpression( 
                    ctx.createMemberExpression([
                        ctx.createIdentifier('Object'),
                        ctx.createIdentifier('defineProperties')
                    ]),
                    [
                        privateNode,
                        ctx.createObjectExpression(this.#privateReactives.map( item=>{
                            const [key,property] = item;
                            return ctx.createProperty(ctx.createIdentifier(key), property)
                        }))
                    ]
                )
            ));
        }
    
        const injectAndProvide = this.#provideProperties.concat(this.#injectProperties);
        if( injectAndProvide.length > 0){
            checkSupper();
            this.#provideProperties.length = 0;
            this.#injectProperties.length = 0;
            construct.body.body.push( ...injectAndProvide );
        }

        this.#exportVueComponentNode = this.createCreateVueComponentNode(
            ctx,
            'createComponent',
            [
                ctx.createIdentifier(this.getModuleDeclarationId(module)),
                this.createVueComponentOptionsNode(
                    ctx,
                    module.id,
                    module
                )
            ]
        );
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

    createHMRHotAcceptNode(ctx, moduleId){
        const opts = ctx.plugin.options;
        if(!opts.hot || opts.mode === 'production')return null;
        if(ctx.__createHMRFlag)return;
        ctx.__createHMRFlag = true;
        const compilation = this.compilation;
        const records = hotRecords.get(compilation);
        const sections = this.getCodeSections(compilation);
        let onlyRender = false;
        if(records){
            onlyRender = records.script === sections.script && records.style === sections.style && records.jsx !== sections.jsx;
        }
        hotRecords.set(compilation, sections);
        const hmrHandler = opts.hmrHandler || 'module.hot';
        const hashIdNode = ctx.createLiteral( ctx.getHashId() );
        moduleId = ctx.createIdentifier(moduleId);
        
        ctx.afterBody.push(ctx.createIfStatement(
            ctx.createChunkExpression(hmrHandler, false, false),
            ctx.createBlockStatement([
                ctx.createExpressionStatement( 
                    ctx.createCallExpression(
                        ctx.createChunkExpression( hmrHandler+'.accept', false, false)
                    )
                ),
                ctx.createIfStatement(
                    ctx.createUnaryExpression(
                        ctx.createCallExpression(
                            createStaticReferenceNode(ctx, this.stack, "dev.tools.HMR", "createRecord"),
                            [
                                hashIdNode,
                                moduleId
                            ]
                        ),
                        '!',
                        true
                    ),
                    ctx.createBlockStatement([
                        ctx.createCallExpression(
                            createStaticReferenceNode(ctx, this.stack, "dev.tools.HMR", onlyRender ? 'rerender' : 'reload'),
                            [
                                hashIdNode,
                                moduleId
                            ]
                        )
                    ])
                )
            ])
        ));
    }

    createCreateVueComponentNode(ctx, methodName, args=[]){
        return ctx.createCallExpression(
            createStaticReferenceNode(
                ctx,
                this.stack,
                'web.components.Component',
                methodName
            ),
            args
        );
    }

    createVueComponentOptionsNode(ctx, name, module){
        const properties = [
            ctx.createProperty(
                ctx.createIdentifier('name'),
                ctx.createLiteral(`es-${name}`)
            )
        ];
        const options = ctx.plugin.options;
        const vueOpts =  options.vue || {};
        const makeOptions =  vueOpts.makeOptions || {};
        if( makeOptions.file ){
            properties.push(
                ctx.createProperty(
                    ctx.createIdentifier('__file'),
                    ctx.createLiteral(this.compilation.file)
                )
            )
        }
        if(makeOptions.async){
            const async = makeOptions.async;
            const ssr = !!options.ssr;
            if( async.mode !== 'none' ){
                let enable =async.mode==='all' || ssr && async.mode ==='ssr' || !ssr && async.mode ==='nossr';
                if(enable && async.filter && typeof async.filter ==='function'){
                    enable = async.filter({module, compilation:this.compilation, ssr})
                }
                if(enable){
                    properties.push(
                        ctx.createProperty(
                            ctx.createIdentifier('__async'),
                            ctx.createLiteral(true)
                        )
                    )
                }
            }
        }

        let scopeId = this.getStyleScopeId(ctx);
        if(scopeId){
            properties.push(
                ctx.createProperty(
                    ctx.createIdentifier('__scopeId'),
                    ctx.createLiteral(
                        vueOpts.scopePrefix+scopeId
                    )
                )
            )
        }

        if(options.hot !==false && options.mode !== 'production'){
            properties.push(
                ctx.createProperty(
                    ctx.createIdentifier('__hmrId'),
                    ctx.createLiteral(
                        ctx.getHashId()
                    )
                )
            )
        }

        if(makeOptions.exportClass===false){
            properties.push(
                ctx.createProperty(
                    ctx.createIdentifier('__exportClass'),
                    ctx.createLiteral(false)
                )
            )
        }

        if( options.ssr && makeOptions.ssrCtx !== false ){
            const file = ctx.compiler.getRelativeWorkspace(this.compilation.file)
            if(file){
                properties.push(
                    ctx.createProperty(
                        ctx.createIdentifier('__ssrCtx'),
                        ctx.createLiteral(
                            Utils.normalizePath(file)
                        )
                    )
                )
            }
        }

        properties.push(
            ...this.getModuleDefineOptions(ctx, this.module)
        )
        
        if( this.#props.length > 0 ){
            properties.push(
                ctx.createProperty(
                    ctx.createIdentifier('props'),
                    ctx.createObjectExpression( this.#props )
                )
            )
        }
        return ctx.createObjectExpression( properties );
    }

    getStyleScopeId(ctx){
        return ctx.getStyleScopeId(this.compilation);
    }

    getModuleDefineOptions(ctx, module){
        const results = Object.create(null)
        getModuleAnnotations(module, ['define']).forEach(annot=>{
            const args = annot.getArguments()
            if(!args.length)return;
            let value = String(args[0].value).toLowerCase()
            if(value ==='emits' || value==='options'){
                const _args = value ==='emits' ? args.slice(1) : args.slice(2)
                const key = value ==='emits' ? 'emits' : args[1].value;
                if(String(key) ==='props'){
                    console.error(`[ES-VUE] Options 'props' should declared as properties in the component class`)
                }else{
                    let obj = Object.create(null);
                    let arr = [];
                    let literal = null
                    let maybeLiteralType = _args.length > 1 ? _args[_args.length-1] : null;
                    if(maybeLiteralType && String(maybeLiteralType.key).toLowerCase()==='type'){
                        literal = maybeLiteralType.value === '--literal'
                        if(!literal){
                            maybeLiteralType = null
                        }
                    }else{
                        maybeLiteralType = null
                    }

                    _args.forEach(arg=>{
                        if(arg===maybeLiteralType)return;
                        if(arg.assigned){
                            obj[arg.key] = arg.value
                        }else{
                            arr.push(arg.value)
                        }
                    });

                    if(results[key]){
                        if(!results[key].literal){
                            const oldO = results[key].obj
                            const oldA = results[key].arr;
                            Object.keys(obj).forEach(key=>{
                                if(!oldO.hasOwnProperty(key)){
                                    oldO[key] = obj[key];
                                }
                            })
                            arr.forEach(val=>{
                                if(!oldA.includes(val)){
                                    oldA.push(val)
                                }
                            })
                        }
                    }else{
                        results[key] = {obj, arr, literal}
                    }
                }
            }
        });

        let keys = Object.keys(results);
        if(keys.length>0){
            return keys.map(key=>{
                const target = results[key];
                let literal = target.literal;
                let arrayNode = null;
                let objectNode = null;
                let keys = Object.keys(target.obj);
                if(keys.length>0){
                    objectNode =ctx.createObjectExpression(keys.map(key=>{
                        return ctx.createProperty(
                            ctx.createIdentifier(key),
                            ctx.createLiteral(target.obj[key])
                        )
                    }))
                }

                if(target.arr.length > 0){
                    arrayNode = ctx.createArrayExpression(
                        target.arr.map(val=>{
                            return ctx.createLiteral(val)
                        })
                    )
                }

                let propertyNode = arrayNode || objectNode;
                if(arrayNode && objectNode){
                    propertyNode = ctx.createCallExpression(
                        ctx.createMemberExpression([
                            ctx.createIdentifier('Object'),
                            ctx.createIdentifier('assign'),
                        ]),
                        [arrayNode, objectNode]
                    )
                }else if(literal && arrayNode){
                    if(arrayNode.elements.length===1){
                        propertyNode = arrayNode.elements[0]
                    }
                }
                return ctx.createProperty(ctx.createIdentifier(key), propertyNode)
            })
        }
        return []
    }

    createExport(ctx, module){
        if(this.stack.compilation.mainModule===module){
            let id = this.getModuleDeclarationId(module)
            let opts = ctx.plugin.options;
            let isHot = true;
            let exportNode = this.#exportVueComponentNode || ctx.createIdentifier(id);
            if(opts.ssr || !opts.hot || opts.mode === 'production'){
                isHot = false;
            }

            if(isHot){
                let exportName = ctx.getGlobalRefName(null, "_export_"+id);
                ctx.afterBody.push(
                    ctx.createVariableDeclaration('const', [
                        ctx.createVariableDeclarator(
                            ctx.createIdentifier(exportName),
                            exportNode
                        )
                    ])
                );
                this.createHMRHotAcceptNode(ctx, exportName);
                exportNode = ctx.createIdentifier(exportName);
            }else{
                exportNode = ctx.createExpressionStatement(exportNode)
            }

            ctx.addExport(
                'default',
                exportNode
            )
        }
    }
}

export default ESXClassBuilder;
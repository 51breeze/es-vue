const JSXClassBuilder = require('../JSXClassBuilder');
const Core = require('../Core');

const LifecycleMaps={
    'onBeforeUpdate':true,
    'onUpdated':true,
    'onBeforeMount':true,
    'onMounted':true,
    'onBeforeUnmount':true,
    'onUnmounted':true,
    'onActivated':true,
    'onDeactivated':true,
    'onErrorCaptured':true,
    'onRenderTracked':true,
    'onRenderTriggered':true,
    'onServerPrefetch':true,
    'onInitialized':true,
};

const LifecycleMapKeys={
    'onBeforeUpdate':'beforeUpdate',
    'onUpdated':'updated',
    'onBeforeMount':'beforeMount',
    'onMounted':'mounted',
    'onBeforeUnmount':'beforeUnmount',
    'onUnmounted':'unmounted',
    'onActivated':'activated',
    'onDeactivated':'deactivated',
    'onErrorCaptured':'errorCaptured',
    'onRenderTracked':'renderTracked',
    'onRenderTriggered':'renderTriggered',
    'onServerPrefetch':'serverPrefetch',
    'onInitialized':'beforeCreate',
};

class VueBuilder extends JSXClassBuilder{
    constructor(stack, ctx, type){
        super(stack,ctx, type);
        this.isVueBuilder = true;
        this.isRawBuilder = true;
        this.renders = [];
        this.templates = [];
        this.templateRefMethods = [];
        this.dataProperties = [];
        this.propProperties = [];
        this.watchProperties = [];
        this.computedProperties = [];
        this.lifecycleMethods = [];
        this.useVueContext = new Map();
        this.renderMethod = null;
        this.beforeUpdateInvokes = [];
    }

    createTemplateNode( children, attributes ){
        const node = this.createNode('JSXElement')
        node.openingElement = node.createNode('JSXOpeningElement')
        node.openingElement.attributes = attributes || [];
        node.openingElement.name = node.createIdentifierNode('template');
        node.closingElement = node.createNode('JSXClosingElement')
        node.closingElement.name = node.createIdentifierNode('template');
        node.children = children || [];
        return node;
    }

    createScriptNode( children, attributes ){
        const node = this.createNode('JSXElement')
        node.openingElement = node.createNode('JSXOpeningElement')
        node.openingElement.attributes = attributes || [];
        node.openingElement.name = node.createIdentifierNode('script');
        node.closingElement = node.createNode('JSXClosingElement')
        node.closingElement.name = node.createIdentifierNode('script');
        node.children = children || [];
        return node;
    }

    createAttrNode(ctx, name, value){
        const node = ctx.createNode('JSXAttribute')
        node.name = name
        node.value = value
        if(name)name.parent = node;
        if(value)value.parent = node;
        return node;
    }


    create(){
        if( !this.checkSyntaxPresetForClass() ){
            return null;
        }
        if( this.builder.isBuildVueRawFormat() ){
            if( this.builder.isApplication(this.module) ){
                return this.createStart();
            }else{
                return this.createRaw();
            }
        }else{
            return this.createStart();
        }
    }

    createStart(){
    
        const module = this.module;
        const body = this.body;
        const multiModule = this.stack.compilation.modules.size > 1;
        const mainModule = this.compilation.mainModule;
        this.createClassStructuralBody();
        this.createModuleAssets(module, multiModule, mainModule);

        this.members.push( ...this.templateRefMethods );

        const Component = this.builder.getGlobalModuleById('web.components.Component');
        this.addDepend( Component );

        if( !multiModule || mainModule === module ){
            body.push( ...this.createDependencies(module, multiModule, mainModule) );
            const references = this.builder.geImportReferences( module );
            if( references ){
                body.push( ...Array.from( references.values() ) );
            } 
        }else{
            const program = this.getParentByType('Program');
            if( program.isProgram && program.imports ){
                program.imports.push( ...this.createDependencies(module, multiModule, mainModule) );
                const references = this.builder.geImportReferences( module );
                if( references ){
                    program.imports.push( ...Array.from( references.values() ) );
                }
            }
        }

        if( this.privateSymbolNode ){
            body.push( this.privateSymbolNode );
        }

        body.push( ...this.beforeBody.splice(0,this.beforeBody.length) )
        this.construct && body.push( this.construct );
        body.push( this.createStatementMember('methods', this.methods ) );
        body.push( this.createStatementMember('members', this.members ) );
        body.push( this.createClassDescriptor() );
        body.push( ...this.afterBody.splice(0, this.afterBody.length) );

        const componentsNode = this.createComponentsOptionNode();
        const propsOptions = this.propProperties.length > 0 ? this.createPropertyNode('props',this.createObjectNode( this.propProperties ) ) : null;
        const instaneName =  this.builder.genMembersName(this.module,'esInstance',this.module);
        const privateName = this.privateName ? this.createPropertyNode('esPrivateKey', this.createLiteralNode(this.privateName) ) : null;
        const properties = [
            this.createPropertyNode(this.createIdentifierNode('name'), this.createLiteralNode(`es-${module.id}`) ),
            this.createPropertyNode('hasTemplate', this.createLiteralNode( this.templates.length > 0 ) ),
            this.createPropertyNode('esHandle', this.createLiteralNode(instaneName) ),
            privateName,
            propsOptions,
            componentsNode
        ].filter( item=>!!item );

        if( this.builder.isApplication(this.module) ){
            body.push( this.createDefineVueComponentNode( this.createIdentifierNode(module.id),  this.createObjectNode(properties) ) );
        }else{
            body.push( this.createMakeVueComponentNode( this.createIdentifierNode(module.id),  this.createObjectNode(properties) ) );
        }

        if( multiModule ){
            if( mainModule === module ){
                body.push( this.createExportDeclaration(module.id) );
            }else{
                const parenthes = this.createNode("ParenthesizedExpression");
                parenthes.expression = parenthes.createCalleeNode(this.createFunctionNode((ctx)=>{
                    this.parent = ctx;
                    ctx.body.push( this );
                    const stat = ctx.createNode('ReturnStatement');
                    stat.argument = stat.createIdentifierNode( module.id  );
                    ctx.body.push(stat);
                }));
                return this.createDeclarationNode('const',[
                    this.createDeclaratorNode( module.id,  parenthes)
                ]);
            }
        }else{
            body.push( this.createExportDeclaration(module.id) );
        }

        this.body = [
            this.makeTemplateNode(),
            this.createScriptNode( body.splice(0, body.length) )
        ]
        return this;
    }


    createClassMemeberNode(memeberStack){
        const templateLen = this.templates.length;
        const child = this.createToken(memeberStack);
        if( !child.static && !this.builder.isApplication(this.module) ){  
            if( child.modifier === "public" ){
                if( child.type==="PropertyDefinition" ){
                    const target ={
                        get:this.createGetterNode(child.key.value,child.init),
                        set:this.createSetterNode(child.key.value),
                        modifier:child.modifier,
                        isAccessor:true
                    }
                    target.init = child.init;
                    target.key = target.get.key;
                    target.kind = 'accessor';
                    this.createComponentProps(child, memeberStack);
                    return target;
                }else if( child.type ==="MethodSetterDefinition" ){
                    this.createComponentProps(child, memeberStack);
                }
            }else if( child.type==="PropertyDefinition" && child.modifier !== "private" ){
                const reactiveAnnotation = (memeberStack.annotations || []).find( item=>item.name.toLowerCase() ==='reactive' );
                if( reactiveAnnotation ){
                    const target ={
                        get:this.createGetterNode(child.key.value,child.init),
                        set:this.createSetterNode(child.key.value),
                        modifier:child.modifier,
                        isAccessor:true
                    }
                    target.init = child.init;
                    target.key = target.get.key;
                    target.kind = 'accessor';
                    return target;
                }
            }
        }

        if( this.templates.length != templateLen ){
            return this.renderMethodToTemplateNode(child, memeberStack);
        }

        return child;
    }


    createPrivatePropertyNode(stack,node,isStatic){
        if( this.plugin.options.enablePrivateChain ){
            return super.createPrivatePropertyNode(stack,node,isStatic);
        } 
    }

    cratePrivatePropertyNodeOf(key, init){
        if( this.plugin.options.enablePrivateChain ){
            this.privateProperties.push(
                this.createPropertyNode(key, init)
            );
        }
    }

    makeTemplateNode(){
        if( this.templates.length > 0 ){
            if( this.templates.length > 1 ){
                const children = this.templates.map( (temp,index)=>{
                    const jsxNode = temp[0];
                    const node = jsxNode.createNode('BinaryExpression')
                    node.left = node.createIdentifierNode('__$$TEMPLATE_VALUE');
                    node.right = node.createLiteralNode( temp[1] );
                    node.operator = '==';
                    return this.createTemplateNode([jsxNode], [
                        this.createAttrNode(jsxNode, jsxNode.createIdentifierNode( index==0 ? 'v-if' : 'v-else-if'), node )
                    ])
                });
                return this.createTemplateNode( children );
            }else{
                if( Array.isArray(this.templates[0][0]) ){
                    return this.createTemplateNode( this.templates[0][0] );
                }
                return this.createTemplateNode( [ this.templates[0][0] ] );
            }
        }
        return null
    }

    createRaw(){

        const module = this.module;
        const body = this.body;
        const multiModule = this.stack.compilation.modules.size > 1;
        const mainModule = this.compilation.mainModule;
       
        this.createRawClassBody();

        this.templateRefMethods.forEach( item=>{
            item.isMethod = true;
        });

        this.members.push( ...this.templateRefMethods );

        const lifecycle = this.lifecycleMethods.map( method=>{
            method.key.value = LifecycleMapKeys[method.key.value] || method.key.value;
            return method;
        })

        //const onInitialized = lifecycle.find( item=>item.key.value ==='onInitialized' );
        let setup = null;

        // if( this.beforeUpdateInvokes.length > 0 || this.construct || onInitialized){
        //     setup = this.createMethodNode('setup',(ctx)=>{

        //         const fn = this.createFunctionNode((ctx)=>{
        //             if( this.renders.length > 0 ){
        //                 const onBeforeUpdateFnNode = this.createArrowFunNode((ctx)=>{
        //                     ctx.body.push( ...this.renders  )
        //                 });
        //                 ctx.body.push(this.createStatementNode(
        //                     this.createVueCallApiMethodNode('onBeforeUpdate', onBeforeUpdateFnNode) 
        //                 ));
        //             }
        //             ctx.body.push( ctx.createReturnNode( this.createThisNode() ) )
        //         });

        //         const node = this.createCalleeNode( 
        //             this.createMemberNode([
        //                 this.createParenthesNode(fn), 
        //                 this.createIdentifierNode('call')
        //             ]),
        //             [
        //                 this.createVueCallApiMethodNode('getCurrentInstance')
        //             ]
        //         );
                
        //         ctx.body.push( ctx.createReturnNode(node ) );

        //     });
        //     setup.isMethod = true;
        //     this.createImportVueContextReferenceNode();
        // }

        let _extends = this.module.inherit;
        if( _extends ){
            _extends = this.createPropertyNode('extends', this.createIdentifierNode(this.getModuleReferenceName(_extends)) )
        }

        let construct = this.checkV3ConstructMethod();

        this.createModuleAssets(module, multiModule, mainModule);
        if( !multiModule || mainModule === module ){
            body.push( ...this.createDependencies(module, multiModule, mainModule) );
            const references = this.builder.geImportReferences( module );
            if( references ){
                body.push( ...Array.from( references.values() ) );
            }
        }else{
            const program = this.getParentByType('Program');
            if( program.isProgram && program.imports ){
                program.imports.push( ...this.createDependencies(module, multiModule, mainModule) );
                const references = this.builder.geImportReferences( module );
                if( references ){
                    program.imports.push( ...Array.from( references.values() ) );
                }
            }
        }

        body.push( ...this.beforeBody.splice(0, this.beforeBody.length) );

        const createProperty = (name, value)=>{
            if( name ==='data' || name ==='provide' ){
                let node = this.createMethodNode(name, (block)=>{
                    value.parent = block;
                    block.body.push( block.createReturnNode( value ) )
                });
                node.isMethod = true
                return node;
            }
            let node = this.createPropertyNode( this.createIdentifierNode(name), value );
            return node;
        }

        const componentsNode = this.createComponentsOptionNode();
        const props = createProperty('props', this.createObjectNode( this.propProperties ) );
        const data = createProperty('data', this.createObjectNode( this.dataProperties ) );
        const wath = createProperty('wath', this.createObjectNode( this.watchProperties ) );
        const computed = createProperty('computed', this.createObjectNode( this.computedProperties ) );
        const provide = this.provideProperties.length > 0 ? createProperty('provide', this.createObjectNode( this.provideProperties ) ) : null;
        const inject = this.injectProperties.length > 0 ? createProperty('inject', this.createObjectNode( this.injectProperties ) ) : null;
        
        const staticMethods = this.methods;
        const memberMethods =  createProperty('methods', this.createObjectNode(this.members) );
        const name = this.module.id;
        const properties = [
            _extends,
            props, 
            data, 
            provide, 
            inject, 
            wath, 
            computed, 
            ...lifecycle,
            ...staticMethods,
            memberMethods, 
            this.renderMethod, 
            setup, 
            componentsNode
        ].filter( item=>!!item );

        const beforeUpdateInvokes = this.beforeUpdateInvokes.length > 0 ? this.createArrayNode(this.beforeUpdateInvokes) : null;

        const main = this.createStatementNode( 
            this.createDeclarationNode(
                'const',
                [
                    this.createDeclaratorNode(
                        name,
                        this.createMakeVueComponentNode( construct, this.createObjectNode(properties), beforeUpdateInvokes)
                    )
                ]
            )
        );

        body.push( main );
        body.push( ...this.afterBody.splice(this.afterBody.length) )

        if( multiModule ){
            if( mainModule === module ){
                body.push( this.createExportDeclaration(module.id) );
            }else{
                const parenthes = this.createNode("ParenthesizedExpression");
                parenthes.expression = parenthes.createCalleeNode(this.createFunctionNode((ctx)=>{
                    this.parent = ctx;
                    ctx.body.push( this );
                    const stat = ctx.createNode('ReturnStatement');
                    stat.argument = stat.createIdentifierNode( module.id  );
                    ctx.body.push(stat);
                }));
                return this.createDeclarationNode('const',[
                    this.createDeclaratorNode( module.id,  parenthes)
                ]);
            }
        }else{
            body.push( this.createExportDeclaration(module.id) );
        }

        this.body = [
            this.makeTemplateNode(),
            this.createScriptNode(body)
        ]
        return this;
    }

    checkV3ConstructMethod(initBody=[]){
        const module = this.module;
        const Component = this.builder.getGlobalModuleById('web.components.Component');
        this.addDepend( Component );
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
        return this.construct;
    }

    createMakeVueComponentNode( ...args ){
        const module = this.module;
        const Component = this.builder.getGlobalModuleById('web.components.Component');
        return this.createCalleeNode(
            this.createMemberNode([
                this.createIdentifierNode( this.getModuleReferenceName(Component, module) ),
                this.createIdentifierNode('createComponent')
            ]),
            args.filter(item=>!!item)
        )
    }

    createDefineVueComponentNode( ...args ){
        const module = this.module;
        const Component = this.builder.getGlobalModuleById('web.components.Component');
        return this.createCalleeNode(
            this.createMemberNode([
                this.createIdentifierNode( this.getModuleReferenceName(Component, module) ),
                this.createIdentifierNode('defineComponent')
            ]),
            args.filter(item=>!!item)
        )
    }

    createImportVueContextReferenceNode(){
        const target = this.module || this.compilation;
        let context = this.useVueContext.get(target);
        if( !context || !(context.size > 0) )return;
        const source = 'vue';
        this.builder.addImportReference( 
            this.module, 
            source,
            this.createImportDeclaration( 
                this.builder.getSourceFileMappingFolder(source,true),
                Array.from( context.entries() ).map( item=>{
                    return [item[1],item[0]]
                })
            )
        );
    }

    getVueImportContext(name){
        const target = this.module || this.compilation;
        let context = this.useVueContext.get(target);
        if( !context ){
            this.useVueContext.set( target, context = new Map());
        }
        if( context.has(name) ){
            return context.get(name);
        }
        const value = this.checkRefsName(name, true, Core.Token.SCOPE_REFS_All, null, false);
        context.set(name, value);
        return value;
    }

    createVueCallApiMethodNode( methodName, ...args){
        return this.createCalleeNode(
            this.createIdentifierNode( this.getVueImportContext(methodName) ),
            args
        );
    }

    createRawClassBody(){
        
        const stack = this.stack;
        const module = this.module;
        this.id = this.createToken( stack.id );
        if(module.inherit){
            this.addDepend(module.inherit);
        }
        if( this.isActiveForModule(module.inherit) ){
            this.inherit = module.inherit;
        }
        this.implements = module.implements.filter( impModule=>{
            if( !impModule.isDeclaratorModule && impModule.isInterface ){
                this.addDepend(impModule);
                return this.isActiveForModule(impModule, module);
            }
            return false;
        });

        if( this.compilation.JSX ){
            this.compilation.stack.scripts.forEach( item=>{
                if( item.isJSXScript && item.isScriptProgram ){
                    this.createRawClassMemebers(item);
                }
            });
        }else{
            this.createRawClassMemebers(stack);
        }

        const iteratorType = stack.compilation.getGlobalTypeById("Iterator");
        if( module.implements.includes(iteratorType) ){
            const method = this.createMethodNode( 'Symbol.iterator', (ctx)=>{
                const obj = ctx.createNode('ReturnStatement'); 
                obj.argument = obj.createThisNode();
                ctx.body.push( obj );
            });
            method.static = false;
            method.modifier = 'public';
            method.kind = 'method';
            method.key.computed = true;
            method.isMethod = true;
            this.members.push( method );
        }

        return this;
    }

    createRawClassMemebers(stack){
        const accessor = {};
        stack.body.forEach( item=> {
            const child = this.createRawClassMemeberNode(item);
            if(!child)return;
            const isStatic = !!(stack.static || child.static);
            const refs  = isStatic ? this.methods : this.members;
            this.createAnnotations(child, item, isStatic);
            if( item.isPropertyDefinition ){
                if( !child.init ){
                    child.init = child.createLiteralNode('');
                }
                if(!(child.provider || child.injector)){
                    this.dataProperties.push(child)
                }
            }else if(item.isConstructor && item.isMethodDefinition){
                this.construct = child;
            }
            else if( item.isMethodSetterDefinition){

                if( child.injector ){
                    child.type = 'MethodDefinition';
                    child.isMethod = true;
                    this.watchProperties.push(child)
                }else{
                    const key = item.key.value();
                    accessor[key] =  (accessor[key] || {});
                    accessor[key].set = {child, item, kind:'set'};
                    if(child.modifier == "public" && child.type==="MethodSetterDefinition"){
                        //is props property
                        accessor[key].isProp=true;
                    }
                }

            }else if( item.isMethodGetterDefinition ){
                const key = item.key.value();
                accessor[key] =  (accessor[key] || {});
                accessor[key].get = {child, item, kind:'get'};
            }
            else{
                child.isMethod = !!item.isMethodDefinition;
                if( LifecycleMaps[item.key.value()]===true ){
                    this.lifecycleMethods.push( child );
                }else{
                    refs.push( child );
                }
            }
        });

        Object.keys(accessor).forEach( key=>{
            const obj = accessor[key];
            if( !obj.isProp ){
                const properties = [obj.set, obj.get].filter( item=>!!item ).map( item=>{
                    item.child.type = 'FunctionExpression';
                    return this.createPropertyNode(item.kind, item.child);
                });
                if( properties.length > 0 ){
                    this.computedProperties.push(
                        this.createPropertyNode(
                            key,
                            this.createObjectNode(properties)
                        )
                    );
                }
            }
        });

    }

    createInjectPropertyNode(name,from,value){
        let injectValueProperties = [];
        if( value ){
            injectValueProperties.push(
                this.createPropertyNode('default', value instanceof Core.Token ? value : this.createLiteralNode(value) )
            );
        }else{
            injectValueProperties.push(
                this.createPropertyNode('default', this.createLiteralNode(null) )
            );
        }
        if( from && from !== name ){
            injectValueProperties.push(
                this.createPropertyNode('from', this.createLiteralNode(from) )
            );
        }
        return this.createPropertyNode(name, this.createObjectNode(injectValueProperties) )
    }

    createAddProviderNode(key, name, isMethod){
        if( isMethod ){
            return this.createPropertyNode(key, this.createCalleeNode( 
                this.createMemberNode([
                    this.createThisNode(),
                    this.createIdentifierNode(name)
                ])
            ));
        }else{
            return this.createPropertyNode(key, this.createMemberNode([
                this.createThisNode(),
                this.createIdentifierNode(name)
            ]));
        }
    }

    createRawComponentProps(node, stack){

        if(node.modifier !== "public" || !(node.type==="PropertyDefinition" || node.type==="MethodSetterDefinition") )return false;
        if( stack.isMethodSetterDefinition || stack.isPropertyDefinition ){
            const annotations = stack.annotations;
            const injector = annotations && annotations.find( annotation=>annotation.name.toLowerCase() ==='injector' );
            if( injector ){
               return false;
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
            node.type='MethodDefinition';
            node.isMethod = true;
            this.watchProperties.push(node)
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

        this.propProperties.push(this.createPropertyNode(
            propName, 
            this.createObjectNode(properties)
        ));
        return true;
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

        this.propProperties.push(this.createPropertyNode(
            propName, 
            this.createObjectNode(properties)
        ));
    }

    createHMRHotAcceptNode(){
        return null;
    }

    createHMRDependency(initBody){
        return null;
    }

    createCreateVueComponentOptionsNode(name){
        const ops = super.createCreateVueComponentOptionsNode(name);
        const value = this.createComponentsOptionNode();
        if( value ){
            ops.properties.push(value)
        }
        if( this.templates.length > 0 ){
            ops.properties.push(
                this.createPropertyNode( this.createIdentifierNode('hasTemplate'), this.createLiteralNode(true) )
            );
        }
        return ops;
    }

    createComponentsOptionNode(){
        const dependencies = this.builder.getDependencies(this.module);
        if( dependencies.length > 0 ){
            const components = new Set();
            const Component = this.builder.getGlobalModuleById('web.components.Component');
            dependencies.forEach( dep=>{
                if( Component !== dep && this.stack.isModuleForWebComponent(dep) ){
                    components.add(dep)
                }
            });
            if( components.size > 0 ){
                const properties = []
                components.forEach( com=>{
                    const name = this.getModuleReferenceName(com)
                    properties.push(
                        this.createPropertyNode( this.createLiteralNode(name), this.createIdentifierNode(name) )
                    )
                    
                });
                return this.createPropertyNode( this.createIdentifierNode('components'), this.createObjectNode(properties) )
            }
        }
        return null;
    }

    createRawClassMemeberNode(memeberStack){
        const templateLen = this.templates.length;
        var child = this.createToken(memeberStack);
        if( !child.static ){  
            if( child.modifier === "public" ){
                if( child.type==="PropertyDefinition" || child.type ==="MethodSetterDefinition"){
                    if( this.createRawComponentProps(child, memeberStack) ){
                        return null;
                    }
                }
            }else if( child.type==="PropertyDefinition" ){
                const node = this.createPropertyNode(
                    child.key, 
                    child.init || this.createLiteralNode(null)
                );
                this.dataProperties.push(node);
                return null;
            }
            if( this.templates.length != templateLen ){
                return this.renderMethodToTemplateNode(child, memeberStack, true);
            }else if(memeberStack && memeberStack.isMethodDefinition && !memeberStack.isAccessor && memeberStack.key.value() ==='render'){
                child.isMethod = true;
                this.renderMethod = child;
                return null
            }
        }
        return child;
    }

    renderMethodToTemplateNode(node, stack, isRaw=false){
        if( stack && stack.isMethodDefinition && !stack.isAccessor && stack.key.value() ==='render' ){
            const fnScope = stack.expression.scope;
            const declares = stack.expression.body.body.filter( item=>{
                return item.isVariableDeclaration
            });
            const hasMultiple = fnScope.returnItems.length > 1;
            if( !hasMultiple && !declares.length ){
                return null;
            }
            node.params = [];
            if( isRaw ){

                node.type = 'FunctionExpression';
                const callNode = hasMultiple ? this.createFunctionNode((ctx)=>{
                    const left = ctx.createMemberNode([ctx.createThisNode(), ctx.createIdentifierNode('__$$TEMPLATE_VALUE')]);
                    const right = ctx.createCalleeNode(
                        ctx.createMemberNode([
                            ctx.createParenthesNode(node), ctx.createIdentifierNode('call')
                        ]), 
                        [ctx.createThisNode()]
                    );
                    const assign = ctx.createAssignmentNode(left, right)
                    ctx.body.push( ctx.createStatementNode(assign) );
                }) : node

                this.beforeUpdateInvokes.push(callNode);

            }else{
                node.type = 'ArrowFunctionExpression';
                const callNode =this.createCalleeNode( 
                    this.createParenthesNode(
                        this.createArrowFunNode(
                            (ctx, body)=>{
                                const object = ctx.createMemberNode([ctx.createThisNode(), ctx.createIdentifierNode('addEventListener')]);
                                const ComponentEvent = this.builder.getGlobalModuleById('web.events.ComponentEvent');
                                this.addDepend(ComponentEvent);
                                const callNode = this.createCalleeNode(object, [
                                    this.createMemberNode([
                                        this.createIdentifierNode( this.getModuleReferenceName(ComponentEvent, this.module) ),
                                        this.createIdentifierNode('BEFORE_UPDATE')
                                    ]),
                                    this.createArrowFunNode((ctx,body)=>{
                                        if( hasMultiple ){
                                            const left = ctx.createMemberNode([ctx.createThisNode(), ctx.createIdentifierNode('__$$TEMPLATE_VALUE')]);
                                            const right = ctx.createCalleeNode( ctx.createIdentifierNode('render') )
                                            const assign = ctx.createAssignmentNode(left, right)
                                            body.push( ctx.createStatementNode(assign) );
                                        }else{
                                            body.push( ctx.createStatementNode(ctx.createCalleeNode( ctx.createIdentifierNode('render') )) );
                                        }
                                    })
                                ]);
                                body.push(this.createStatementNode(callNode));
                            },
                            [this.createIdentifierNode('render')]
                        )
                    ),
                    [node]
                );
                this.beforeUpdateInvokes.push( this.createStatementNode(callNode) );
            }
            return null;
        }
        return node;
    }

    createArrowFunNode(callback, params=[]){
        const fn = this.createArrowFunctionNode(params);
        fn.body = fn.createNode('BlockStatement');
        fn.body.body=[];
        callback(fn.body, fn.body.body);
        return fn;
    }

    createPrivateAndThisRef(){
        const items = [];

        // const object = this.createMemberNode([
        //     this.createThisNode(),
        //     this.createIdentifierNode( '__$$THIS' )
        // ]);
        // const value = this.createThisNode();
        // items.push( this.createStatementNode(this.createAssignmentNode(object, value) ) );


        if( this.privateName ){
            const pObject = this.createMemberNode([
                this.createThisNode(),
                this.createIdentifierNode( this.privateName )
            ]);
            const pValue = this.createIdentifierNode( this.privateName )
            items.push( this.createStatementNode( this.createAssignmentNode(pObject, pValue) ) );
        }
        items.push( ...this.renders );
        return items;
    }
    
}
module.exports = VueBuilder;
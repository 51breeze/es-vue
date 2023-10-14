const JSXClassBuilder = require('../JSXClassBuilder');
const Core = require('../Core');
const Utils = require('../Utils');
const path = require('path');
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
        this.directiveComponents = new Map();
        this.dependenciesComponents = new Set();
        this.annotationUrlProperties = {};
        this.exposeGlobalRefs = new Set();
    }

    create(){
        if( !this.checkSyntaxPresetForClass() ){
            return null;
        }
        return this.createStart();
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
        this.createImportVueContextReferenceNode();

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
        body.push( this.createStatementMember(this.checkRefsName('methods'), this.methods ) );
        body.push( this.createStatementMember(this.checkRefsName('members'), this.members ) );
        body.push( this.createClassDescriptor() );
        body.push( ...this.afterBody.splice(0, this.afterBody.length) );

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
            ...this.makeStyleNode(),
            this.createScriptNode( body.splice(0, body.length) )
        ]
        return this;
    }

    createConstructInitPrivateNode(block, appendAt){
        const keys = Object.keys(this.annotationUrlProperties);
        if( keys.length > 0 ){
            const properties = [];
            keys.forEach( key=>{
                properties.push(
                    this.createPropertyNode(key, this.createIdentifierNode(this.annotationUrlProperties[key]))
                );
            })
            this.privateProperties.push( ...properties );
        }
        super.createConstructInitPrivateNode(block, appendAt);
    }

    checkConstructMethod(){

        const module = this.module;
        const componentsNode = this.createVueUsingDependenceComponentsNode();
        const propsOptions = this.propProperties.length > 0 ? this.createPropertyNode('props',this.createObjectNode( this.propProperties ) ) : null;
        const instaneName =  this.builder.genMembersName(this.module,'esInstance',this.module);
        const privateName = this.privateName ? this.createPropertyNode('esPrivateKey', this.createLiteralNode(this.privateName) ) : null;
        const directiveComponents = this.createDirectiveComponents();
        const exposeGlobalRefs = this.createExposeGlobalRefs();
        const properties = [
            this.createPropertyNode(this.createIdentifierNode('name'), this.createLiteralNode(`es-${module.id}`) ),
            this.createPropertyNode('hasTemplate', this.createLiteralNode( this.templates.length > 0 ) ),
            this.createPropertyNode('esHandle', this.createLiteralNode(instaneName) ),
            privateName,
            propsOptions,
            componentsNode,
            directiveComponents,
            exposeGlobalRefs
        ].filter( item=>!!item );

        const opts =  this.plugin.options;
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

        this.vueComponentOptionProperties = properties;
        super.checkConstructMethod();
    }

    createCreateVueComponentOptionsNode(name){
        return this.createObjectNode( this.vueComponentOptionProperties || [] )
    }

    // createHMRHotAcceptNode(){
    //     return null;
    // }

    // createHMRDependency(initBody){
    //     return null;
    // }

    createClassMemeberNode(memeberStack, classStack){
        const templateLen = this.templates.length;
        const node = super.createClassMemeberNode(memeberStack, classStack);
        if( this.templates.length != templateLen ){
            return this.renderMethodToTemplateNode(node, memeberStack);
        }
        return node;
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

    makeStyleNode(){
        const styles = this.compilation.jsxStyles;
        if( styles && styles.length > 0){
            return styles.map( style=>{
                if( !style.absoluteFile ){
                    const node = this.createNode('JSXText')
                    node.value = style.value();
                    const attributes = style.openingElement.attributes.map( attr=>{
                        let value = attr.value && attr.value.isJSXExpressionContainer ? attr.value.expression : attr.value;
                        value = value && value.isLiteral ? this.createIdentifierNode(value.value()) : this.createToken(value);
                        let name = attr.name.value();
                        if( name ==='type' )name = 'lang';
                        return this.createAttrNode(this, this.createIdentifierNode(name, attr.name), value )
                    });
                    return this.createStyleNode([node], attributes);
                }
            }).filter( v=>!!v );
        }
        return [];
    }

    makeTemplateNode(){
        if( this.templates.length > 0 ){
            if( this.templates.length > 1 ){
                const children = this.templates.map( (template,index)=>{
                    const templateNode = template[0];
                    const templateValue = template[1];
                    const refName = this.builder.genMembersName(this.module, 'esTemplateValue', this.module);
                    const enablePrivateChain = this.plugin.options.enablePrivateChain;
                    let object = null;
                    if(enablePrivateChain){
                        object = this.createMemberNode([
                            Utils.createThisNode(this, this.stack, true), 
                            this.checkRefsName(Core.Constant.REFS_DECLARE_PRIVATE_NAME)
                        ]);
                        object.computed = true;
                    }else{
                        object = Utils.createThisNode(this, this.stack, true);
                    }

                    const node = templateNode.createNode('BinaryExpression')
                    node.left = node.createMemberNode([object, node.createIdentifierNode(refName)]);
                    node.right = node.createLiteralNode( templateValue );
                    node.operator = '==';
                    return this.createTemplateNode([templateNode], [
                        this.createAttrNode(templateNode, templateNode.createIdentifierNode( index==0 ? 'v-if' : 'v-else-if'), node )
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

    checkV3ConstructMethod(initBody=[]){
        const module = this.module;
        this.createHMRDependency(initBody);
        initBody.push( ...this.provideProperties );
        initBody.push( ...this.injectProperties );
        initBody.push( ...this.beforeUpdateInvokes );
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

        const options = this.createObjectNode(this.vueComponentOptionProperties);
        const args = [this.createIdentifierNode(module.id), options];
        if( this.builder.isApplication(this.module) ){
            this.exportVueComponentNameRefNode = this.createCreateVueComponentNode('defineComponent', args);
        }else{
            this.exportVueComponentNameRefNode = this.createCreateVueComponentNode('createComponent',args);
        }
        return this.construct;
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

    createExposeGlobalRefs(){
        const exposes = this.plugin.options.exposes;
        const globals = exposes.globals || [];
        const exposeFilter = exposes.exposeFilter;
        const hasFilter = typeof exposeFilter === 'function';
        const exposeGlobalRefs = Array.from( this.exposeGlobalRefs.values() ).filter( name=>{
            if( globals.includes(name) )return false;
            return hasFilter ? exposeFilter(name, this.module||this.compilation) : true;
        }).map( name=>{
            return this.createPropertyNode(
                this.createIdentifierNode(name),
                this.createIdentifierNode(name)
            )
        })
        if( exposeGlobalRefs.length>0 ){
            return this.createPropertyNode('exposes',this.createObjectNode( exposeGlobalRefs ));
        }
        return null;
    }

    createDirectiveComponents(){
        const properties = [];
        this.directiveComponents.forEach( (config)=>{
            const {name,module,directive,isModuleDirective} = config;
            let resolveDirective = directive;
            if(!directive && isModuleDirective){
                const newNode = this.createNode('NewExpression');
                newNode.callee = this.createIdentifierNode(this.getModuleReferenceName(module)) 
                resolveDirective = newNode;
            }
            if( !resolveDirective ){
                resolveDirective = this.createIdentifierNode(this.getModuleReferenceName(module))
            }
            properties.push(
                this.createPropertyNode(
                    this.createLiteralNode(name),
                    resolveDirective
                )
            );
        });
        if( properties.length>0 ){
            return this.createPropertyNode('directives',this.createObjectNode( properties ));
        }
        return null;
    }

    createVueUsingDependenceComponentsNode(flag=false){
        const module = this.module;
        const dependencies = this.builder.getDependencies(module);
        if( dependencies.length > 0 ){
            const ops = this.builder.getRawOptions();
            const resolve = ops && ops.component && ops.component.resolve ? ops.component.resolve : (name)=>name;
            const deps = this.dependenciesComponents;
            const Component = this.builder.getGlobalModuleById('web.components.Component');
            dependencies.forEach( dep=>{
                if(this.builder.isUsed(dep,module)){
                    if( dep.isReferenceLocalComponent ){
                        deps.add(dep)
                    }else if( Component !== dep && this.stack.isModuleForWebComponent(dep) ){
                        deps.add(dep)
                    }
                }
            });
            if( deps.size > 0 ){
                const properties = []
                deps.forEach( com=>{
                    if( com.isReferenceLocalComponent ){
                        properties.push(
                            this.createPropertyNode( this.createLiteralNode( resolve(com.name, com, this.stack) ), this.createIdentifierNode(com.from) )
                        )
                    }else{
                        const name = this.getModuleReferenceName(com)
                        properties.push(
                            this.createPropertyNode( this.createLiteralNode( resolve(name, com, this.stack) ), this.createIdentifierNode(name) )
                        )
                    }
                });
                if( flag === true ){
                    return this.createObjectNode(properties);
                }
                return this.createPropertyNode( this.createIdentifierNode('components'), this.createObjectNode(properties) )
            }
        }
        return null;
    }

    renderMethodToTemplateNode(node, stack){
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
            node.type = 'ArrowFunctionExpression';
            const object = this.createMemberNode([this.createThisNode(), this.createIdentifierNode('invokeHook')]);
           
            const callNode = this.createCalleeNode(object, [
                this.createLiteralNode('component:beforeRender'),
                hasMultiple ?
                this.createArrowFunNode((ctx,body)=>{
                    const refName = ctx.builder.genMembersName(this.module, 'esTemplateValue', this.module);
                    const enablePrivateChain = this.plugin.options.enablePrivateChain;
                    let object = null;
                    if(enablePrivateChain){
                        object = ctx.createMemberNode([
                            ctx.createThisNode(), 
                            ctx.checkRefsName(Core.Constant.REFS_DECLARE_PRIVATE_NAME)
                        ]);
                        object.computed = true;
                    }else{
                        object = ctx.createThisNode();
                    }
                    const left = ctx.createMemberNode([object, ctx.createIdentifierNode(refName)]);
                    const right = ctx.createCalleeNode( ctx.createParenthesNode(node) )
                    const assign = ctx.createAssignmentNode(left, right)
                    this.cratePrivatePropertyNodeOf(refName, ctx.createLiteralNode(null))
                    body.push( ctx.createStatementNode(assign) );
                }) : node
            ]);

            this.beforeUpdateInvokes.push( this.createStatementNode( callNode ) );
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

    createStyleNode( children, attributes ){
        const node = this.createNode('JSXElement')
        node.openingElement = node.createNode('JSXOpeningElement')
        node.openingElement.attributes = attributes || [];
        node.openingElement.name = node.createIdentifierNode('style');
        node.closingElement = node.createNode('JSXClosingElement')
        node.closingElement.name = node.createIdentifierNode('style');
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
    
}
module.exports = VueBuilder;
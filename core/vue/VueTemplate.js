const JSXTransform = require('../JSXTransform');
const SkinClass = require('../SkinClass');
const VueBuilder = require('./VueBuilder');
const {normalizePropertyKey, createThisNode} = require('../Utils');

const singleTags = ['img','area','base','br','col','colgroup','command','embed','hr','input','link','meta','param','source','track','wbr']

class VueTemplate extends JSXTransform{
    constructor(stack, ctx){
        super(stack,ctx);
        this.isVueTemplate = true;
        this.templateRefMethods = [];
        this.vueBuilder = null;
    }

    getVueBuiler(){
        let vueBuilder = this.vueBuilder;
        if(vueBuilder)return vueBuilder;
        return this.vueBuilder = this.getParentByType( (parent)=>{
            if( parent.isVueBuilder ){
                return true;
            }
        });
    }

    createClassNode(stack, childNodes){
        if( stack.jsxRootElement.isSkinComponent ){
            const obj = new SkinClass(stack,this,'ClassDeclaration');
            return obj.create();
        }else{
            const obj = new VueBuilder(stack, this, 'ClassDeclaration');
            obj.templates.push( [childNodes, 1] );
            obj.templateRefMethods.push( ...this.templateRefMethods );
            return obj.create();
        }
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

    createAttrNode(ctx, name, value){
        const node = ctx.createNode('JSXAttribute')
        node.name = name
        node.value = value
        if(name)name.parent = node;
        if(value)value.parent = node;
        return node;
    }

    makeAttributeValue(ctx, attribute, ns){
        if( attribute.value ){
            if( attribute.value.isLiteral ){
                if( attribute.jsxElement.isDirective ){
                    return ctx.createToken( attribute.parserAttributeValueStack() );
                } 
                if( ns ==='v-bind'){
                    return ctx.createToken(attribute.value);
                }
                return ctx.createIdentifierNode(attribute.value.value(), attribute.value);
            }else if( attribute.value.isJSXExpressionContainer ){
                const expression = attribute.value.expression;
                if(ns==='v-on'){
                    if( !expression.isFunctionExpression ){
                        if( expression.isCallExpression ){
                            const flag = expression.callee.isMemberExpression && expression.callee.property.value() === 'bind' &&
                                        expression.arguments.length > 0 && expression.arguments[0].isThisExpression;                     
                            if(flag){
                                const args = expression.arguments.slice(1).map( item=>ctx.createToken(item) );
                                return this.createCalleeNode( 
                                    ctx.createToken( expression.callee.object ), 
                                    [
                                        ...args,
                                        this.createIdentifierNode('$event')
                                    ]
                                )
                            }else{
                                const node = ctx.createToken( expression );
                                if(node && node.type==="CallExpression"){
                                    node.arguments.push(this.createIdentifierNode('$event'))
                                }
                                return node;
                            }
                        }else if(expression.isMemberExpression || expression.isIdentifier){
                            const node = ctx.createToken( expression );
                            const rest = ctx.createNode('RestElement')
                            rest.value = 'args';
                            return this.createArrowFunctionNode([rest], this.createCalleeNode(node, [rest]))
                        }
                    }
                }else if(expression.isMemberExpression || expression.isIdentifier ){
                    const desc = expression.description();
                    const isMethod = desc && (desc.isMethodDefinition && !desc.isAccessor);
                    if( isMethod ){
                        const node = ctx.createToken( expression );
                        if( node && node.type === 'MemberExpression'){
                            return this.createCalleeNode( 
                                this.createMemberNode([node, this.createIdentifierNode('bind')]), 
                                [
                                    createThisNode(node,attribute)
                                ]
                            )
                        }
                        return node;
                    }
                }
                return ctx.createToken( expression );

            }else{
                return ctx.createToken( attribute.value );
            }
        }
        return null;
    }

    makeDirectiveAttributes(ctx, name, attributes, stack){
        if( name ==='if' || name==='elseif' || name==='show'){
            return attributes.map( attr=>{
                let key = attr.name.value();
                let value = this.makeAttributeValue(ctx, attr, name);
                if( attr.name.value() ==='condition' ){
                    if( name==='show'){
                        key = 'v-show';
                    }else{
                        key = name ==='elseif' ? 'v-else-if' : 'v-if';
                    }
                }
                return this.createAttrNode(ctx, this.createIdentifierNode(key),  value );
            });
        }else if( name==='for' || name==='each' ){
            let refs = attributes.find( attr=>attr.name.value() ==='name' );
            let item = attributes.find( attr=>attr.name.value() ==='item' );
            let key = attributes.find( attr=>attr.name.value() ==='key' );
            if(refs && item){
                refs = this.makeAttributeValue(ctx, refs);
                item = this.makeAttributeValue(ctx, item);
                if(key){
                    key = this.makeAttributeValue(ctx, key);
                }else{
                    key = this.createIdentifierNode('key');
                }
                const binary = ctx.createNode('BinaryExpression');
                binary.operator = 'in';
                binary.left = item
                binary.right = refs
                if( key ){
                    binary.left = binary.createParenthesNode( binary.createSequenceNode([item, key]) )
                }
                return [
                    this.createAttrNode(binary,
                        binary.createIdentifierNode('v-for'),
                        binary
                    )
                ];
            }
        }

        return [];
    }

    makeAttributeName(ctx,stack){
          
        let name = null;
        if( stack.isMemberProperty ){
            const eleClass = stack.jsxElement.getSubClassDescription();
            const propsDesc = stack.getAttributeDescription( eleClass );
            const resolveName = ctx.builder.getClassMemberName( propsDesc );
            if( resolveName ){
                name = resolveName.includes('-') ? resolveName : resolveName;
            }
            const invoke = ctx.builder.getClassMemberHook( propsDesc );
            if( invoke ){
                const [invokeType,] = invoke;
                const systemModule = ctx.builder.getGlobalModuleById('System');
                ctx.addDepend( systemModule );
                value = ctx.createCalleeNode( 
                    ctx.createMemberNode([
                        ctx.createIdentifierNode( ctx.getModuleReferenceName( systemModule ) ),
                        ctx.createIdentifierNode('invokeHook')
                    ]),
                    [
                        ctx.createLiteralNode(invokeType),
                        value,
                        ctx.createLiteralNode( stack.name.value() ),
                        ctx.createLiteralNode( propsDesc.module.getName() )
                    ]
                );
            }
        }
    
        if( !name ){
            name = ctx.createToken( stack.name );
        }
        return name;
    }

    resolveDirectiveAttribute(stack){
        let directive = null;
        let direName = null;
        let expression = null;
        let direObject = null;
        let direModule = null;
        let modifier = null;
        let isModuleDirective = false;
        let hasStaticGetDirectiveMethod = false;
        let value = stack.value;
        if( value.isJSXExpressionContainer ){
            value = value.expression;
        }
        if(value){
            if( value.isLiteral ){
                direName = value.value();
            }else{
                const result = this.extractObjectDirectiveProperties(value);
                if( result ){
                    const {name} = result;
                    if( name ){
                        directive = this.getComponentDirectiveForDefine( name );
                        if( directive ){
                            let [_direModule, _direName, _, _isInterface, _hasStaticGetDirectiveMethod] = directive;
                            direModule = _direModule;
                            direName = _direName;
                            isModuleDirective = _isInterface;
                            hasStaticGetDirectiveMethod = _hasStaticGetDirectiveMethod;
                        }
                        const desc = name.description();
                        if( desc && (desc.isMethodDefinition || desc.isPropertyDefinition)){
                            direObject = this.createToken(name);
                        }
                    }
                    modifier = result.modifier;
                    expression = result.value;
                }else{
                    const range = stack.compilation.getRangeByNode( attr.name.node );
                    console.error(`Custom directives must is literal-object and must have property 'name' or 'value' must is required. \r\n at ${stack.file}(${range.end.line}:${range.end.column})`);
                }
            }
        }else{
            const range = stack.compilation.getRangeByNode( attr.name.node );
            console.warn(`No named value directives was specified.\r\n at ${stack.file}(${range.end.line}:${range.end.column})`);
        }
        
        if( direName ){

            if(!direObject && hasStaticGetDirectiveMethod ){
                direObject = this.createMemberNode([
                    this.getModuleReferenceName(direModule), 
                    this.createIdentifierNode('directive')
                ]);
            }

            if( direModule ){
                const vueBuilder = this.getVueBuiler();
                if(vueBuilder){
                    vueBuilder.directiveComponents.set(direModule,{name:direName,directive:direObject,module:direModule,isModuleDirective});
                }
            }
            const direNode = this.createIdentifierNode( 'v-'+direName+(modifier?'.'+modifier:'') );  
            if(expression){
                return this.createAttrNode(this, direNode, this.createToken(expression) )
            }
            return this.createAttrNode(this, direNode);
        }
        return null;
    }

    makeAttribute(ctx, stack, defaultValue=null, isExpressionFlag=false, appendObject={}){
        
        if( stack.isAttributeXmlns)return null;
        if(stack.isJSXSpreadAttribute){
            return ctx.createToken(stack);
        }

        const node = ctx.createNode( stack );
        let prefix = '';

        let eleClass = null;
        let propsDesc = null;
        let resolveName = null;
        let resolveValue = null;
        let customName = null;
        if( stack.isMemberProperty ){
            eleClass = stack.jsxElement.getSubClassDescription();
            propsDesc = stack.getAttributeDescription( eleClass );
            resolveName = ctx.builder.getClassMemberName( propsDesc );
            resolveValue = ctx.createJSXAttrHookInvokeNode(stack, node, propsDesc);
        }

        let ns = null;
        if( stack.hasNamespaced ){
            const xmlns = stack.getXmlNamespace();
            if( xmlns ){
                ns = xmlns.value.value();
            }else {
                const nsStack = stack.getNamespaceStack();
                const ops = stack.compiler.options;
                ns = ops.jsx.xmlns.default[ nsStack.namespace.value() ] || ns;
            }
        }

        let directive = '';
        if( stack.isAttributeDirective ){
            directive = stack.name.value().toLowerCase();
            if(directive==='each')directive = 'for';
            node.name = node.createIdentifierNode(directive ==='elseif' ? 'v-else-if' : 'v-'+directive, stack.name)

            const valueArgument = stack.valueArgument;
            if( directive ==='for' ){
                if( valueArgument ){
                    let refs = node.createToken(valueArgument.expression);
                    let item = valueArgument.declare.item;
                    let key = valueArgument.declare.key;
                    let index = valueArgument.declare.index;

                    if(!(key || index))key = 'key';

                    const items = [item, key, index].filter( item=>!!item ).map( item=>node.createIdentifierNode(item) )
                    const left = items.length > 1 ? node.createParenthesNode(  node.createSequenceNode(items) ) : node.createIdentifierNode(item);
                    const binary = ctx.createNode('BinaryExpression');
                    binary.operator = 'in';
                    binary.left = left
                    binary.right = refs
                    resolveValue = binary;
                }
            }else if( directive ==="custom" ){
                if(stack.value){
                    return this.resolveDirectiveAttribute(stack);
                }
            }else{
                if( valueArgument && valueArgument.expression){
                    resolveValue = node.createToken(valueArgument.expression)
                }
            }
            
        }else{
            let ns = null;
            if( stack.hasNamespaced ){
                const xmlns = stack.getXmlNamespace();
                if( xmlns ){
                    ns = xmlns.value.value();
                }else {
                    const nsStack = stack.getNamespaceStack();
                    const ops = stack.compiler.options;
                    ns = ops.jsx.xmlns.default[ nsStack.namespace.value() ] || ns;
                }
            }

            if( ns && ns.includes('::') ){
                let [seg, className] = ns.split('::',2);
                ns = seg;
                const moduleType = stack.getModuleById(className);
                const moduleClass = ctx.getModuleReferenceName( moduleType );
                ctx.addDepend( moduleType );
                let key =  normalizePropertyKey( moduleType.toString() +'_'+ stack.name.value(), 'get' );
                key = this.builder.genMembersName( stack.module, key )
                const method = ctx.createMethodNode(key, (ctx)=>{
                    ctx.body = [
                        ctx.createReturnNode( ctx.createMemberNode([
                            ctx.createIdentifierNode( moduleClass ),
                            ctx.createIdentifierNode( stack.name.value() )
                        ], stack.name))
                    ]
                });
                method.static = false;
                method.modifier = 'public';
                method.kind = 'method';
                this.templateRefMethods.push( method );
                customName = node.createCalleeNode( node.createMemberNode([createThisNode(node, stack), node.createIdentifierNode(key)]) )
            }

            if( !isExpressionFlag ){
                if( ns ==='@slots'){
                    prefix = 'v-slot';
                }else if( ns ==='@events' || ns === '@natives'){
                    prefix = 'v-on';
                }else if(ns==='@binding'){
                    prefix = 'v-model';
                }else if( stack.value ){
                    if( stack.value.isLiteral && typeof stack.value.value() !== 'string'){
                        prefix = 'v-bind';
                    }else if( stack.value.isJSXExpressionContainer || resolveValue){
                        prefix = 'v-bind';
                    }
                }
            }

            if( !resolveName ){
                resolveName = stack.name.value();
            }

            if( prefix ){

                const lowerName = resolveName && resolveName.toLowerCase();
                if( prefix==='v-model' && !(lowerName==='value' || lowerName==='modelvalue') ){
                    prefix = 'v-on';
                    resolveValue = resolveValue || node.createToken(stack.value);
                    const bindValue = resolveValue;
                    if( !resolveValue || !(resolveValue.type ==='MemberExpression' || resolveValue.type ==='Identifier') ){
                        resolveValue = null;
                    }
                    if(resolveValue){
                        if(appendObject){
                            appendObject.attributes = appendObject.attributes || [];
                            appendObject.attributes.push(this.createAttrNode(node, node.createIdentifierNode(`v-bind:${resolveName}`), bindValue))
                        }
                        resolveValue = node.createArrowFunctionNode(
                            [node.createIdentifierNode('e')], 
                            node.createAssignmentNode(
                                resolveValue, 
                                node.createCalleeNode(
                                    node.createMemberNode([
                                        createThisNode(node, stack), 
                                        node.createIdentifierNode('getBindEventValue')
                                    ]),
                                    [
                                        node.createIdentifierNode('e')
                                    ]
                                )
                            )
                        );
                    }else{
                        prefix = 'v-bind';
                    }
                }

                if(prefix==='v-model'){
                    node.name = node.createIdentifierNode( prefix );
                }else{
                    if(customName){
                        node.name = node.createMemberNode([
                            node.createIdentifierNode( prefix+':', stack.name),
                            customName
                        ], stack.name);
                        node.name.computed = true;
                    }else{
                        node.name = node.createIdentifierNode( prefix+':'+resolveName );
                    }
                }

            }else{

                if( isExpressionFlag && resolveName.includes('-') ){
                    node.name = node.createLiteralNode(resolveName);
                }else{

                    if( stack.name.value() ==='innerHTML' ){
                        node.name = node.createIdentifierNode( 'v-html' );
                    }else{
                        node.name = node.createIdentifierNode(resolveName);
                    }
                }
            }
        }

        if( resolveValue ){
            node.value = resolveValue;
        }else{
            node.value = this.makeAttributeValue(node, stack, prefix) || defaultValue;
        }

        if(stack.value && node.value && stack.value.isJSXExpressionContainer){
            if( stack.value.expression.isAnnotationExpression ){
                if( node.value.type ==='CallExpression' && node.value.callee.type==="MemberExpression" && node.value.callee.object.value ==='System'){
                    node.value = node.createCalleeNode(
                        node.createMemberNode([
                            createThisNode(node, stack), node.createIdentifierNode('invokeHook')
                        ]),
                        [
                            node.createLiteralNode('System::callMethod'),
                            node.createLiteralNode(node.value.callee.property.value),
                            ...(node.value.arguments||[])
                        ]
                    );
                }
            }
        }

        if(prefix==='v-model' && appendObject && resolveName){
            appendObject.attributes = appendObject.attributes || [];
            appendObject.attributes.push(this.createAttrNode(node, node.createIdentifierNode(`v-bind:${resolveName}`), node.value))
        }

        return node;
    }

    extractObjectDirectiveProperties(stack){
        let name = null;
        let value = null;
        let modifier = null;
        if( stack && stack.isObjectExpression ){
            name = stack.attribute('name');
            value = stack.attribute('value');
            modifier = stack.attribute('modifier');
            name = name && name.init ? name.init : name;
            value = value && value.init ? value.init : value;
            modifier = modifier && modifier.init ? modifier.init : modifier;
            return {name, value, modifier};
        }else{
            return null;
        }
    }

    makeOpeningElement(ctx, stack){
        const node = ctx.createNode(stack);
        const dataset = {};
        node.attributes = stack.attributes.map( attr=>this.makeAttribute(node, attr , null, false, dataset) );
        if( dataset.attributes ){
            node.attributes.push( ...dataset.attributes )
        }
        node.selfClosing = !!stack.selfClosing;
        node.name = this.makeName(node, stack.name);
        this.injectAttributeKey(node, stack);
        return node;
    }

    isForDirective(stack){
        if(!stack)return false;
        if(stack.parentStack && stack.parentStack.isDirective){
            const openingElement = stack.parentStack.openingElement;
            const name = openingElement.name.value().toLowerCase();
            return name ==='for' || name ==='each';
        }
           
        if( stack.directives && stack.directives.length>0 ){
            return stack.directives.some( dir=>dir.name.value() === 'for' || dir.name.value()==='each') 
        }
        return false;
    }

    getNodeDepthPath(stack){
        let parentStack = stack.parentStack;
        while(parentStack){
            if(parentStack.isJSXElement || parentStack.isJSXExpressionContainer || parentStack.isMethodDefinition || parentStack.isBlockStatement || parentStack.isProgram)break;
            parentStack = parentStack.parentStack;
        }
        if( parentStack && (parentStack.isJSXElement || parentStack.isJSXExpressionContainer) ){
            const index = stack.childIndexAt;
            const prefix = this.getNodeDepthPath(parentStack);
            return prefix ? prefix+'.'+index : index;
        }
        return stack.childIndexAt;
    }

    injectAttributeKey(node, stack){
        const fillKey = this.plugin.options.fillKey;
        if( !fillKey )return false;
        if( node.attributes.some( attr=>attr && attr.type ==='JSXAttribute' && (attr.name.value === 'v-bind:key' || attr.name.value==='key') ) ){
            return true;
        }

        const fillAll = fillKey === true;
        const fillFlags = fillAll ? ['for','each','if','else'] : Array.isArray(fillKey) ? fillKey : [];
        const elStack = stack.parentStack;
        if( this.isForDirective(elStack) ){

            let allow = ['for','each'].filter( item=>fillAll || fillFlags.includes(item) );
            if( fillAll || allow.length > 0 ){
                let key;
                if( !elStack.isDirective && elStack.directives ){
                    const directive = elStack.directives.find( directive=>allow.includes(directive.name.value()) );
                    if( directive ){
                        const valueArgument = directive.valueArgument;
                        key = valueArgument.declare.index || valueArgument.declare.key;

                        
                    }
                }else if( elStack.parentStack.isDirective && allow.includes(elStack.parentStack.openingElement.name.value())){
                    const attrs = stack.parentStack.openingElement.attributes;
                    const argument = {};
                    attrs.forEach( attr=>{
                        argument[ attr.name.value() ] = attr.value.value();
                    });
                    key = argument['index'] ||  argument['key'];
                }
                
                const binary = node.createNode('BinaryExpression');
                binary.left = binary.createLiteralNode( String(this.getNodeDepthPath(elStack))+'.' );
                binary.right = binary.createIdentifierNode( key || 'key');
                binary.operator = '+';

                const attribute = node.createNode('JSXAttribute')
                attribute.name = node.createIdentifierNode('v-bind:key');
                attribute.value = binary;
                node.attributes.push( attribute );
            }

        }else{
            let hasDirective = fillAll;
            if(!hasDirective){
                let allow = ['if','else'].filter( item=>fillAll || fillFlags.includes(item) );
                !elStack.isDirective && allow.length > 0 && elStack.directives && elStack.directives.some( directive=>allow.includes(directive.name.value()) );
                if( !hasDirective && allow.length > 0 && elStack.parentStack.isDirective && allow.includes(elStack.parentStack.openingElement.name.value()) ){
                    hasDirective = true;
                }
            }
            if( hasDirective ){
                const attribute = node.createNode('JSXAttribute')
                attribute.name = node.createIdentifierNode('key');
                attribute.value = node.createIdentifierNode( this.getNodeDepthPath(elStack) );
                node.attributes.push( attribute );
            }
        }
    }

    makeClosingElement(ctx, stack){
        if(!stack)return null;
        const node = ctx.createNode( stack );
        node.name = this.makeName(node,stack.name);
        return node;
    }

    noramlComponentName(stack){
        if( stack.jsxElement.isComponent ){
            const desc = stack.jsxElement.description();
            if( desc ){
                if( desc.isDeclarator && desc.isStack ){
                    const deps = {
                        isReferenceLocalComponent:true,
                        name:stack.value(),
                        from:stack.value(),
                    };
                    let value = desc;
                    if( value.isVariableDeclarator ){
                        const _desc = desc.reference();
                        if( _desc ){
                            value = _desc
                        }
                    }

                    if(value.isAssignmentPattern && value.right){
                        value = value.right;
                    }

                    if( value.isIdentifier || value.isImportSpecifier || value.isImportDefaultSpecifier){
                        deps.from = value.value();
                    }else{
                        desc.error(11003);
                    }
                    this.getVueBuiler().dependenciesComponents.add(deps);
                    return deps.name;
                }
                const ops = this.builder.getRawOptions();
                const resolve = ops.component.resolve;
                let nameValue = stack.hasNamespaced && desc.isFragment ? desc.id : null;
                if(!nameValue && desc.isModule){
                    this.addDepend(desc)
                    nameValue = this.getModuleReferenceName(desc);
                }
                if( nameValue ){
                    if(resolve){
                        nameValue = resolve(nameValue, desc, stack.jsxElement);
                    }else if(ops.component.prefix){
                        nameValue = ops.component.prefix+nameValue;
                    }
                    return nameValue;
                }
            }
        }
        return null;
    }

    makeName(ctx, stack){
        if( !stack )return null;
        if( stack.isJSXMemberExpression){
            const node = ctx.createNode(stack,'JSXNamespacedName');
            if( stack.jsxElement.isComponent ){
                let nameValue  = this.noramlComponentName(stack)
                if( nameValue ){
                    node.name = node.createIdentifierNode(nameValue, stack);
                }
            }
            if( !node.name ){
                node.name = node.createIdentifierNode(stack.value().replace(/\./g,'_'), stack);
            }
            return node;
        }
        else if(stack.isJSXNamespacedName){
            return this.makeNamespaceNamed(ctx, stack);
        }else {
            let nameValue  = this.noramlComponentName(stack);
            if(nameValue){
                return ctx.createIdentifierNode(nameValue,stack);
            }
            return ctx.createToken(stack);
        }
    }

    makeNamespaceNamed(ctx,stack){
        const node = ctx.createNode( stack );
        const componentName = this.noramlComponentName(stack);
        node.name = componentName ? node.createIdentifierNode(componentName, stack.name) : node.createToken(stack.name);
        return node;
    }

    makeDirectiveComponentProperties(stack, data){

        if(stack.isDirective ){
            let dName = stack.openingElement.name.value();
            if( dName ==="custom" ){
                let directive = null;
                let direName = null;
                let expression = null;
                let direModule = null;
                let modifier = null;
                let properties = [];
                let isModuleDirective = false;
                let direObject = null;
                let hasStaticGetDirectiveMethod = false;
                stack.openingElement.attributes.forEach( attr=>{
                    const name = attr.name.value();
                    let lower = name.toLowerCase();
                    if( name ==='name'){
                        let value = attr.value;
                        if( value.isJSXExpressionContainer ){
                            value = value.expression;
                        }
                        if(value){
                            if( value.isLiteral ){
                                direName = value.value();
                            }else{
                                directive = this.getComponentDirectiveForDefine( value );
                                if( directive ){
                                    let [_direModule, _direName, _, _isInterface, _hasStaticGetDirectiveMethod] = directive;
                                    direModule = _direModule;
                                    direName = _direName;
                                    isModuleDirective = _isInterface;
                                    hasStaticGetDirectiveMethod = _hasStaticGetDirectiveMethod;
                                }
                                const desc = value.description();
                                if( desc && (desc.isMethodDefinition || desc.isPropertyDefinition)){
                                    direObject = this.createToken(value);
                                }
                            }
                        }else{
                            const range = stack.compilation.getRangeByNode( attr.name.node );
                            console.warn(`No named value directive was specified.\r\n at ${stack.file}(${range.end.line}:${range.end.column})`);
                        }
                    }else if( name==="value" ){
                        expression = this.makeAttribute(this, attr);
                    }else if(lower === 'modifier'){
                        if(item.value){
                            modifier = item.value.isLiteral ? item.value.value() : null;
                        }
                    }
                    else{
                        properties.push( this.makeAttribute(this,attr) );
                    }
                });

                if( direName ){
                    const direNode = this.createIdentifierNode( 'v-'+direName+(modifier?'.'+modifier:'') );  
                    if(!direObject && hasStaticGetDirectiveMethod ){
                        direObject = this.createMemberNode([
                            this.getModuleReferenceName(direModule), 
                            this.createIdentifierNode('directive')
                        ]);
                    }
                    if(expression){
                        properties = properties.filter( item=>!!item )
                        if( properties.length > 0 ){
                            return [direName, direModule, this.createAttrNode(this, direNode, expression.value), properties,  isModuleDirective, direObject];
                        }else if(expression){
                            return [direName, direModule, this.createAttrNode(this, direNode, expression.value), [], isModuleDirective, direObject];
                        }
                    }
                    return [direName, direModule, this.createAttrNode(this, direNode), [], isModuleDirective, direObject];
                }
            }
        }

        if( stack && stack.isComponent && !(stack.isSkinComponent || stack.isDirective || stack.isSlot) ){

            let parentIsComponentDirective = this.getComponentDirectiveForDefine( stack );
            if(parentIsComponentDirective){

                let expression = null;
                let modifier = null;
                let properties = [];
                let direObject = null;
                let [direModule, direName, _, isModuleDirective, hasStaticGetDirectiveMethod] = parentIsComponentDirective;
                stack.attributes.forEach( item=>{
                    let name = item.name.value();
                    let lower = name.toLowerCase();
                    if(lower === 'value'){
                        expression = this.makeAttribute(this, item);
                        return
                    }
                    if(lower === 'modifier'){
                        if(item.value){
                            modifier = item.value.isLiteral ? item.value.value() : null;
                        }
                        return;
                    }
                    properties.push( this.makeAttribute(this, item) );
                });

                if(!direObject && hasStaticGetDirectiveMethod ){
                    direObject = this.createMemberNode([
                        this.getModuleReferenceName(direModule), 
                        this.createIdentifierNode('directive')
                    ]);
                   
                }
                
                const direNode = this.createIdentifierNode( 'v-'+direName+(modifier?'.'+modifier:'') );  
                if(expression){
                    properties = properties.filter( item=>!!item )
                    if( properties.length > 0 ){
                        return [direName, direModule, this.createAttrNode(this, direNode, expression.value), properties,  isModuleDirective, direObject];
                    }else if(expression){
                        return [direName, direModule, this.createAttrNode(this, direNode, expression.value), [], isModuleDirective, direObject];
                    }
                }
                return [direName, direModule, this.createAttrNode(this, direNode), [], isModuleDirective, direObject];
            }
        }
        return false;
    }

    create(stack){

        const directiveComponentAttributes = this.makeDirectiveComponentProperties( stack );
        if( directiveComponentAttributes ){
            const [direName, directiveModule, direNode, attrs, isModuleDirective, directive] = directiveComponentAttributes;
            const children = stack.children.filter(child=>!( (child.isJSXScript && child.isScriptProgram) || child.isJSXStyle) ).map( child=>this.createToken(child) ).filter( v=>!!v );
            children.forEach( child=>{
                child.openingElement.attributes.push( direNode );
                child.openingElement.attributes.push( ...attrs );
            });
            if( directiveModule ){
                const vueBuilder = this.getVueBuiler();
                if(vueBuilder){
                    vueBuilder.directiveComponents.set(directiveModule,{name:direName,directive,module:directiveModule,isModuleDirective});
                }
            }
            if( children.length > 1 ){
                return this.createTemplateNode( children );
            }else if(children.length){
                return children[0];
            }
            return null;
        }

        let hasChildDirective = false;
        let node = this.createNode( stack );
        node.openingElement = this.makeOpeningElement(node, stack.openingElement);
        node.children = [];
        stack.children.forEach(child=>{
            if( !( (child.isJSXScript && child.isScriptProgram) || child.isJSXStyle) ){
                if( stack.isDirective && !hasChildDirective ){
                    if( child.directives && child.directives.length>0 ){
                        hasChildDirective = true;
                    }
                }
                const childNode = node.createToken(child);
                if( childNode ){
                    if( Array.isArray(childNode) ){
                        node.children.push( ...childNode );
                    }else{
                        node.children.push( childNode );
                    }
                }
            }
        });

        if( !node.openingElement.selfClosing && !(stack.isComponent || stack.isSlot || stack.isDirective) ){
            if( node.openingElement.name && node.openingElement.name.type==="Identifier" ){
                node.openingElement.selfClosing = singleTags.includes( String(node.openingElement.name.value).toLowerCase() )
            }
        }

        if(!node.openingElement.selfClosing){
            node.closingElement = this.makeClosingElement(node, stack.closingElement );
        }

        if(stack.isSlot){
            const slotName = stack.openingElement.name.value();
            const attributes = node.openingElement.attributes;
            const scope = attributes.length > 0 ? attributes.find( attr=>attr.name.value ==='scope' ) : null;
            if( !stack.isSlotDeclared && !scope && slotName ==='default' && node.children.length===1 ){
                return node.children[0];
            }
            
            if(scope || slotName !=='default'){
                const attr = node.createNode('JSXAttribute')
                if( stack.isSlotDeclared){
                    attr.name = node.createIdentifierNode('name');
                    attr.value = node.createIdentifierNode(slotName)
                }else{
                    attr.name = node.createIdentifierNode('v-slot:'+slotName);
                    if( attributes.length > 0 ){
                        node.openingElement.attributes = [];
                        if( scope ){
                            attr.value = scope.value;
                        }else{
                            attr.value = this.createObjectNode( attributes.map( attr=>{
                                return this.createPropertyNode( attr.name, attr.value)
                            }));
                        }
                    }
                }
                node.openingElement.attributes.unshift(attr)
            }

            if( stack.isSlotDeclared ){
                node.openingElement.name = node.createIdentifierNode('slot');
                if(node.closingElement){
                    node.closingElement.name = node.createIdentifierNode('slot');
                }
            }else{
                node.openingElement.name = node.createIdentifierNode('template');
                if(node.closingElement){
                    node.closingElement.name = node.createIdentifierNode('template');
                }
            }
        }else if( stack.isDirective ){
            const name = stack.openingElement.name.value().toLowerCase();
            const includes = ['if','elseif', 'else', 'for','each','show']
            if( includes.includes(name) ){

                if( !hasChildDirective && /*(name==="for" || name==="each" || name==="show") &&*/ node.children.length === 1 && node.children[0].type ==='JSXElement' ){

                    const childNode = node.children[0];
                    childNode.openingElement.attributes.unshift( ...this.makeDirectiveAttributes(this, name, stack.openingElement.attributes, stack) );
                    return childNode;

                }else{

                    if( name ==='show' ){
                        const attrs = this.makeDirectiveAttributes(this, name, stack.openingElement.attributes, stack);
                        node.children.forEach( child=>{
                            child.openingElement.attributes.push( ...attrs )
                        });
                        node.openingElement.attributes = [];
                        return node.children;
                    }

                    node.openingElement.name = node.createIdentifierNode('template');
                    if(node.closingElement){
                        node.closingElement.name = node.createIdentifierNode('template');
                    }
                    if( name !=='else'){
                        node.openingElement.attributes = this.makeDirectiveAttributes(this, name, stack.openingElement.attributes, stack)
                    }else {
                        node.openingElement.attributes.push( this.createAttrNode( node.openingElement, node.openingElement.createIdentifierNode('v-else')) )
                    }

                    if( name==="for" || name==="each" ){
                        let keyNode = null;
                        node.children.forEach( child=>{
                            if(child.type==="JSXElement"){
                                const index = child.openingElement.attributes.findIndex( attr=>{
                                    if('v-bind:key'===attr.name.value || 'key'===attr.name.value ){
                                        return true;
                                    }
                                });
                                if(index>=0){
                                    keyNode = child.openingElement.attributes.splice(index,1)
                                }
                            }
                        });
                        if( keyNode ){
                            node.openingElement.attributes.push( ...keyNode )
                        }
                    }
                }
                
            }
        }else if(stack.hasAttributeSlot){
            const attr = node.openingElement.attributes.find( attr=>attr.name.value.includes('v-slot:') );
            if( attr ){
                const index = node.openingElement.attributes.indexOf(attr);
                node.openingElement.attributes.splice(index,1);
                node = this.createTemplateNode([node], [attr]);
            }
        }

        const isRoot = stack.jsxRootElement === stack;
        if( isRoot ){
            if( stack.compilation.JSX && stack.parentStack.isProgram ){
                node = this.createClassNode(stack, node.children);
            }else if( stack.parentStack.isReturnStatement ){
                const vueBuilder = this.getVueBuiler();
                if( vueBuilder ){
                    const index = vueBuilder.templates.length+1;
                    vueBuilder.templates.push([
                        node, index
                    ]);
                    return this.createLiteralNode(index);
                }
            }
        }

        return node;
    }

}
module.exports = VueTemplate;
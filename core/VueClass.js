const Syntax = require("./Syntax");
const Core = require("./Core.js");
const Constant = Core.constant;
const Polyfill = require("./Polyfill");
class VueClass extends Syntax{
    getReserved(){
        return this._reserved || (this._reserved = this.getConfig('reserved') || []);
    }
    emitStack(item,name,isStatic,properties,modifier){
        if( !item )return null;
        if( this.getReserved().includes( name ) && this.isInheritWebComponent( item.module )){
            (item.key || item.id || item).error(1124, name);
        }
        const metaTypes = item.metatypes;
        const annotations = item.annotations;
        if( !this.checkMetaTypeSyntax(metaTypes) ){
            return null;
        }
        const value = this.make(item);
        if( value ){
            if( item.isPropertyDefinition ){
                if( !isStatic && modifier === "private"){
                    properties.push(`'${name}':${value||null}`);
                    //return null;
                }
                return value;
            }else{
                return value;
            }
        }
        return null;
    }

    buildExternal(){
        const stack = this.parentStack.parentStack || this.parentStack;
        if( stack && stack.externals.length > 0 ){
            const externals = stack.externals.map( item=>this.make(item) ).filter(item=>!!item);
            if( externals.length > 0 ){
                return [ 
                    this.semicolon('/*externals code*/'),
                    this.semicolon(`(function(){\r\n\t${externals.join("\r\n\t")}\r\n}())`)
                ].join("\r\n");
            }
        }
        return null;
    }

    emitter( render , initProperties){
        const module = this.module;
        const methods = module.methods;
        const members = module.members;
        const properties = [];
        const initialProps = initProperties && initProperties.length > 0 ? initProperties.map( item=>this.semicolon(`\t${item}`) ).join('\r\n') : [];
        const content = [];
        const imps    = this.getImps(module);
        const inherit = this.getInherit(module);
        const refs = [];
        const reserved = this.getConfig('reserved.vue') || [];
        const classScope = this.stack.scope.getScopeByType("class");
        const topRefs = new Map();
        const methodContent = [];
        const memberContent = [];
        const mainEnterMethods = [];
        const Component = this.getGlobalModuleById('web.components.Component');
        const injectProperties = [];
        let providerMethod = [];
        const injectorPush=(injector, name, value)=>{
            if( injector ){
                const injectorArgs = injector.getArguments();
                var from = name;
                if( injectorArgs.length > 0 ){
                    from = injectorArgs[0].value || from;
                }
                if( value ){
                    injectProperties.push( this.semicolon(`this.injectProperty("${name}", "${from}", ${value})`) );
                }else{
                    injectProperties.push(  this.semicolon(`this.injectProperty("${name}", "${from}")`) );
                }
            }
        }

        const providerPush=(provider, name)=>{
            if( provider ){
                providerMethod.push( this.semicolon(`this.addProvider( this.${name}.bind(this) )`) );
            }
        }

        const emitter=(target,proto,content,isStatic,descriptive)=>{
            for( var name in target ){
                const item = target[ name ];
                const modifier = item.modifier ? item.modifier.value() : 'public';
                const required = item.annotations && item.annotations.find( annotation=>annotation.name.toLowerCase() ==='required' );
                const provider = item.annotations && item.annotations.find( annotation=>annotation.name.toLowerCase() ==='provider' );
                const injector = item.annotations && item.annotations.find( annotation=>annotation.name.toLowerCase() ==='injector' );
                if( Array.isArray(reserved) && reserved.includes(name) ){
                    item.error(1124,name);
                }
                if( item.isPropertyDefinition ){
                    const value = this.emitStack(item,name,isStatic,properties,modifier);
                    let kind = item.kind ==="var" ?  Constant.DECLARE_PROPERTY_VAR : Constant.DECLARE_PROPERTY_CONST;
                    let makeValue = value;
                    let isAccessor = false;
                    if( !isStatic ){

                        if( modifier ==="public" && kind === Constant.DECLARE_PROPERTY_VAR ){
                            injectorPush( injector, name, value );
                            if( value ){
                                makeValue = {get:`function ${name}(){return this.reactive('${name}', void 0, function(){return ${value}})}`,set:`function ${name}(value){this.reactive('${name}',value)}`}
                            }else{
                                makeValue = {get:`function ${name}(){return this.reactive('${name}')}`,set:`function ${name}(value){this.reactive('${name}',value)}`}
                            }
                            isAccessor = true;
                            kind = Constant.DECLARE_PROPERTY_ACCESSOR;
                        }
                    }
                    content.push(this.definePropertyDescription(
                        proto,
                        name,
                        makeValue,
                        isAccessor,
                        modifier,
                        kind,
                        descriptive,
                        false,
                        false,
                        required
                    ));
                    
                }else if( item.isAccessor ){

                    if( item.set )injectorPush( injector, name );
                    content.push(this.definePropertyDescription(
                        proto,
                        name,
                        {
                            get:this.emitStack(item.get,name,isStatic,properties),
                            set:this.emitStack(item.set,name,isStatic,properties)
                        },
                        true,
                        modifier,
                        Constant.DECLARE_PROPERTY_ACCESSOR,
                        descriptive,
                        false,
                        false,
                        required
                    ));

                }else{
                    if(isStatic && modifier ==="public" && item.isEnterMethod && !mainEnterMethods.length ){
                        mainEnterMethods.push( this.semicolon(`${module.id}.${name}()`) )
                    }
                    providerPush( provider, name);
                    let kind = Constant.DECLARE_PROPERTY_FUN;
                    content.push(this.definePropertyDescription(
                        proto,
                        name,
                        this.emitStack(item,name,isStatic,properties),
                        false,
                        modifier,
                        kind,
                        descriptive
                    ));
                }
            }
        }

        classScope.removeAllListeners("insertTopRefsToClassBefore");
        classScope.addListener("insertTopRefsToClassBefore",(object)=>{
            topRefs.set(object.name,object.value);
        });

        if( render ){
            memberContent.push(this.definePropertyDescription(
                `members`,
                'render',
                render( this ),
                false,
                'public',
                Constant.DECLARE_PROPERTY_FUN,
                false
            ));
        }
        
        emitter( methods , 'methods', methodContent , true);
        emitter( members , `members`, memberContent , false);

        const iteratorType = this.getGlobalModuleById("Iterator")
        this.addDepend( Component );
        this.addDepend( this.getGlobalModuleById('Class') );
        
        if( module.implements.includes(iteratorType) ){
            memberContent.push(`members[Symbol.iterator]={value:function(){return this;}}`)
        }

        if( module.methodConstructor ){
            module.methodConstructor.once("fetchClassProperty",(event)=>{
                if( properties.length > 0 ){
                    event.properties = `{${properties.join(",")}}`;
                }
                if( initialProps.length > 0 ){
                    event.initialProps = initialProps.join("\r\n");
                }
            });
        }

        let construct = module.methodConstructor ? this.make(module.methodConstructor) : null;
        if( !construct && (properties.length > 0 || initialProps.length > 0 || injectProperties.length > 0 || providerMethod.length > 0 ) ){
            construct =  this.createDefaultConstructor(module, inherit, properties, initialProps);
        }

        if( construct ){
            const callParams = ['this', 'options'];
            const callConstructor = [];
            const injectAndProvide = injectProperties.concat( providerMethod );
            if( injectAndProvide.length > 0 ){
                callConstructor.push(this.semicolon(`this.addEventListener('onBeforeCreate',(function(e){${injectProperties.concat( providerMethod ).join('\r\n')}}).bind(this))`));
            }
            callConstructor.push( this.semicolon(`(${construct}).call(${callParams.join(',')})`) );
            memberContent.push(`members._init={value:function _init(options){\r\n${callConstructor.join('\r\n')}\r\n}}`)
        }

        let _methods = null;
        let _members = null;
        if( methodContent.length > 0 ){
            content.push(`var methods = {};`);
            content.push.apply(content, methodContent);
             _methods='methods';
        }

        if( memberContent.length > 0 ){
            content.push(`var members = {};`);
            content.push.apply( content, memberContent )
            _members = 'members';
        }

        this.createDependencies(module,refs);

        const _private = properties.length > 0 ? Constant.REFS_DECLARE_PRIVATE_NAME : null;
        if( _private ){
            refs.push(`var ${_private}=Symbol("private");`);
        }
        
        //alias refs
        if( topRefs.size > 0 ){
            topRefs.forEach( (value,name)=>{
                refs.push( `var ${value} = ${name};` );
            });
        }

        const createConstructor = this.semicolon(`var ${module.id} = ${this.getModuleReferenceName(Component, module)}.createComponent(${this.createOptions(module.id,inherit)})`);
        const description = this.createClassDescription(module, inherit, imps, _methods, _members, _private);
        const parts = refs.concat(content,createConstructor);
        const external = this.buildExternal();
        parts.push( this.emitCreateClassDescription( module, description) );
        parts.push( this.emitExportClass(module) );
        if( external ){
            parts.push( external );
        }
        if( mainEnterMethods.length > 0 ){
            parts.push( mainEnterMethods.join('\r\n') );
        }
        return parts.join("\r\n");
    }

    createDependencies(module, refs){
        const config = this.getConfig();
        const push = (value)=>{
            if( refs.indexOf(value) < 0 ){
                refs.push( value );
            }
        }
        this.createModuleAssets( module, refs );
        this.createModuleRequires( module, refs );
        this.getDependencies(module).forEach( depModule=>{
            if( this.isDependModule(depModule) ){
                const name = this.getModuleReferenceName(depModule, module);
                if( config.useAbsolutePathImport ){
                    const file = this.getModuleFile(depModule);
                    push( this.createImport(name, file.replace(/\\/g,'/') ) );
                }else{
                    push( this.createImport(name, this.getOutputRelativePath(depModule,module) ) );
                }
            }else if( this.isUsed(depModule) ){
                this.createModuleAssets( depModule, refs );
                this.createModuleRequires( depModule, refs );
            }
        });
    }

    isDependModule(depModule,context){
        if( this.compilation.isPolicy(2,depModule) ){
            return false;
        }
        const result = super.isDependModule(depModule,context);
        if( result ){
            return result;
        }
        const isUsed = this.isUsed(depModule);
        if( !isUsed || !depModule.isDeclaratorModule )return false;
        if( Polyfill.modules.has( depModule.getName() ) ){
            return true;
        }
        return depModule.requires && depModule.requires.has( depModule.id ) && this.isInheritWebComponent(depModule)
    }

    createClassDescription(module, inherit, imps, methods, members, _private){
        const description = [
            `'id':${Constant.DECLARE_CLASS}`,
            `'ns':'${module.namespace.toString()}'`,
            `'name':'${module.id}'`,
        ];
        if( _private ){
            description.push(`'private':${_private}`);
        }
        if( imps.length > 0 ){
            description.push(`'imps':[${imps.map(item=>this.getModuleReferenceName(item)).join(",")}]`);
        }
        if( inherit ){
            description.push(`'inherit':${this.getModuleReferenceName( inherit, module)}`);
        }
        if( methods ){
            description.push(`'methods':${methods}`);
        }
        if( members ){
            description.push(`'members':${members}`);
        }
        return description;
    }

    createDefaultConstructor(module, inherit, properties, initialProps){
        const defaultConstructor=[`function (options){`];
        if( properties.length > 0 ){
            defaultConstructor.push( this.semicolon(`\tObject.defineProperty(this,${this.checkRefsName(Constant.REFS_DECLARE_PRIVATE_NAME)},{value:{${properties.join(",")}}})`) )
        }
        if( inherit ){
            defaultConstructor.push( this.semicolon(`${this.getModuleReferenceName(inherit)}.prototype._init.call(this,options)`) );
        }
        if( initialProps.length > 0 ){
            defaultConstructor.push.apply(defaultConstructor, initialProps);
        }
        defaultConstructor.push('}');
        return defaultConstructor.join("\r\n");
    }

    createOptions(name,inherit){
        const properties = [`name:'es-${name}'`];
        const indent = this.getIndent();
        if( inherit ){
            const Component = this.getGlobalModuleById('web.components.Component');
            if( Component !== inherit ){
                properties.push( `extends:${this.getModuleReferenceName(inherit)}` );
            }
        }
        return `{\r\n\t${indent}${properties.join(`,\r\n\t${indent}`)}\r\n}`;
    }

}


module.exports = VueClass;
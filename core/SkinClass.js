const Syntax = require("./Syntax");
const Core = require("./Core.js");
const Constant = Core.constant;
class SkinClass extends Syntax{
    getReserved(){
        return this._reserved || (this._reserved = this.getConfig('reserved') || []);
    }
    emitStack(item,name,isStatic,properties,modifier){
        if( !item )return null;
        if( this.getReserved().includes( name ) && this.isInheritWebComponent( item.module ) ){
            (item.key || item.id || item).error(1124, name);
        }
        const value = this.make(item);
        if( value ){
            if( item.isPropertyDefinition ){
                if( !isStatic && modifier === "private"){
                    properties.push(`'${name}':${value||null}`);
                }
                return value;
            }else{
                return value;
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
        const _private = Constant.REFS_DECLARE_PRIVATE_NAME;
        const classScope = this.stack.scope.getScopeByType("class");
        const topRefs = new Map();
        const methodContent = [];
        const memberContent = [];
        const mainEnterMethods=[];
        const emitter=(target,proto,content,isStatic,descriptive)=>{
            for( var name in target ){
                const item = target[ name ];
                const modifier = item.modifier ? item.modifier.value() : 'public';
                if( item.isPropertyDefinition ){
                    const value = this.emitStack(item,name,isStatic,properties,modifier);
                    const kind = item.kind ==="var" ?  Constant.DECLARE_PROPERTY_VAR : Constant.DECLARE_PROPERTY_CONST;
                    content.push(this.definePropertyDescription(
                        proto,
                        name,
                        value,
                        false,
                        modifier,
                        kind,
                        descriptive
                    ));
                }else if( item.isAccessor ){
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
                        descriptive
                    ));
                }else{
                    if(isStatic && modifier ==="public" && item.isEnterMethod && !mainEnterMethods.length ){
                        mainEnterMethods.push( this.semicolon(`${module.id}.${name}()`) )
                    }
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

        this.addDepend( this.getGlobalModuleById('Class') );

        if( module.methodConstructor ){
            module.methodConstructor.once("fetchClassProperty",(event)=>{
                event.properties = `{${properties.join(",")}}`;
                event.initialProps = initialProps.join("\r\n");
            });
        }

        const construct = module.methodConstructor ? this.make(module.methodConstructor) : this.createDefaultConstructor(module, inherit, properties, initialProps);
      
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

        const description = this.createClassDescription(module, inherit, imps, _methods, _members, _private);

        this.createDependencies(module,refs);

        refs.push(`var ${_private}=Symbol("private");`);
        
        //alias refs
        if( topRefs.size > 0 ){
            topRefs.forEach( (value,name)=>{
                refs.push( `var ${value} = ${name};` );
            });
        }

        const parts = refs.concat(construct,content);
        parts.push( this.emitCreateClassDescription( module, description) );
        parts.push( this.emitExportClass(module) );
        if( mainEnterMethods.length > 0 ){
            parts.push( mainEnterMethods.join('\r\n') );
        }
        return parts.join("\r\n");
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
        const defaultConstructor=[`function ${module.id}(context){`];
        if( properties.length > 0 ){
            defaultConstructor.push( this.semicolon(`\tObject.defineProperty(this,${this.checkRefsName(Constant.REFS_DECLARE_PRIVATE_NAME)},{value:{${properties.join(",")}}})`) )
        }
        if( inherit ){
            defaultConstructor.push( this.semicolon(`${this.getModuleReferenceName(inherit)}.call(this, context)`) );
        }

        if( initialProps.length > 0 ){
            defaultConstructor.push.apply(defaultConstructor, initialProps);
        }
        defaultConstructor.push('}');
        return defaultConstructor.join("\r\n");
    }
}


module.exports = SkinClass;
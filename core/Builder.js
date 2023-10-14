const Core = require('./Core');
const Polyfill = require('./Polyfill');
const path = require('path');
const {createThisNode} = require('./Utils');
class Builder extends Core.Builder{

    constructor(compilation){
        super(compilation);
        this.cacheMembersNamedMap = new Map();
    }

    createThisNode(stack, ctx, flag){
        return createThisNode(ctx, stack, flag);
    }

    getModuleRoutes(module){
        let routes = super.getModuleRoutes(module);
        if( routes && routes.length>0 )return routes;
        return null;
    }

    babelTransformSync(content, sourceMap, babelOps, module, stack, compilation){
        const format = this.plugin.options.format;
        if( format ==='vue-raw' || format ==='vue-template' || format ==='vue-jsx' ){
            if( this.isVueComponent(module) ){
               return null;
            }
        }
        return super.babelTransformSync(content, sourceMap, babelOps, module, stack, compilation);
    }

    addAsset(module,source,type,meta){
        const result = super.addAsset(module,source,type,meta);
        if( !meta.isFile && type==='assets' && meta.type==='assets'){
            if( this.isBuildVueTemplateFormat() ){
                return false;
            }
        }
        return result;
    }

    getOutputAbsolutePath(module, compilation){
        const value = super.getOutputAbsolutePath(module, compilation);
        if( module && !module.isDeclaratorModule && (this.isBuildVueTemplateFormat() || this.isBuildVueJsxFormat()) ){
            if( this.isVueComponent(module) ){
                const info = path.parse(value);
                return `${info.dir}/${info.name}.vue`;
            }
        }
        return value;
    }

    isActiveForModule(depModule,ctxModule){
        if( !depModule )return false;
        ctxModule = ctxModule || this.module;
        const options = this.plugin.options;
        if( (options.crossDependenciesCheck || !options.hot) && !this.compilation.isClientPolicy(depModule) ){
            return false;
        }
        let result = super.isActiveForModule(depModule,ctxModule);
        if( result ){
            return result;
        }
        const isUsed = this.isUsed(depModule, ctxModule);
        if( !isUsed || !depModule.isDeclaratorModule )return false;
        if( this.getPolyfillModule( depModule.getName() ) ){
            return true;
        }
        // if( this.stack && this.stack.isModuleForWebComponent(depModule) ){
        //     result = depModule.requires && depModule.requires.has( depModule.id );
        //     if( result ){
        //         return true;
        //     }
        //     const classStack = this.compilation.getStackByModule(depModule);
        //     if( classStack && classStack.imports && classStack.imports.length > 0 ){
        //         return classStack.imports.some( item=>{
        //             if( item.source.isLiteral ){
        //                 return !item.description();
        //             }
        //             return false;
        //         });
        //     }
        // }
        return false;
    }

    getPolyfillModule( id ){
        const version = this.getBuildVersion();
        if( version >=3 ){
            if( Polyfill.v3Modules.has(id) ){
                return Polyfill.v3Modules.get(id);
            }
        }else{
            if( Polyfill.v2Modules.has(id) ){
                return Polyfill.v2Modules.get(id);
            }
        }
        return super.getPolyfillModule( id );
    }

    getBuildVersion(){
        return parseFloat(this.plugin.options.version) || 2.0;
    }

    isBuildVueRawFormat(){
        return this.plugin.options.format === 'vue-raw';
    }

    isBuildVueJsxFormat(){
        return this.plugin.options.format === 'vue-jsx';
    }

    isVueComponent(module){
        if( !module || !module.isModule || module.isDeclaratorModule)return false;
        if(this.stack.isModuleForWebComponent(module))return true;
        return this.isApplication(module);
    }

    isApplication(module){
        if( !module || !module.isModule || module.isDeclaratorModule )return false;
        const Application = this.getGlobalModuleById('web.Application');
        return Application.is(module);
    }

    isBuildVueTemplateFormat(stack){
        let result = false;
        if(this.isBuildVueRawFormat())result = true;
        if(!result){
            result = this.plugin.options.format === 'vue-template';
        }
        if(result){
            if( stack && stack.isStack ){
                if( stack.compilation.JSX && stack.parentStack.isProgram ){
                    return result;
                }
                if( stack.parentStack.isReturnStatement && this.isVueComponent(stack.parentStack.module) ){
                    const parent = stack.parentStack.getParentStack((stack)=>{
                        if(stack.isMethodDefinition)return true;
                        if(stack.isBlockStatement || stack.isArrowFunctionExpression || stack.isFunctionDeclaration){
                            if(stack.parentStack.parentStack.isMethodDefinition){
                                return false;
                            }
                            return true;
                        }
                    });
                    if( parent && parent.isMethodDefinition && parent.key.value() ==='render' ){
                        return true;
                    }
                }
                return false;
            }
        }
        return result;
    }

    inJSXScope(stack){
        if(!stack)return false;
        let parent = stack.parentStack;
        while( parent ){
            if(parent.isJSXExpressionContainer || parent.isJSXElement || parent.isJSXAttribute){
                return true
            }
            if(parent.isBlockStatement)break;
            parent = parent.parentStack;
        }
        return false;
    }

    genMembersName(module, name, stack){
        let dataset = this.cacheMembersNamedMap.get(module);
        if( !dataset ){
            this.cacheMembersNamedMap.set(module, dataset={map:{},data:{}});
        }

        const recoreds = dataset.data[name];
        if( recoreds && stack ){
            const result = recoreds.find( recored=>recored.stack === stack )
            if(result){
                return result.value;
            }
        }

        let index = 0;
        let key = name;
        while( dataset.map[key] || module.getDescriptor(key) ){
            index++;
            key = name+index;
        }
        dataset.map[key] = true;
        const items = dataset.data[name] || (dataset.data[name]=[]);
        items.push({
            value:key,
            name,
            stack
        })
        return key;
    }
}
module.exports = Builder;
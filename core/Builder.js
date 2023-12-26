const Core = require('./Core');
const Polyfill = require('./Polyfill');
const path = require('path');
const fs = require('fs');
const {createThisNode} = require('./Utils');
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const Generator = require('es-javascript/core/Generator');
class Builder extends Core.Builder{

    constructor(compilation){
        super(compilation);
        this.cacheMembersNamedMap = new Map();
    }

    createThisNode(stack, ctx, flag){
        return createThisNode(ctx, stack, flag);
    }

    loadConfig(){
        const projectConfigFile = this.plugin.options.projectConfigFile;
        if(projectConfigFile){
            const context = this.compiler.options.workspace;
            if( projectConfigFile.endsWith('.env') ){
                const mode = this.plugin.options.metadata?.env?.NODE_ENV || process.env?.NODE_ENV || 'production';
                const env = {};
                const files = [
                    projectConfigFile,
                    `${projectConfigFile}.${mode}`,
                ];
                files.forEach( file=>{
                    const filePath = this.compiler.getFileAbsolute(file, context, false, false);
                    if(!filePath)return;
                    Object.assign(env, dotenv.parse(fs.readFileSync(filePath)))
                });
                dotenvExpand.expand({parsed:env})
                return `export default ${JSON.stringify(env)};`;
            }else{
                const file = this.compiler.getFileAbsolute(projectConfigFile, context, !projectConfigFile.includes('.'), false);
                if(file){
                    return `export * as default from "${file}";`
                }
            }
        }
        return 'export default {};'
    }

    async getPageRoutes(){
        const pageDir = this.plugin.options.pageDir;
        if(!pageDir){
            return 'export default [];';
        }
        const context = this.compiler.options.workspace;
        const suffixName = this.compiler.suffix || '.es';
        const suffix = new RegExp( suffixName.replace(/\./, '\\.') );
        const files = [];
        const readdir = (dir)=>{
            if( !fs.existsSync(dir) ){
                return;
            }
            const items = fs.readdirSync(dir);
            if(items){
                items.forEach((file)=>{
                    if(file==='.' || file==='..')return;
                    const filepath = path.join(dir, file);
                    if(fs.statSync(filepath).isDirectory()){
                        readdir(filepath);
                    }else if(suffix.test(filepath)){
                        files.push(filepath)
                    }
                });
            }
        }

        const dir = path.isAbsolute(pageDir) ? pageDir : path.join(context, pageDir);
        if( !fs.existsSync(dir) || !fs.statSync(dir).isDirectory() ){
            return 'export default [];'
        }

        readdir(dir);

        const results = await Promise.allSettled(files.map(file=>this.compiler.createCompilation(file)));
        const compilations = results.map( result=>result.value ).filter( v=>!!v );
        await Promise.allSettled(compilations.map(compilation=>{
            return new Promise( async(resolve)=>{
                compilation.createStack();
                compilation.createCompleted().then(resolve);
            });
        }));

        const pagesModule = new Set();
        const routesData = {};
        compilations.forEach( compilation=>{
            const module = compilation.mainModule;
            if(module && !module.isDeclaratorModule && module.isWebComponent()){
                pagesModule.add(module)
            }
        });

        const pages = Array.from(pagesModule).sort((a,b)=>{
            a = a.file.split('/').length;
            b = b.file.split('/').length;
            return a - b;
        });

        const pageCxt = context.toLowerCase();
        const getParentRoute=(pid)=>{
            if( routesData[pid] ){
                return routesData[pid]
            }
            if(pageCxt !==pid && pid.includes(pageCxt)){
                return getParentRoute(path.dirname(pid))
            }
            return null;
        }

        const metadata = new Map();
        pages.forEach( pageModule=>{
            const pid = path.dirname(pageModule.file).toLowerCase()
            const id = (pid+'/'+pageModule.id).toLowerCase();
            let routes = this.getModuleRoutes(pageModule, true);
            let route = routes ? routes[0] : {};
            let metakey = '__meta'+ metadata.size;
            metadata.set(pageModule, metakey)
            let item = {
                path:route.path || '/'+pageModule.getName('/'),
                name:route.name || pageModule.getName('/'),
                meta:metakey,
                redirect:this.getModuleRedirect(pageModule),
                component:`()=>import('${this.compiler.normalizePath(pageModule.file)}')`
            }
            const parent = getParentRoute(pid);
            if( parent ){
                const children = parent.children || (parent.children = []);
                children.push(item);
            }else{
                routesData[id] = item;
            }
        });

        const make = (items, level=0)=>{
            let indentChar = '    ';
            let top = indentChar.repeat(level);
            let code = `[\n`;
            code+=items.map(item=>{
                let ident = indentChar.repeat(level+2);
                const code = Object.entries(item).map( attr=>{
                    let [key, value] = attr;
                    if(!value)return false;
                    if(key==='component'||key==='meta'){
                        return `${ident}${key}:${value}`;
                    }else if( key==='children'){
                        return `${ident}${key}:${make(value, level+2)}`;
                    }
                    return `${ident}${key}:${JSON.stringify(value)}`;
                }).filter( val=>val ).join(',\n')
                return `${indentChar}${top}{\n${code}\n${indentChar}${top}}`
            }).join(',\n')
            code += `\n${top}]`;
            return code;
        }
        const code = make(Object.values(routesData));
        const imports = [];
        metadata.forEach( (key, module)=>{
            imports.push(`import ${key} from "${module.file}?callhook&action=metadata&id=${module.id}";\n` )
        })

        return `${imports.join('')}export default ${code};`
    }

    getModuleMetadataCode(module){
        const metadataAnnot = this.getModuleAnnotations(module, ['metadata'])[0];
        const imports = new Set();
        const body = [];
        const metadata = {};
        let requireSelfFlag = false;
        if( metadataAnnot ){
            const checkDep=(stack)=>{
                if(stack.isIdentifier){
                    const desc = stack.description();
                    if(desc && desc.isVariableDeclarator && desc.parentStack){
                        if( desc.init ){
                            checkDep(desc.init);
                        }
                        body.push(desc.parentStack)
                    }else if(desc && desc.isStack && desc.parentStack && desc.parentStack.isImportDeclaration){
                        imports.add(desc.parentStack);
                    }else if(desc && desc.isDeclaratorFunction){
                        desc.imports.forEach( im=>{
                            imports.add(im);
                        });
                    }
                }else if( stack.isMemberExpression ){
                    if( stack.object.isMemberExpression ){
                        checkDep(stack.object)
                    }else{
                        const desc = stack.object.description();
                        if(desc && desc.isModule){
                            if( desc.isClass ){
                                let curImpStack = null;
                                if(module.imports.has(desc.id)){
                                    const stacks = module.getStacks();
                                    for(let ms of stacks){
                                        if(ms.isClassDeclaration){
                                            curImpStack = ms.imports.find( s=>s.description() === desc );
                                        }
                                    }
                                }
                                if(curImpStack){
                                    imports.add(curImpStack);
                                }else if(desc === module){
                                    requireSelfFlag = true;
                                }
                            }
                        }else if(desc && desc.isStack && desc.parentStack && desc.parentStack.isImportDeclaration){
                            imports.add(desc.parentStack);
                        }
                    }
                }else if(stack.isCallExpression){
                    checkDep(stack.callee)
                }
            }
            metadataAnnot.getArguments().forEach( (item,index)=>{
                if(item.assigned){
                    checkDep(item.stack.right);
                    metadata[item.key] = this.createToken(item.stack.right);
                }else if(index===0){
                    checkDep(item.stack);
                    metadata.title = this.createToken(item.stack);
                }else{
                    if( !item.stack.isIdentifier ){
                        throw new ReferenceError('[es-vue] Metadata defined parameters except the first must take the form of key-value pairs')
                    }else{
                        checkDep(item.stack);
                        metadata[item.stack.value()] = this.createToken(item.stack);
                    }
                }
            });
        }

        const gen = new Generator(this.compilation.file);

        if(requireSelfFlag){
            gen.make(this.createChunkNode(`import ${this.getModuleReferenceName(module)} from "${module.file}"`));
        }

        if(imports.size>0){
            imports.forEach( stack=>{
                const node = this.createToken(stack);
                if(node){
                    if(!stack.source.isLiteral){
                        const desc = stack.description();
                        if(desc && desc.isModule && desc.isClass){
                            node.specifiers.forEach( spec=>{
                                spec.local.value = this.getModuleReferenceName(desc);
                            })
                        }
                    }
                    gen.make(node)
                }
            })
        }

        if( body.length>0 ){
            body.forEach( stack=>{
                gen.make(this.createToken(stack))
            })
        }

        const decl = this.createDeclarationNode('const', [
            this.createDeclaratorNode('__$$metadata', this.createObjectNode(Object.keys(metadata).map(key=>this.createPropertyNode(key, metadata[key]))))
        ])

        gen.make(decl);

        let code = gen.toString();
        return `${code}\nexport default __$$metadata;`;

    }

    getModuleMetadata(query={}){
        let module = this.compilation.mainModule;
        if(query.id && module.id!==query.id){
            module = null;
        }
        if( module && (!module.isModule || !module.isClass || !module.isDeclaratorModule) ){
            module = null;
        }
        if(!module){
            module = Array.from(this.compilation.modules.values()).find(m=>(!query.id || m.id===query.id) && m.isModule && m.isClass && !m.isDeclaratorModule)
        }
        if(module){
            return this.getModuleMetadataCode(module)
        }
        return `export default {};`;
    }

    getModuleRedirect(module){
        const redirectAnnot = this.getModuleAnnotations(module, ['redirect'])[0];
        let redirect = null;
        if( redirectAnnot ){
            const args = redirectAnnot.getArguments();
            if( args[0] ){
                const value = String(args[0].value);
                const toModule = this.compilation.getModuleById( value );
                if( toModule ){
                    const routes = this.getModuleRoutes(toModule);
                    const redirectRoute = routes ? routes[0] : null;
                    if( redirectRoute ){
                        redirect = this.createRoutePath(redirectRoute);
                    }else{
                        console.error(`[es-vue] Redirect reference class is not a valid page-component the "${value}"`)
                    }
                }else if( value && value.includes('.') ){
                    console.error(`[es-vue] Redirect reference class is not exists. the "${value}"`)
                }else if( !value ){
                    console.error(`[es-vue] Redirect missing route-path.`)
                }
            }
        }
        return redirect;
    }

    getModuleRoutes(module, isPage=false){
        if(!module)return null;
        if(!module.isModule || !module.isClass || module.isDeclaratorModule || !module.isWebComponent())return null;
        let routes = super.getModuleRoutes(module);
        if( routes && routes.length>0 )return routes;

        if(!isPage){
            const pageDir = this.plugin.options.pageDir;
            if(pageDir){
                const context = path.isAbsolute(pageDir) ? pageDir : path.join(this.compiler.options.workspace, pageDir);
                isPage = module.file.includes(this.compiler.normalizePath(context));
            }
        }

        if( isPage ){
            const name = module.getName('/');
            return [{
                path:'/'+name,
                name
            }]
        }
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

    crateAssetFilter(asset, module, context, dataset){
        if( !asset.file && asset.type ==="style" && module ){
            if( this.isBuildVueTemplateFormat() ){
                return false;
            }
        }
        return true;
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
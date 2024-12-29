import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import dotenvExpand from 'dotenv-expand';
import { callAsyncSequence, getModuleRoutes, getModuleRedirect , getModuleAnnotations} from './Common';
import Token from "@easescript/transform/lib/core/Token";

class HookManager extends Token{

    #plugin = null;
    constructor(plugin){
        super();
        this.#plugin = plugin;
    }

    get plugin(){
        return this.#plugin;
    }

    get options(){
        return this.#plugin.options;
    }

    get compiler(){
        return this.#plugin.complier;
    }

    get token(){
        return this.#plugin.context.token;
    }

    getProjectConfig(compilation){
        const projectConfigFile = this.options.projectConfigFile;
        if(projectConfigFile){
            if( projectConfigFile.endsWith('.env') ){
                const mode = this.options.mode || process.env?.NODE_ENV || 'production';
                const env = {};
                const files = [
                    projectConfigFile,
                    `${projectConfigFile}.${mode}`,
                ];
                files.forEach( file=>{
                    const filePath = this.compiler.resolveManager.resolveFile(file);
                    if(!filePath)return;
                    Object.assign(env, dotenv.parse(fs.readFileSync(filePath)))
                });
                dotenvExpand.expand({parsed:env})
                return `export default ${JSON.stringify(env)};`;
            }else{
                const file = this.compiler.resolveManager.resolveFile(projectConfigFile);
                if(file){
                    return `export * as default from "${file}";`
                }else{
                    console.error(`[ES-VUE] Not resolved project config file the "${projectConfigFile}"`)
                }
            }
        }
        return 'export default {};'
    }

    async getPageRoutes(compilation){
        const pageDir = this.options.pageDir;
        if(!pageDir){
            return 'export default [];';
        }

        const files = [];
        const pageExcludeRegular = this.options.pageExcludeRegular;
        const readdir = (dir)=>{
            if( !fs.existsSync(dir) ){
                return;
            }
            const items = fs.readdirSync(dir);
            if(items){
                items.forEach((file)=>{
                    if(file==='.' || file==='..')return;
                    let filepath = path.join(dir, file);
                    if(fs.statSync(filepath).isDirectory()){
                        readdir(filepath);
                    }else if(this.compiler.checkFileExt(filepath)){
                        filepath = this.compiler.normalizePath(filepath);
                        if( pageExcludeRegular && pageExcludeRegular.test(filepath)){
                            return;
                        }
                        files.push(filepath)
                    }
                });
            }
        }

        const dir = path.isAbsolute(pageDir) ? pageDir : this.compiler.resolveManager.resolveSource(pageDir);
        if(!dir){
            console.error(`[ES-VUE] Not resolved page dir the "${pageDir}"`)
        }

        if(!dir || !fs.existsSync(dir) || !fs.statSync(dir).isDirectory() ){
            return 'export default [];'
        }

        readdir(dir);

        const pagesModule = new Set();
        const routesData = {};
        await callAsyncSequence(files, async(file)=>{
            let compilation = await this.compiler.createCompilation(file);
            if(compilation){
                await compilation.ready();
                const module = compilation.mainModule;
                if(module && !module.isDeclaratorModule && module.isWebComponent()){
                    pagesModule.add(module)
                }
            }
        });

        const pages = Array.from(pagesModule).sort((a,b)=>{
            a = a.file.split('/').length;
            b = b.file.split('/').length;
            return a - b;
        });

        const pageCxts = this.compiler.getWorkspaceFolders().map(file=>file.toLowerCase())
        const getParentRoute=(pid)=>{
            if( routesData[pid] ){
                return routesData[pid]
            }
            if(pid && !pageCxts.includes(pid) && pageCxts.some(ctx=>pid.includes(ctx))){
                return getParentRoute(path.dirname(pid))
            }
            return null;
        }

        const metadata = new Map();
        pages.forEach( pageModule=>{
            const pid = path.dirname(pageModule.file).toLowerCase()
            const id = (pid+'/'+pageModule.id).toLowerCase();
            let routes = this.getModuleRoute(pageModule, true);
            let route = routes ? routes[0] : {};
            let metakey = '__meta'+ metadata.size;
            metadata.set(pageModule, metakey)
            let item = {
                path:route.path || '/'+pageModule.getName('/'),
                name:route.name || pageModule.getName('/'),
                meta:metakey,
                redirect:getModuleRedirect(pageModule),
                component:`()=>import('${this.compiler.parseResourceId(pageModule)}')`
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
            imports.push(`import ${key} from "${module.file}?callhook&action=metadata&id=${module.getName()}";\n` )
        });
        return `${imports.join('')}export default ${code};`
    }

    getModuleRoute(module, isPage=false){
        if(!module)return [];
        if(!module.isModule || !module.isClass || module.isDeclaratorModule)return [];
        let routes = getModuleRoutes(module);
        if( routes && routes.length>0 )return routes;
        if(!isPage){
            const pageExcludeRegular = this.options.pageExcludeRegular;
            let isExclude = pageExcludeRegular ? pageExcludeRegular.test(module.file) : false;
            const pageDir = this.options.pageDir;
            if(pageDir && !isExclude){
                const dir = path.isAbsolute(pageDir) ? pageDir : this.compiler.resolveManager.resolveSource(pageDir);
                isPage = module.file.includes(this.compiler.normalizePath(dir));
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

    getModuleMetadataCode(module){
        const metadataAnnot = getModuleAnnotations(module, ['metadata'])[0];
        const imports = new Set();
        const body = [];
        const metadata = {};
        let requireSelfFlag = false;
        if( metadataAnnot ){
            const checkDep=(stack)=>{
                if(stack.isIdentifier){
                    const desc = stack.descriptor();
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
                        const desc = stack.object.descriptor();
                        if(desc && desc.isModule){
                            if( desc.isClass ){
                                let curImpStack = null;
                                if(module.imports.has(desc.id)){
                                    const stacks = module.getStacks();
                                    for(let ms of stacks){
                                        if(ms.isClassDeclaration){
                                            curImpStack = ms.imports.find( s=>s.descriptor() === desc );
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

        const gen = new Generator();
        if(requireSelfFlag){
            gen.make(this.createChunkNode(`import ${module.getName('_')} from "${this.compiler.parseResourceId(module)}"`));
        }

        if(imports.size>0){
            imports.forEach( stack=>{
                const node = this.createToken(stack);
                if(node){
                    if(!stack.source.isLiteral){
                        const desc = stack.descriptor();
                        if(desc && desc.isModule && desc.isClass){
                            node.specifiers.forEach( spec=>{
                                spec.local.value =  desc.getName('_');
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

        const decl = this.createVariableDeclaration('const', [
            this.createVariableDeclarator('__$$metadata', this.createObjectExpression(
                Object.keys(metadata).map(
                    key=>this.createProperty(key, metadata[key])
                )
            ))
        ])

        gen.make(decl);

        let code = gen.toString();
        return `${code}\nexport default __$$metadata;`;

    }

    getModuleMetadata(compilation, query={}){
        let module = compilation.mainModule;
        if(query.id && module.getName() !== query.id){
            module = null;
        }
        if( module && (!module.isModule || !module.isClass || !module.isDeclaratorModule) ){
            module = null;
        }
        if(!module){
            module = Array.from(this.compilation.modules.values()).find(m=>(!query.id || m.getName()===query.id) && m.isModule && m.isClass && !m.isDeclaratorModule)
        }
        if(module){
            return this.getModuleMetadataCode(module)
        }
        return `export default {};`;
    }

}
export {
    HookManager
}
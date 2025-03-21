import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import dotenvExpand from 'dotenv-expand';
import { callAsyncSequence, getModuleRoutes, getModuleRedirectNode , getModuleAnnotations, createCJSImports, createESMImports} from './Common';
import Token from "@easescript/transform/lib/core/Token";
import Generator from "@easescript/transform/lib/core/Generator";
import Utils from 'easescript/lib/core/Utils';

class MakeCode extends Token{

    #plugin = null;
    #resolvePageDir = void 0;
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

    getPageDir(){
        let pageDir =this.#resolvePageDir;
        if(pageDir !== void 0)return pageDir;
        pageDir = this.options.pageDir;
        if(pageDir){
            pageDir = this.compiler.resolveManager.resolveSource(pageDir)
        }else{
            pageDir = null;
        }
        this.#resolvePageDir = pageDir;
        return pageDir;
    }

    isPage(module){
        if(Utils.isModule(module) && module.file && module.isWebComponent()){
            let pageDir = this.getPageDir();
            if(pageDir && module.file.startsWith(pageDir)){
                const pageExcludeRegular = this.options.pageExcludeRegular; 
                if(pageExcludeRegular && pageExcludeRegular.test(module.file)){
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    getProjectConfig(){
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

    async getPageRoutes(){
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

        const dir = this.getPageDir();
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

        const contextModule = pages[0];
        const ctx = this.plugin.context.makeContext(contextModule);
        const metadata = new Map();
        pages.forEach( pageModule=>{
            const pid = path.dirname(pageModule.file).toLowerCase()
            const id = (pid+'/'+pageModule.id).toLowerCase();
            let routes = this.getModuleRoute(ctx, pageModule, true);
            let metakey = '__meta'+ metadata.size;
            metadata.set(pageModule, metakey)
            routes.forEach(route=>{
                let item = {
                    path:route.path || '/'+pageModule.getName('/'),
                    name:route.name || pageModule.getName('/'),
                    meta:metakey,
                    redirect:getModuleRedirectNode(ctx, pageModule),
                    component:`()=>import('${this.compiler.parseResourceId(pageModule)}')`
                }
                const parent = getParentRoute(pid);
                if( parent ){
                    const children = parent.children || (parent.children = []);
                    children.push(item);
                }else{
                    routesData[id] = item;
                }
            })
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
        const gen = new Generator();
        ctx.createModuleDependencies(contextModule)
        let importNodes = null
        if(ctx.options.module==='cjs'){
            importNodes = createCJSImports(ctx, ctx.imports)
        }else{
            importNodes = createESMImports(ctx, ctx.imports)
        }
        if(importNodes){
            importNodes.forEach(item=>gen.make(item));
        }
        metadata.forEach( (key, module)=>{
            gen.make(ctx.createChunkExpression(`import ${key} from "${module.file}?callhook&action=metadata&id=${module.getName()}"`))
        });
        gen.make(ctx.createChunkExpression(`export default ${code}`))
        return gen.toString();
    }

    getDefaultRoutePath(module){
        const pageDir = this.getPageDir();
        let name = "/"+module.getName('/');
        if(pageDir){
            let baseName = "/"+ path.basename(pageDir) +"/";
            if(name.includes(baseName)){
                let [_, last] = name.split(baseName, 2)
                return "/" + last;
            }
        }
        return name;
    }

    getModuleRoute(ctx, module){
        if(!module)return [];
        if(!module.isModule || !module.isClass || module.isDeclaratorModule)return [];
        let routes = getModuleRoutes(ctx, module);
        if( routes && routes.length>0 )return routes;
        return [];
    }

    makeModuleMetadata(module){
        const ctx = this.plugin.context.makeContext(module);
        const metadataAnnot = getModuleAnnotations(module, ['metadata'])[0];
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
                    metadata[item.key] = ctx.createToken(item.stack.right);
                }else if(index===0){
                    checkDep(item.stack);
                    metadata.title = ctx.createToken(item.stack);
                }else{
                    if( !item.stack.isIdentifier ){
                        throw new ReferenceError('[es-vue] Metadata defined parameters except the first must take the form of key-value pairs')
                    }else{
                        checkDep(item.stack);
                        metadata[item.stack.value()] = ctx.createToken(item.stack);
                    }
                }
            });
        }

        const gen = new Generator();
        if(requireSelfFlag){
            gen.make(ctx.createChunkExpression(`import ${module.id} from "${ctx.compiler.parseResourceId(module)}"`));
        }

        if(imports.size>0){
            imports.forEach( stack=>{
                ctx.createToken(stack);
            })
        }

        ctx.createModuleDependencies(module)
        let importNodes = null
        if(ctx.options.module==='cjs'){
            importNodes = createCJSImports(ctx, ctx.imports)
        }else{
            importNodes = createESMImports(ctx, ctx.imports)
        }
        if(importNodes){
            importNodes.forEach(item=>gen.make(item));
        }

        if( body.length>0 ){
            body.forEach( stack=>{
                gen.make(ctx.createToken(stack))
            })
        }

        const keys = Object.keys(metadata);
        if(keys.length===0 && body.length===0){
            return `export default {};`;
        }

        const decl = ctx.createVariableDeclaration('const', [
            ctx.createVariableDeclarator(ctx.createIdentifier('__$$metadata'), ctx.createObjectExpression(
                keys.map(
                    key=>ctx.createProperty(ctx.createLiteral(key), metadata[key])
                )
            ))
        ]);
        gen.make(decl);
        return `${gen.toString()}\nexport default __$$metadata;`;
    }

    getModuleMetadata(compilation, query={}){
        let module = compilation.mainModule;
        if(query.id && module.getName() !== query.id){
            module = null;
        }
        if(!module){
            module = Array.from(compilation.modules.values()).find(m=>m.getName()===query.id && m.isModule && m.isClass && !m.isDeclaratorModule)
        }
        if(Utils.isModule(module)){
            return this.makeModuleMetadata(module)
        }
        return `export default {};`;
    }

}
export {
    MakeCode
}
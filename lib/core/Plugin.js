import Compilation from "easescript/lib/core/Compilation";
import Diagnostic from "easescript/lib/core/Diagnostic";
import {getOptions, execute, Plugin as BasePlugin} from "@easescript/transform/lib/index";
import {createPolyfillModule} from '@easescript/transform/lib/core/Polyfill';
import {createBuildContext, getTokenManager} from "@easescript/transform/lib/core/Builder";
import * as baseTokens from '@easescript/transform/lib/tokens';
import * as vueTokens from '../tokens';
import {MakeCode} from "./MakeCode";
import Context from "./Context";
import path from "path";
const tokens = Object.assign({}, baseTokens, vueTokens);

Diagnostic.register("transform", (definer)=>{
    definer(11000,'',[
        '对非元素根节点的组件使用"show"指令时，无法按预期运行。',
        "Runtime directive used on component with non-element root node. The 'show' directives will not function as intended"
    ]);
    definer(11001,'',[
        '指令组件的子级只能是一个VNode的类型',
        "Child of directive-component can only is of a VNode"
    ]);
    definer(11002,'',[
        'JSX不支持动态属性名',
        "Dynamic property name is not supported in JSX. this property will be removed."
    ]);
    definer(11003,'',[
        '函数中引用的组件不是标识符',
        "The component references in a function is not an identifier"
    ]);
})

function setImports(imports, name, value, force=false){
    if(force || !Object.prototype.hasOwnProperty.call(imports, name) || imports[name] === void 0){
        imports[name] = value;
    }
}

function genMapping(options){
    const ui = options.ui;
    const imports = options.resolve.imports;
    if(ui.style==="none"){
        setImports(imports, 'element-plus/*/components/*/style/***', false)
        setImports(imports, 'element-plus/theme-chalk/***', false)
        setImports(imports, '#es-vue-web-application-style', false, true)
    }else if(ui.style==="scss"){
        setImports(imports,'element-plus/lib/components/*/style/css', resolveComponent(options,'{0}/style/index'))
        setImports(imports,'#es-vue-web-application-style','element-plus/theme-chalk/src/index.scss');
    }else{
        setImports(imports,'#es-vue-web-application-style','element-plus/theme-chalk/index.css');
    }
    if(ui.module==="esm"){
        setImports(imports,'element-plus/lib/components/**', 'element-plus/es/components/{...}/{basename}/index');
        setImports(imports,'element-plus/lib/components/**/*.*', 'element-plus/es/components/{...}/index');
        if(ui.style==="scss"){
            setImports(imports,'element-plus/lib/components/*/style/css', resolveComponent(options,'{0}/style/index'))
        }else if(ui.style==="none" ){
            setImports(imports,'element-plus/lib/components/*/style/*', false, true)
        }else{
            setImports(imports,'element-plus/lib/components/*/style/css', resolveComponent(options,'{0}/style/css'))
        }
    }
}

function mergeOptions(options){
    const imports = options.resolve.imports || (options.resolve.imports={})
    const ui = options.ui || (options.ui={});
    if(ui.fully){
        if(ui.style==="none" ){
            setImports(imports,'element-plus/*/components/*/style/***', false, true);
            setImports(imports,'element-plus/theme-chalk/***', false, true);
            setImports(imports,'#es-vue-web-application-style', false, true);
        }else if(ui.style==="scss"){
            setImports(imports,'#es-vue-web-application-style','element-plus/theme-chalk/src/index.scss');
        }else{
            setImports(imports,'#es-vue-web-application-style','element-plus/theme-chalk/index.css');
        }
    }else{
        genMapping(options);
    }
    if(options.pageExcludeRegular){
        if(!(options.pageExcludeRegular instanceof RegExp)){
            throw new Error('Options.pageExcludeRegular invalid. must is regexp type.')
        }
    }
    return options;
}

function resolveComponent(options, name){
    const flag = options.ui.module==="esm";
    return `element-plus/${flag?'es':'lib'}/components/${name}`;
}

function addFullyImports(glob){
    const library = 'element-plus'
    glob.addRule(/^(element-plus\/(lib|es)\/components)\//i,(id)=>{
        if(id.endsWith('/style/index')||id.endsWith('/style/css')||id.includes('/lib/theme-chalk/')){
            return false;
        }
        return library;
    },0,'imports');
}

class Plugin extends BasePlugin{
    #context = null;
    #makeCode = null;

    constructor(name, version, options){
        super(name, version, mergeOptions(options))
    }

    get context(){
        return this.#context;
    }

    get makeCode(){
        let makeCode = this.#makeCode;
        if(makeCode===null){
            this.#makeCode = makeCode = new MakeCode(this);
        }
        return makeCode;
    }

    getWidget(name){
        if(name==="context")return Context;
        if(name==="token")return getTokenManager(this.options, tokens);
        return super.getWidget(name);
    }

    init(){
        if(this.#context)return;
        //创建一个用来构建的上下文对象。每个插件都应该实现自己的上下文对象
        this.#context = createBuildContext(this, this.records);
        //初始化需要的虚拟模块。 每个插件都应该实现自己的虚拟模块
        createPolyfillModule(
            path.join(__dirname, "./polyfills"),
            this.#context.virtuals.createVModule
        );
        
        let glob = this.#context.glob;

        //导入UI全包
        if(this.options.ui.fully){
            addFullyImports(glob);
        }

        let resolve = this.options.resolve || {};
        let imports = resolve?.imports || {};
        Object.keys(imports).forEach( key=>{
            glob.addRuleGroup(key, imports[key], 'imports')
        });
    
        let folders = resolve?.folders || {};
        Object.keys(folders).forEach( key=>{
            glob.addRuleGroup(key, folders[key],'folders');
        });
    }

    async resolveRoutes(compilation){
        if(!Compilation.is(compilation)){
            throw new Error('compilation is invalid')
        }
        if(!this.initialized){
            await this.beforeStart(compilation.compiler);
        }
        if(!compilation.parserDoneFlag){
            await compilation.ready();
        }
        let module = compilation.mainModule;
        if(module){
            return this.makeCode.getModuleRoute(module)
        }
        return [];
    }

    async callHook(compilation, query={}){
        if(!this.initialized){
            await this.beforeStart(compilation.compiler);
        }
        if(query.action==='config'){
            return this.makeCode.getProjectConfig(compilation, query);
        }else if(query.action==='route'){
            return await this.makeCode.getPageRoutes(compilation, query);
        }else if(query.action==='metadata'){
            return this.makeCode.getModuleMetadata(compilation, query);
        }else{
            throw new Error(`Callhook "${query.action}" is not supported`)
        }
    }
}

export default Plugin
export {getOptions, execute, Plugin}
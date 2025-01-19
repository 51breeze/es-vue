import BasePlugin from "@easescript/transform/lib/core/Plugin";
import {createBuildContext} from "./Builder";
import {MakeCode} from "./MakeCode";
import {createPolyfillModule} from '@easescript/transform/lib/core/Polyfill';
import path from "path";
import Compilation from "easescript/lib/core/Compilation";

function defineError(complier){
    if(defineError.loaded || !complier || !complier.diagnostic)return;
    defineError.loaded=true;
    let define = complier.diagnostic.defineError
    define(11000,'',[
        '对非元素根节点的组件使用"show"指令时，无法按预期运行。',
        "Runtime directive used on component with non-element root node. The 'show' directives will not function as intended"
    ]);
    define(11001,'',[
        '指令组件的子级只能是一个VNode的类型',
        "Child of directive-component can only is of a VNode"
    ]);
    define(11002,'',[
        'JSX不支持动态属性名',
        "Dynamic property name is not supported in JSX. this property will be removed."
    ]);
    define(11003,'',[
        '函数中引用的组件不是标识符',
        "The component references in a function is not an identifier"
    ]);
}

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

    init(){
        defineError(this.complier)
        //创建一个用来构建的上下文对象。每个插件都应该实现自己的上下文对象
        this.#context = createBuildContext(this, this.records);
        //初始化需要的虚拟模块。 每个插件都应该实现自己的虚拟模块
        createPolyfillModule(
            path.join(__dirname, "./polyfills"),
            this.#context.virtuals.createVModule
        );
        //导入UI全包
        if(this.options.ui.fully){
            addFullyImports(this.#context.glob);
        }
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
export {defineError, Plugin}
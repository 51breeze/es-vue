const fs = require("fs");
const path = require("path");
const Builder = require("./core/Builder");
const Core = require("./core/Core");
const merge = require("lodash/merge");
const modules = new Map();
const dirname = path.join(__dirname,"tokens");
fs.readdirSync( dirname ).forEach( (filename)=>{
    const info = path.parse( filename );
    modules.set(info.name, require( path.join(dirname,filename) ) );
});

const defaultConfig ={
    styleLoader:[],
    sourceMaps:false,
    version:"3.0.0",
    fillKey:['for','each','if','else'],
    optimize:true,
    hot:false,
    hmrHandler:'module.hot',
    importModuleFlag:true,
    crossDependenciesCheck:true,
    css:'sass', //none sass css
    resolve:{
        imports:{},
        folders:{}
    },
    metadata:{
        version:"3.0.0"
    },
    ssr:false,
    uiFully:false,
    vueLoader:null,
    format:'default', //vue-raw vue-jsx vue-template
    rawJsx:{},
    exposes:{
        globals:['Math','Date'],
        exposeFilter:(name)=>!['window','document'].includes(name)
    },
    vueOptions:{
        __file:false,
        __ssrContext:true,
        __vccOpts:false,
        __asyncSetup:{
            mode:'none', //ssr nossr all none,
            filter:null,
        }
    },
    importSourceQuery:{
        enabled:false,
        test:null,
        types:['component', 'styles'],
        query:{
            vue:''
        }
    },
    scopeIdPrefix:'data-v-',
    pageDir:'pages',
    localeDir:'locales',
    pageExcludeRegular:null,
    projectConfigFile:'.env',
    reserved:[],
};

function registerError(define, cn, en){
    if(registerError.loaded)return;
    registerError.loaded=true;
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

const pkg = require("./package.json");
const EXCLUDE_STYLE_RE = /[\\\/]style[\\\/](css|index)$/i;

function getVersion( val ){
    const [a="0",b="0",c="0"] = Array.from( String(val).matchAll( /\d+/g ) ).map( item=>item ? item[0].substring(0,2) : "0" );
    return [a,b,c].join('.');
}

function setImports(imports, name, value, force=false){
    if(force || !Object.prototype.hasOwnProperty.call(imports, name) || imports[name] === void 0){
        imports[name] = value;
    }
}

function genMapping(options={}){
    options.resolve.imports=merge({}, options.resolve.imports);
    const imports = options.resolve.imports;
    if( options.css==="none" ){
        setImports(imports, 'element-plus/*/components/*/style/***', false)
        setImports(imports, 'element-plus/theme-chalk/***', false)
        setImports(imports, '#es-vue-web-application-style', false, true)
    }else if(options.css==="scss"){
        setImports(imports,'element-plus/lib/components/*/style/css', resolveComponent(options,'{0}/style/index'))
        setImports(imports,'#es-vue-web-application-style','element-plus/theme-chalk/src/index.scss');
    }else{
        setImports(imports,'#es-vue-web-application-style','element-plus/theme-chalk/index.css');
    }
    if(options.importModuleFlag){
        setImports(imports,'element-plus/lib/components/**', 'element-plus/es/components/{...}/{basename}/index');
        setImports(imports,'element-plus/lib/components/**/*.*', 'element-plus/es/components/{...}/index');
        if(options.css==="scss"){
            setImports(imports,'element-plus/lib/components/*/style/css', resolveComponent(options,'{0}/style/index'))
        }else if(options.css==="none" ){
            setImports(imports,'element-plus/lib/components/*/style/*', false, true)
        }else{
            setImports(imports,'element-plus/lib/components/*/style/css', resolveComponent(options,'{0}/style/css'))
        }
    }
}

function mergeOptions(options){
    options = merge({}, defaultConfig, options);
    options.version = getVersion( options.version || 3 );
    options.reserved = [];
    options.metadata.vue = '3.0.0';
    options.metadata.version = '3.0.0';
    if(options.uiFully){
        const imports =  options.resolve.imports;
        if(options.css==="none" ){
            setImports(imports,'element-plus/*/components/*/style/***', false, true);
            setImports(imports,'element-plus/theme-chalk/***', false, true);
            setImports(imports,'#es-vue-web-application-style', false, true);
        }else if(options.css==="scss"){
            setImports(imports,'#es-vue-web-application-style','element-plus/theme-chalk/src/index.scss');
        }else{
            setImports(imports,'#es-vue-web-application-style','element-plus/theme-chalk/index.css');
        }
    }else{
        genMapping(options);
    }
    if(options.format ==='vue-raw' || options.format ==='vue-template' || options.format ==='vue-jsx'){
        options.rawJsx = options.rawJsx || {};
        options.rawJsx.enable = true;
        options.enablePrivateChain=true
        options.thisComplete=true
        options.strict = false;
        if( options.format ==='vue-jsx' ){
            options.rawJsx.jsx = true;
        }
    }
    if(options.pageExcludeRegular){
        if(!(options.pageExcludeRegular instanceof RegExp)){
            throw new Error('Options.pageExcludeRegular invalid. must is regexp type.')
        }
    }
    return options;
}

function resolveComponent(options, name){
    const flag = options.importModuleFlag;
    return `element-plus/${flag?'es':'lib'}/components/${name}`;
}

function toUpper(str){
    return str.split('-').map(v=> v[0].toUpperCase()+v.substring(1)).join('');
}

class PluginEsVue extends Core.Plugin{

    constructor(complier,options={}){
        options = mergeOptions(options);
        super(complier, options);
        this.name = pkg.name;
        this.version = pkg.version;
        this.platform = 'client';
        this.importSourceQuery=new Map();
        this.options.metadata.version = options.version;
        registerError(complier.diagnostic.defineError, complier.diagnostic.LANG_CN, complier.diagnostic.LANG_EN );
    }

    addGlobRule(){
        super.addGlobRule();
        if(this.options.uiFully){
            this.addGlobUIFullyImports()
        }
    }

    addGlobUIFullyImports(){
        const library = 'element-plus'
        this.glob.addRule(/^(element-plus\/(lib|es)\/components)\//i,(id, scheme)=>{
            if(id.endsWith('/style/index')||id.endsWith('/style/css')||id.includes('/lib/theme-chalk/')){
                return false;
            }
            return library;
        },0,'imports');
    }

    resolveImportSource(id, ctx={}){
        if(this.options.css==="none"){
            if(EXCLUDE_STYLE_RE.test(id)){
                return {source:false}
            }
        }
        const scheme = this.glob.scheme(id,ctx);
        let source = this.glob.parse(scheme, ctx);
        let rule = scheme.rule;
        if(rule){
            if(Array.isArray(ctx.specifiers) && source){
                let uiFully = this.options.uiFully;
                ctx.specifiers.forEach( spe=>{
                    if(uiFully && 'element-plus'===source){
                        let imported = null;
                        if(spe.type ==='ImportDefaultSpecifier'){
                            let pos = id.lastIndexOf('/');
                            let basename =  toUpper(id.substring(pos+1));
                            imported = `El${basename}`
                        }else if(spe.type==='ImportSpecifier'){
                            if(!spe.imported.value.startsWith('El')){
                                imported = `El${toUpper(spe.imported.value)}`
                            }
                        }
                        if(imported){
                            spe.imported = spe.createIdentifierNode(imported);
                            spe.type = 'ImportSpecifier'
                        }
                    }
                })
            }
        }else{
            source = id;
        }
        return {
            source
        }
    }

    async callHook(action,compilation, query={}){
        const builder = this.getBuilder(compilation);
        if(action==='config'){
            return builder.loadConfig(query);
        }else if(action==='route'){
            return await builder.getPageRoutes(query);
        }else if(action==='metadata'){
            return builder.getModuleMetadata(query);
        }
        return null;
    }

    getTokenNode(name, flag=false){
        if( flag ){
            return super.getTokenNode(name);
        }
        return modules.get(name) || super.getTokenNode(name);
    }

    getBuilder( compilation, builderFactory=Builder){
       return super.getBuilder(compilation, builderFactory);
    }

    getBuildModule(resourcePath, id=null, ns=''){
        if(this.options.ssr)ns += ':ssr';
        return super.getBuildModule(resourcePath, id, ns)
    }

    getBuildAssets(resourcePath, index=0, type=null, ns=''){
        if(this.options.ssr)ns += ':ssr';
        if(type==='style')type = 'styles';
        return super.getBuildAssets(resourcePath, index, type, ns)
    }

    createBuildAsset(resourceId, content=null, isFile=null, type=null, ns=''){
        if(this.options.ssr)ns += ':ssr';
        return super.createBuildAsset(resourceId, content, isFile, type, ns);
    }

    createBuildModule(resourceId, content, sourceMap, ns=''){
        if(this.options.ssr)ns += ':ssr';
        return super.createBuildModule(resourceId, content, sourceMap, ns)
    }

    toString(){
        return pkg.name;
    }
}

PluginEsVue.toString=function toString(){
    return pkg.name;
}

module.exports = PluginEsVue;
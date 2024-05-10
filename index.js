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
        imports:{
            '#es-vue-web-application-style':'element-plus/theme-chalk/base.css'
        },
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
    reserved:[
        '_data',
        '_props',
        '_init',
        '$data',
        '$props',
        '$forceUpdate',
        '$mount',
        '$parent',
        '$children',
        '$attrs',
        '$options',
        '$el',
        '$root',
        '$slots',
        '$scopedSlots',
        '$refs',
        '$isServer',
        '$listeners',
        '$watch',
        '$set',
        '$delete',
        '$on',
        '$once',
        '$off',
        '$emit',
        '$nextTick',
        '$destroy',
    ],
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

function getVersion( val ){
    const [a="0",b="0",c="0"] = Array.from( String(val).matchAll( /\d+/g ) ).map( item=>item ? item[0].substring(0,2) : "0" );
    return [a,b,c].join('.');
}

function genMapping(options={}){
    options.resolve.imports=merge({
        'element-ui/packages/**':resolveComponent(options,'{...}/{basename}/index'),
        'element-ui/packages/**/*.*':resolveComponent(options,'{...}/index'),
    }, options.resolve.imports);
    const imports = options.resolve.imports;
    if( options.css==="none" ){
        imports['element-ui/lib/theme-chalk/***'] = false;
        imports['element-plus/lib/components/*/style/***'] = false;
        imports['element-plus/theme-chalk/***'] = false;
        imports['#es-vue-web-application-style'] = false;
    }else if(options.css==="scss"){
        imports['element-ui/lib/theme-chalk/*.css'] = resolveComponent(options,'{basename}/style/index')
        imports['element-ui/lib/theme-chalk/submenu.css'] = resolveComponent(options,'sub-menu/style/index')
        imports['element-plus/lib/components/*/style/css'] = resolveComponent(options,'{0}/style/index')
    }else{
        imports['element-ui/lib/theme-chalk/*.css'] = resolveComponent(options,'{basename}/style/css')
        imports['element-ui/lib/theme-chalk/submenu.css'] = resolveComponent(options,'sub-menu/style/css')
    }
    
    if(options.importModuleFlag){
        imports['element-plus/lib/components/**'] = 'element-plus/es/components/{...}/{basename}/index';
        imports['element-plus/lib/components/**/*.*'] = 'element-plus/es/components/{...}/index';
        if(options.css==="scss"){
            imports['element-plus/lib/components/*/style/css'] = resolveComponent(options,'{0}/style/index')
        }else if(options.css!=="none" ){
            imports['element-plus/lib/components/*/style/css'] = resolveComponent(options,'{0}/style/css')
        }
    }
}

function mergeOptions(options){
    options = merge({}, defaultConfig, options);
    options.version = getVersion( options.version || 3 );
    if( String(options.version) < "3.0.0" ){
        options.metadata.vue = '2.0.0';
        options.metadata.version = '2.0.0';
        const imports =  options.resolve.imports;
        imports['element-plus/***']=false;
        if( options.css ==='none' ){
            imports['element-ui/lib/theme-chalk/***']=false;
            imports['#es-vue-web-application-style'] =false;
        }else if(options.css==="scss"){
            imports['element-ui/lib/theme-chalk/***']='element-ui/packages/theme-chalk/src/{basename}.scss';
            imports['#es-vue-web-application-style']='element-ui/lib/theme-chalk/src/base.scss';
        }else{
            imports['#es-vue-web-application-style']='element-ui/lib/theme-chalk/base.css';
        }
        if(options.uiFully){
            delete imports['element-ui/lib/theme-chalk/***'];
            delete imports['element-plus/***'];
            if(options.css==="scss"){
                imports['#es-vue-web-application-style']='element-ui/packages/theme-chalk/src/index.scss';
            }else if(options.css!=="none" ){
                imports['#es-vue-web-application-style']='element-ui/lib/theme-chalk/index.css';
            }
        }
        
    }else{
        options.reserved = [];
        options.metadata.vue = '3.0.0';
        options.metadata.version = '3.0.0';
        if(options.uiFully){
            const imports =  options.resolve.imports;
            if(options.css==="none" ){
                imports['element-ui/lib/theme-chalk/***'] = false;
                imports['element-plus/lib/components/*/style/***'] = false;
                imports['element-plus/theme-chalk/***'] = false;
                imports['#es-vue-web-application-style'] = false;
            }else if(options.css==="scss"){
                imports['#es-vue-web-application-style']='element-plus/theme-chalk/src/index.scss';
            }else{
                imports['#es-vue-web-application-style']='element-plus/theme-chalk/index.css';
            }
        }else{
            genMapping(options);
        }
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
        super(complier, mergeOptions(options));
        this.name = pkg.name;
        this.version = pkg.version;
        this.platform = 'client';
        this.importSourceQuery=new Map();
        registerError(complier.diagnostic.defineError, complier.diagnostic.LANG_CN, complier.diagnostic.LANG_EN );
    }

    addGlobRule(){
        super.addGlobRule();
        if(this.options.uiFully){
            this.addGlobUIFullyImports()
        }else if( String(this.options.version) >= "3.0.0"){
            this.addGlobUIImports();
        }
    }

    addGlobUIFullyImports(){
        const isV3 =  String(this.options.version) >= "3.0.0";
        const nameds = isV3 ? {
            'submenu':'SubMenu'
        } : {};
        const library = isV3 ? 'element-plus' : 'element-ui';
        this.glob.addRule(/^(element-ui\/packages|element-plus\/(lib|es)\/components|element-ui\/lib\/theme-chalk)\//i,(id, scheme)=>{
            if(id.endsWith('/style/index')||id.endsWith('/style/css')||id.includes('/lib/theme-chalk/')){
                return false;
            }
            let pos = id.lastIndexOf('/');
            let basename = id.substring(pos+1);
            let rule = scheme.rule;
            basename = nameds[basename] || toUpper(basename);
            if(isV3){
                rule.setValue(id, 'imported', `El${basename}`)
            }else{
                rule.setValue(id, 'imported', `${basename}`)
            }
            return library;
        },0,'imports');
    }

    addGlobUIImports(){
        const excludes = [
            'message-box', 'infinite-scroll','page-header','time-picker','date-picker','color-picker',
            'input-number','cascader-panel','check-tag','collapse-transition','config-provider','focus-trap','image-viewer',
            'roving-focus-group','select-v2','table-v2','tooltip-v2','tree-select','tree-v2','virtual-list','visual-hidden'
        ];
        const maps={
            'element-ui/packages/option':resolveComponent(this.options,'select/index'),
            'element-ui/packages/submenu':resolveComponent(this.options,'menu/index'),
            'element-ui/packages/step':resolveComponent(this.options,'steps/index'),
            'element-ui/packages/tab-pane':resolveComponent(this.options,'tabs/index'),
        }
        const nameds = {
            'submenu':'SubMenu'
        }
        const sourceRE = /^element-ui\/packages\/(([\w]+(-[\w]+)+)|option|submenu|step)$/i;
        this.glob.addRule((id)=>{
            if(sourceRE.test(id)){
                return !excludes.some(name=>id.endsWith(name));
            }
            return false;
        },(id, scheme)=>{
            let source = maps[id] || null;
            let pos = id.lastIndexOf('/');
            let basename = id.substring(pos+1);
            let rule = scheme.rule;
            if(!source){
                const component = basename.substring(0, basename.indexOf('-'))
                source = resolveComponent(this.options,component+'/index')
            }
            basename = nameds[basename] || toUpper(basename);
            rule.setValue(id, 'imported', `El${basename}`)
            return source;
        }, 0, 'imports');
    }

    resolveImportSource(id, ctx={}){
        const scheme = this.glob.scheme(id,ctx);
        let source = this.glob.parse(scheme, ctx);
        let rule = scheme.rule;
        if(rule){
            if(ctx.specifiers){
                const spe = ctx.specifiers[0];
                if(spe){
                    const imported = rule.getValue(id, 'imported');
                    if(imported){
                        spe.imported = spe.createIdentifierNode(imported);
                        spe.type = 'ImportSpecifier'
                    }else if(spe.local && rule.getValue(id, 'namespaced')===true){
                        delete spe.imported;
                        spe.type = 'ImportNamespaceSpecifier';
                    }
                }
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
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
    vueLoader:null,
    format:'default', //vue-raw vue-jsx vue-template
    rawJsx:{},
    exposes:{
        globals:['Math','Date'],
        exposeFilter:(name)=>!['window','document'].includes(name)
    },
    vueOptions:{
        __file:false,
        __ssrContext:false,
        __vccOpts:false,
        __asyncSetup:{
            mode:'none', //ssr nossr all none,
            filter:null,
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
    var key = 'element-ui/lib/theme-chalk/***';
    var value = 'element-plus/theme-chalk/el-{filename}.css';
    options.resolve.imports=merge({
        'element-ui/packages/**':resolveComponent(options,'{...}/{filename}/index'),
        'element-ui/packages/**/*.*':resolveComponent(options,'{...}/index'),
    }, options.resolve.imports);

    const replaces = {
        'el-select.css':'select.scss',
        'el-popper.css':'popper.scss',
        'el-scrollbar.css':'scrollbar.scss',
        'el-tag.css':'tag.scss',
        'el-input.css':'input.scss',
        'el-dialog.css':'dialog.scss',
        'el-overlay.css':'overlay.scss',
        'el-cascader.css':'cascader.scss',
        'el-cascader-panel.css':'cascader-panel.scss',
        'el-drawer.css':'drawer.scss',
        'el-icon.css':'icon.scss',
        'el-time-select.css':'time-select.scss',
        'el-time-picker.css':'time-picker.scss',
    };
    
    const imports = options.resolve.imports;
    imports[key] = value;
    imports['element-ui/lib/theme-chalk/submenu.css'] = false;
    imports['element-ui/lib/theme-chalk/select.css'] = false;
    imports['element-ui/lib/theme-chalk/cascader.css'] = false;
    imports['element-ui/lib/theme-chalk/dialog.css'] = false;
    imports['element-ui/lib/theme-chalk/drawer.css'] = false;
    imports['element-ui/lib/theme-chalk/input-number.css'] = false;
    imports['element-ui/lib/theme-chalk/time-picker.css'] = false;
    imports['element-ui/lib/theme-chalk/time-select.css'] = false;
    if( options.css==="none" ){
        imports[key] = false;
    }else{
        if(options.css==="scss"){
            value = 'element-plus/theme-chalk/src/{filename}.scss';
            Object.keys(replaces).forEach( key=>{
                imports[`element-plus/theme-chalk/${key}`] = `element-plus/theme-chalk/src/${replaces[key]}`;
            });
        }
    }
    if(options.importModuleFlag){
        imports['element-plus/lib/components/**'] = 'element-plus/es/components/{...}/{filename}/index';
        imports['element-plus/lib/components/**/*.*'] = 'element-plus/es/components/{...}/index';
    }
}

function mergeOptions(options){
    options = merge({}, defaultConfig, options);
    options.version = getVersion( options.version || 3 );
    if( String(options.version) < "3.0.0" ){
        options.metadata.vue = '2.0.0';
        options.metadata.version = '2.0.0';
        const imports =  options.resolve.imports;
        if( options.css ==='none' ){
            imports['element-ui/lib/theme-chalk/***']=null;
        }else if(options.css==="scss"){
            imports['element-ui/lib/theme-chalk/***']='element-ui/packages/theme-chalk/src/{filename}.scss';
        }
        imports['element-plus/***']=null;
    }else{
        options.reserved = [];
        options.metadata.vue = '3.0.0';
        options.metadata.version = '3.0.0';
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
        super(complier, mergeOptions(options));
        this.name = pkg.name;
        this.version = pkg.version;
        this.platform = 'client';
        registerError(complier.diagnostic.defineError, complier.diagnostic.LANG_CN, complier.diagnostic.LANG_EN );
    }

    addGlobRule(){
        super.addGlobRule();
        if( String(this.options.version) < "3.0.0" ){
            return;
        }
        const excludes = ['message-box', 'infinite-scroll','page-header','time-picker','date-picker','color-picker'];
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

    toString(){
        return pkg.name;
    }
}

PluginEsVue.toString=function toString(){
    return pkg.name;
}

module.exports = PluginEsVue;
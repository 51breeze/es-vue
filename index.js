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
        mapping:{
            folder:{}
        }
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

class PluginEsVue extends Core.Plugin{

    constructor(complier,options){
        options = merge({}, defaultConfig, options || {});
        options.version = getVersion( options.version || 3 );
        if( String(options.version) < "3.0.0" ){
            options.metadata.vue = '2.0.0';
            options.metadata.version = '2.0.0';
            if( options.css ==='none' ){
                options.resolve.mapping.folder['element-ui/lib/theme-chalk/****::asset']=null;
            }else if(options.css==="scss"){
                options.resolve.mapping.folder['element-ui/lib/theme-chalk/****::asset']='element-ui/packages/theme-chalk/src/%filename%.scss';
            }
            options.resolve.mapping.folder['element-plus/theme-chalk/****::asset']=null;
        }else{
            options.reserved = [];
            options.metadata.vue = '3.0.0';
            options.metadata.version = '3.0.0';
            var key = 'element-ui/lib/theme-chalk/****::asset';
            var value = 'element-plus/theme-chalk/el-%filename%.css';
            options.resolve.mapping.folder=merge({
                'element-ui/packages/****::asset':'element-plus/lib/components/%filename',
                'element-ui/packages/checkbox-group.*::asset':'element-plus/lib/components/checkbox/src/checkbox-group2',
                'element-ui/packages/checkbox-button.*::asset':'element-plus/lib/components/checkbox/src/checkbox-button',
                'element-ui/packages/radio-group.*::asset':'element-plus/lib/components/radio/src/radio-group2',
                'element-ui/packages/radio-button.*::asset':'element-plus/lib/components/radio/src/radio-button',
                'element-ui/packages/option.*::asset':'element-plus/lib/components/select/src/option',
                'element-ui/packages/option-group.*::asset':'element-plus/lib/components/option/src/option-group',
                'element-ui/packages/form-item.*::asset':'element-plus/lib/components/form/src/form-item2',
                'element-ui/packages/menu-item.*::asset':'element-plus/lib/components/menu/src/menu-item2',
                'element-ui/packages/menu-item-group.*::asset':'element-plus/lib/components/menu/src/menu-item-group2',
                'element-ui/packages/submenu.*::asset':'element-plus/lib/components/menu/src/sub-menu',
                'element-ui/packages/dropdown-menu.*::asset':'element-plus/lib/components/dropdown/src/dropdown-menu',
                'element-ui/packages/dropdown-item.*::asset':'element-plus/lib/components/dropdown/src/dropdown-item',
                'element-ui/packages/table-column.*::asset':'element-plus/lib/components/table/src/table-column',
                'element-ui/packages/timeline-item.*::asset':'element-plus/lib/components/timeline/src/timeline-item2',
                'element-ui/packages/collapse-item.*::asset':'element-plus/lib/components/collapse/src/collapse-item2',
                'element-ui/packages/skeleton-item.*::asset':'element-plus/lib/components/skeleton/src/skeleton-item2',
                'element-ui/packages/breadcrumb-item.*::asset':'element-plus/lib/components/breadcrumb/src/breadcrumb-item2',
                'element-ui/packages/carousel-item.*::asset':'element-plus/lib/components/carousel/src/carousel-item2',
                'element-ui/packages/descriptions-item.*::asset':'element-plus/lib/components/descriptions/src/description-item',
                'element-ui/packages/step.*::asset':'element-plus/lib/components/steps/src/item2',
                'element-ui/packages/tab-pane.*::asset':'element-plus/lib/components/tabs/src/tab-pane2',
            }, options.resolve.mapping.folder);
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
            if(options.css==="scss"){
                value = 'element-plus/theme-chalk/src/%filename%.scss';
                Object.keys(replaces).forEach( key=>{
                    options.resolve.mapping.folder[`element-plus/theme-chalk/${key}::asset`] = `element-plus/theme-chalk/src/${replaces[key]}`;
                });
            }
            options.resolve.mapping.folder[key] = value;
            options.resolve.mapping.folder['element-ui/lib/theme-chalk/submenu.css::asset'] = null;
            options.resolve.mapping.folder['element-ui/lib/theme-chalk/select.css::asset'] = null;
            if( options.css==="none" ){
                options.resolve.mapping.folder[key] = null;
                Object.keys(replaces).forEach( key=>{
                    options.resolve.mapping.folder[`element-plus/theme-chalk/${key}::asset`] = null;
                });
            }

            if( options.importModuleFlag ){
                const maps = options.resolve.mapping.folder;
                for(let key in maps){
                    const rule = maps[key]
                    if(rule && rule.includes('element-plus/lib/components/') ){
                        maps[key] = rule.replace('element-plus/lib/components/', 'element-plus/es/components/');
                    }
                }
                maps['element-plus/lib/components/****::asset'] = 'element-plus/es/components/%.../%filename';
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
    
        super(complier, options);

        this.name = pkg.name;
        this.version = pkg.version;
        this.platform = 'client';
        registerError(complier.diagnostic.defineError, complier.diagnostic.LANG_CN, complier.diagnostic.LANG_EN );

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
import Plugin from "./core/Plugin";
import {getOptions} from "@easescript/transform/lib/index";
import pkg from "../package.json";

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


function plugin(options={}){
    return new Plugin(
        pkg.esconfig.scope,
        pkg.version,
        getOptions(defaultConfig, options)
    )
}
export default plugin;
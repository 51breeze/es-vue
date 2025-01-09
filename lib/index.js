import Plugin from "./core/Plugin";
import {getOptions as _getOptions} from "@easescript/transform/lib/index";
import pkg from "../package.json";

const defaultConfig ={
    crossDependenciesCheck:true,
    hmrHandler:'module.hot',
    ssr:false,
    pageDir:'pages',
    localeDir:'locales',
    pageExcludeRegular:null,
    projectConfigFile:'.env',
    webpack:{
        enable:false,
        inlineStyleLoader:[]
    },
    resolve:{
        imports:{},
        folders:{}
    },
    metadata:{
        platform:"client",
        versions:{
            vue:"3.0.0"
        }
    },
    ui:{
        fully:false,
        //none sass css
        style:"sass",
        //esm cjs
        module:"cjs"
    },
    vue:{
        optimize:true,
        makeOptions:{
            file:false,
            ssrContext:true,
            vccOpts:false,
            asyncSetup:{
                mode:'none', //none ssr nossr all,
                filter:null,
            }
        },
        scopePrefix:'data-v-',
        exposes:{
            globals:['Math','Date'],
            exposeFilter:(name)=>!['window','document'].includes(name)
        }
    },
    importSourceQuery:{
        enabled:false,
        test:null,
        types:['component', 'styles'],
        query:{
            vue:''
        }
    }
};

function plugin(options={}){
    return new Plugin(
        pkg.esconfig.scope,
        pkg.version,
        getOptions(options)
    )
}

function getOptions(options={}){
    return _getOptions(defaultConfig, options);
}

export {Plugin, getOptions}

export default plugin;
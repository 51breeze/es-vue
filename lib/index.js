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
            ssrCtx:undefined,
            //if set to false, export the class component, otherwise export the vue-options.
            exportClass:true,
            //use async steup
            async:{
                //none ssr nossr all,
                mode:'none',
                //function({module,compilation,ssr}):boolean; 
                filter:null,
            }
        },
        scopePrefix:'data-v-',
        exposes:{
            globals:['Math','Date'],
            exposeFilter:(name)=>!['window','document'].includes(name)
        }
    },
    importFormation:{
        query:{
            enabled:false,
            test:null,
            attrs:{
                vue:''
            }
        },
        ext:{
            enabled:false,
            test:null,
            suffix:"{extname}.vue"
        }
    }
};

function plugin(options={}){
    options = getOptions(options);
    if(options.ssr){
        if(options.vue.makeOptions.ssrCtx !== false){
            options.vue.makeOptions.ssrCtx = true;
        }
    }
    return new Plugin(
        pkg.esconfig.scope,
        pkg.version,
        options
    )
}

function getOptions(...options){
    return _getOptions(defaultConfig, ...options);
}

export {Plugin, getOptions}

export default plugin;
const fs = require("fs");
const path = require("path");
const Builder = require("./core/Builder");
const Core = require("./core/Core");
const Polyfill = require("./core/Polyfill");
const {merge} = require("lodash");
const modules = new Map();
const loadStack=()=>{
    const dirname = path.join(__dirname,"stack");
    fs.readdirSync( dirname ).forEach( (filename)=>{
        const info = path.parse( filename );
        modules.set(info.name, require( path.join(dirname,filename) ) );
    });
}

const defaultConfig = merge({},Core.plugin.defaultConfig,{
    "styleLoader":null,
    "reserved":[
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
});

const configData = Object.assign({}, defaultConfig);
const package = require("./package.json");
const properties ={
    name:package.name,
    platform:'client',
    version:package.version,
    config(options){
        if(options){
            merge(configData, options);
        }
        return configData;
    },
    getPolyfill(name){
        return Polyfill.modules.get(name);
    },
    getStack(name){
        return modules.get(name) || Core.plugin.modules.get(name)
    },
    start(compilation, done, options){
        if(options)this.config(options);
        const builder = new Builder( compilation.stack );
        builder.name = this.name;
        builder.platform = this.platform;
        builder.start(done);
    },
    build(compilation, done, options){
        if(options)this.config(options);
        const builder = new Builder( compilation.stack );
        builder.name = this.name;
        builder.platform = this.platform;
        builder.build(done);
    }
}

function plugin(complier){
    const defaultOptions = {};
    if( modules.size === 0 ){
        const parent = new Core.plugin(complier);
        merge(defaultOptions, parent.config());
        loadStack();
    }
    this.complier = complier;
    const config = complier.options[this.name] || {};
    if( complier.options.commandLineEntrance ){
        defaultOptions.emitFile = true;
    }
    this.config( merge(defaultOptions,config) );
    //complier.options.annotations.push('Define');
    //complier.options.annotations.push('Injector');
    //complier.options.annotations.push('DOMAttribute');
    complier.loadTypes([require.resolve('./types/index.d.es')],true, null, true);
};

for(var name in properties){
    Object.defineProperty(plugin.prototype,name,{
        value:properties[name],
        enumerable:false,
        configurable:false
    });

    if( ['name','platform','version'].includes(name) ){
        Object.defineProperty(plugin,name,{
            value:properties[name],
            enumerable:false,
            configurable:false
        });
    }
}

Object.defineProperty(plugin,'modules',{
    value:modules,
    enumerable:true,
    configurable:false
});

module.exports = plugin;
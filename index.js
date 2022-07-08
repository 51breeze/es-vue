const fs = require("fs");
const path = require("path");
const Builder = require("./core/Builder");
const Core = require("./core/Core");
const Polyfill = require("./core/Polyfill");
const {merge} = require("lodash");
const modules = new Map( Core.plugin.modules );
const dirname = path.join(__dirname,"stack");
fs.readdirSync( dirname ).forEach( (filename)=>{
    const info = path.parse( filename );
    modules.set(info.name, require( path.join(dirname,filename) ) );
});

const defaultConfig ={
    "styleLoader":null,
    "webComponent":"vue",
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
};

const package = require("./package.json");
const key = Symbol('configKey');
const properties ={
    name:package.name,
    platform:'client',
    version:package.version,
    config(options){
        const data = this[key] || (this[key] = Object.create(defaultConfig));
        if(options){
            merge(data, options);
        }
        return data;
    },
    getPolyfill(name){
        return Polyfill.modules.get(name) || this.parent.getPolyfill(name);
    },
    getStack(name){
        return modules.get(name);
    },
    start(compilation, done, options){
        if(options)this.config(options);
        const builder = new Builder( compilation.stack );
        builder.name = this.name;
        builder.platform = this.platform;
        builder.plugin = this;
        builder.start(done);
    },
    build(compilation, done, options){
        if(options)this.config(options);
        const builder = new Builder( compilation.stack );
        builder.name = this.name;
        builder.platform = this.platform;
        builder.plugin = this;
        builder.build(done);
    }
}

function plugin(complier){
    this.parent = new Core.plugin(complier);
    this.complier = complier;
    const config = complier.options[this.name] || {};
    if( complier.options.commandLineEntrance ){
        config.emitFile = true;
    }
    this.config( this.parent.config(config) );
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
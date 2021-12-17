const fs = require("fs");
const path = require("path");
const Builder = require("./core/Builder");
const Core = require("./core/Core");
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
const properties ={
    name:'vue-js',
    platform:'client',
    version:require("./package.json").version,
    config(options){
        if(options){
            merge(configData, options);
        }
        return configData;
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
    if( modules.size === 0 ){
        Core.plugin.loadStack();
        loadStack();
    }
    this.complier = complier;
    complier.loadTypes([require.resolve('./types/index.d.es')],true)
};

for(var name in properties){
    Object.defineProperty(plugin.prototype,name,{
        value:properties[name],
        enumerable:false,
        configurable:false
    });
}

Object.defineProperty(plugin,'modules',{
    value:modules,
    enumerable:true,
    configurable:false
});

Core.plugin.extend(properties);

module.exports = plugin;
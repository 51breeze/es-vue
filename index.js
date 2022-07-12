const fs = require("fs");
const path = require("path");
const Builder = require("./core/Builder");
const Core = require("./core/Core");
const {merge} = require("lodash");
const modules = new Map();
const dirname = path.join(__dirname,"tokens");
fs.readdirSync( dirname ).forEach( (filename)=>{
    const info = path.parse( filename );
    modules.set(info.name, require( path.join(dirname,filename) ) );
});

const defaultConfig ={
    "styleLoader":[],
    "sourceMaps":false,
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

const pkg = require("./package.json");

class Plugin extends Core.Plugin{

    constructor(complier,options){
        super(complier, merge({}, defaultConfig, options || {}));
        this.name = pkg.name;
        this.version = pkg.version;
        this.platform = 'client'; 
        complier.loadTypes([require.resolve('./types/index.d.es')],true, null, true);

        console.log( this.options )
    }

    getTokenNode(name, flag=false){
        if( flag ){
            return super.getTokenNode(name);
        }
        return modules.get(name) || super.getTokenNode(name);
    }

    getBuilder( compilation ){
        const builder = new Builder( compilation.stack );
        builder.name = this.name;
        builder.platform = this.platform;
        builder.plugin = this;
        return builder;
    }
}

module.exports = Plugin;
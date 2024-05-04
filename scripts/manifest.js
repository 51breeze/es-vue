const path = require('path');
const Compiler = require("easescript/lib/core/Compiler");
Compiler.buildTypesManifest(
    [
        path.resolve('./types/index.d.es'),
        path.resolve("./types/web/Store.es"),
        path.resolve("./types/web/Lang.es"),
    ], 
    {
        name:'es-vue', 
        inherits:['es-javascript']
    },
    './types'
);
const path = require("path");
const Core = require("./Core");
const v2Modules = new Map();
Core.Polyfill.createEveryModule(v2Modules, path.join(__dirname,"../","polyfill/v2"));

const v3Modules = new Map();
Core.Polyfill.createEveryModule(v3Modules, path.join(__dirname,"../","polyfill/v3") );

module.exports={
    path:path.join(__dirname,"../","polyfill"),
    v3Modules,
    v2Modules,
}
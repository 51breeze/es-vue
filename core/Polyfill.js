const path = require("path");
const Core = require("./Core");
const dirname = path.join(__dirname,"../","polyfill");
const modules = new Map();
Core.polyfill.createEveryModule(modules, dirname);
module.exports={
    path:dirname,
    modules:modules,
}
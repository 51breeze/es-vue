const Core = require("../core/Core");
const _JSXElement = Core.plugin.modules.get('JSXElement')
function JSXElement(ctx, stack){
    return _JSXElement(ctx, stack);
}
module.exports = JSXElement;
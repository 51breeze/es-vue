const Utils = require('../core/Utils')
module.exports = function(ctx,stack){
    return Utils.createThisNode(ctx, stack);
}
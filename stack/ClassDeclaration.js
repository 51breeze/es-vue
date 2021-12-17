const Core = require("../core/Core");
const VueClass = require("../core/VueClass");
const _ClassDeclaration = Core.plugin.modules.get('ClassDeclaration');
class ClassDeclaration extends _ClassDeclaration{
    emitter(){
        const module = this.module;
        if( this.isInheritWebComponent( module ) ){
            const obj = new VueClass( this.stack );
            obj.name = this.name;
            obj.platform = this.platform;
            return obj.emitter();
        }else{
            return super.emitter();
        }
    }
}

module.exports = ClassDeclaration;
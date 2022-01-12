
const Core = require("../core/Core");
const VueClass = require("../core/VueClass");
const SkinClass = require("../core/SkinClass");
const _JSXElement = Core.plugin.modules.get('JSXElement')
class JSXElement extends _JSXElement{

    getElementConfig(){
        return {
            props:{},
            attrs:{},
            on:{},
            nativeOn:{},
            slot:void 0,
            scopedSlots:{},
            domProps:{},
            key:void 0,
            ref:void 0,
            refInFor:void 0,
            tag:void 0,
            staticClass:void 0,
            class:void 0,
            staticStyle:{},
            style:{},
            staticStyle:{},
            hook:{},
            transition:{}
        };
    }

    createAttributes( data, spreadAttributes ){
        this.stack.openingElement.attributes.forEach(item=>{
            if( item.isAttributeXmlns || item.isAttributeDirective ){
                return;
            }else if( item.isJSXSpreadAttribute ){
                spreadAttributes && spreadAttributes.push( this.make( item ) );
                return;
            }
            const [name,value,ns] = this.make( item );
            if( !value )return;
            if( ns ==="@events" ){
                data['on'][name] = value;
                return;
            }else if( ns ==="@natives" ){
                data['nativeOn'][name] = value;
                return;
            }else if( ns ==="@binding" ){
                data['on']['input'] = `(function(event){${value}=event && event.target && event.target.nodeType===1 ? event.target.value : event;}).bind(this)`;
            }
            if( item.isMemberProperty ){
                data.props[name] = value;
                return;
            }
            switch(name){
                case "class" :
                case "style" :
                case "key" :
                case "ref" :
                case "refInFor" :
                case "tag" :
                case "hook" :
                case "staticClass" :
                    data[name] = value;
                    break;
                case "innerHTML" :
                case "value" :   
                    data['domProps'][name] = value;
                default:
                    data.attrs[name] = value;
            }
        });
    }
    
    makeClass(children, data, level){
        const module = this.module;
        const properties = [];
        const props = data.props;
        for( var name in props ){
            properties.push(`${name} = ${props[name]}`);
        }
        const obj =  this.factory( this.stack.isSkinComponent ? SkinClass : VueClass, this.stack );
        const classContent = obj.emitter( this.getRenderMethod( children, data, level ) , properties);
        if( module.isFragment ){
            return `(function(){\r\n\t\t${classContent.replace(/([\r\n\t]+)/g,'$1\t\t')}\r\n\t}())`;
        }
        return classContent;
    }
}

module.exports = JSXElement;
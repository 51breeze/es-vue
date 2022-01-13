
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
            show:void 0,
            staticStyle:{},
            style:{},
            staticStyle:{},
            hook:{},
            model:{},
            transition:{},
            directives:[]
        };
    }

    createAttributes( data, spreadAttributes ){

        const pushEvent=(name,callback, category)=>{
            const events =  data[ category ];
            if( events[name] ){
                if( !Array.isArray( events[name] ) ){
                    events[name] = [ events[name] ];
                }
                if( !events[name].includes( callback ) ){
                    events[name].push( callback );
                }
            }else{
                events[name] = callback;
            }
        }

        const toFun = (item,content)=>{
            if( item.value.isJSXExpressionContainer ){
                const expr = item.value.expression;
                if( expr.isAssignmentExpression ){
                    return `(function(){${content}}).bind(this)`
                }
            }
            return content;
        }

        this.stack.openingElement.attributes.forEach(item=>{
            if( item.isAttributeXmlns || item.isAttributeDirective ){
                if( item.isAttributeDirective ){
                    const name = item.name.value();
                    if( name === 'show'){
                       data.directives.push({name:`'show'`, value:this.make( item.valueArgument.expression )});
                    }
                }
                return;
            }else if( item.isJSXSpreadAttribute ){
                spreadAttributes && spreadAttributes.push( this.make( item ) );
                return;
            }
            let [name,value,ns] = this.make( item );
            if( !value )return;

            if(ns && ns.includes('::') ){
                let [seg,className] = ns.split('::',2);
                ns = seg;
                const moduleClass = this.getModuleReferenceName( this.getModuleById(className) );
                name = `[${moduleClass}.${name}]`;
            }

            if( ns ==="@events" ){
                pushEvent( name, toFun(item,value), 'on')
                return;
            }else if( ns ==="@natives" ){
                pushEvent( name, toFun(item,value), 'nativeOn')
                return;
            }else if( ns ==="@binding" ){
                data.directives.push({name:`'model'`, value:value});
                pushEvent('input',`(function(event){${value}=event && event.target && event.target.nodeType===1 ? event.target.value : event;}).bind(this)`, 'on');
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
                    data['domProps'][name] = value;
                    break;
                case "value" :
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
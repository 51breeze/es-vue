
const Core = require("../core/Core");
const VueClass = require("../core/VueClass");
const SkinClass = require("../core/SkinClass");
const _JSXElement = Core.plugin.modules.get('JSXElement')
class JSXElement extends _JSXElement{
    
    makeClass(children, data, level){
        const module = this.module;
        let element = children && children.length > 0 ?  this.makeChildren(children, children.length > 1 ? {} : data,level) : null;
        if( children.length > 1 ){
            const _data = this.makeProperty(data,level);
            const handle = this.getJsxCreateElementHandle();
            element =  `${handle}('div', ${_data}, ${element})`
        }

        const properties = [];
        const props = data.props;
        for( var name in props ){
            properties.push(`${name} = ${props[name]}`);
        }

        const references = [];
        references.push( this.emitVueCreateElement() );

        let classContent = ``;
        const render = (context)=>{
            const indent = this.getIndent(level-1);
            references.push( `${indent}\treturn ${element};` );
            return `function render(){\r\n${references.join('\r\n')}\r\n${indent}}`;
        };
        
        const makeClass = this.stack.isSkinComponent ? SkinClass : VueClass;
        const makeObj = new makeClass( this.stack );
        makeObj.name = this.name;
        makeObj.platform = this.platform;
        classContent = makeObj.emitter(render , properties);

        if( module.isFragment ){
            return `(function(){\r\n\t\t${classContent.replace(/([\r\n\t]+)/g,'$1\t\t')}\r\n\t}())`;
        }
        return classContent;
    }

  
}

module.exports = JSXElement;
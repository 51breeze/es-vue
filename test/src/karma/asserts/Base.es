package karma.asserts;

import web.components.Component;

class Base {
    protected component:Component;
    constructor(component:Component){
        this.component = component;
    }

    get element():HTMLElement{
        return this.component.getAttribute<HTMLElement>('el')
    }

    toString():string{
       return this.element.innerHTML;
    }

    getElementType( el:HTMLElement ){
        return el.nodeName.toLowerCase();
    }

    getChildren( el:HTMLElement ){
        return Array.from( el.childNodes.values() );
    }


}
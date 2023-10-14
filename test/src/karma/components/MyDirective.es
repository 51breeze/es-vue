package karma.components;

import web.components.Directive;
import web.components.Component;

class MyDirective implements Directive {

      // @Main
      // static main(){
      //       Component.directive(  System.getQualifiedClassName(MyDirective), new MyDirective() );
      // }

      created(el){
            console.log( el , '----------MyDirective-------------')
            el.focus();
      }
}
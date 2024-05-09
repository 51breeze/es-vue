package karma.asserts;

import web.components.Component;
import karma.asserts.Base;
import karma.components.Directive; 
import web.events.ComponentEvent;

class DirectiveAssert extends Base {

    constructor(component:Component){
        super(component);
        this.start();
    }

    start(){
      const app = this.component as Directive;
      describe('test Home page',()=>{
          it('test Directive',()=>{
                const ifEl = this.element.querySelector('.if-condition');
                const ifElNodes = Array.from( ifEl && ifEl.childNodes ).filter( node=>!(node.nodeType==8 || node.nodeType==3) );
                expect( 3 ).toEqual( ifElNodes.length );
                const showEl = this.element.querySelector('.show');
                const showElNodes = Array.from( showEl?.childNodes ).filter( node=>!(node.nodeType==8 || node.nodeType==3) );
                expect( 3 ).toEqual( showElNodes.length );
                app.addEventListener( ComponentEvent.UPDATED, ()=>{
                  const ifElNodes = Array.from( ifEl?.childNodes ).filter( node=>!(node.nodeType==8 || node.nodeType==3) );
                  const showElNodes = Array.from( showEl?.childNodes ).filter( node=>!(node.nodeType==8 || node.nodeType==3) );

                   console.log( app.condition, '------------app.condition----------------' )

                  expect( 0 ).toEqual( ifElNodes.length );
                  expect( 3 ).toEqual( showElNodes.length );
                  console.log( showElNodes, '------------showElNodes----------------' )
                  for( let index=0; index< showElNodes.length; index++ ){
                    const child = showElNodes[index] as HTMLElement;
                    expect('display: none;').toEqual( child.style.cssText );
                  }
                  app.removeEventListener( ComponentEvent.UPDATED )
                });
                app.condition = false;
          });
      })

    }
  
}
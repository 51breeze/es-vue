package karma.asserts;

import web.components.Component;
import karma.asserts.Base;
import web.events.ComponentEvent;
import karma.pages.Home as AppHome;
import karma.components.List;
import karma.Manger;

class ListAssert extends Base {

    constructor(component:Component){
        super(component);
        Manger.getInstance().addAssert( this );
        this.start();
    }

    start( ){
        const app= this.component as AppHome;
        describe('test List page',()=>{

            it('title',()=>{
                expect('div').toBe( this.getElementType( this.element ) );
            });
            
        });

    }
}
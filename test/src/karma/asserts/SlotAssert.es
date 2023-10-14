package karma.asserts;

import web.components.Component;
import karma.asserts.Base;
import karma.components.Slot; 

class SlotAssert extends Base {

    constructor(component:Component){
        super(component);
        this.start();
    }

    start(){
      const app = this.component as Slot;
      it('test slot content',()=>{
            const items = this.component.getRefs<HTMLElement[]>('item');
            expect( app.items.length ).toBe( Array.isArray(items) ? items.length : null );
      })
    }
}
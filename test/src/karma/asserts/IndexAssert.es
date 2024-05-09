package karma.asserts;

import web.components.Component;
import karma.asserts.Base;
import karma.Index as BootstrapIndex;
import web.events.ComponentEvent;
import karma.Manger;

import karma.asserts.ListAssert;
import karma.asserts.HomeAssert;

class IndexAssert extends Base {

    constructor(component:Component){
        super(component);
        this.start();
    }

    start(){

        const app = this.component as BootstrapIndex;

        describe('test main Index',()=>{

            

            it('title',()=>{
                expect('div').toBe( this.getElementType( this.element ) );
                const title = this.element.querySelector<HTMLElement>('.title')
                expect('h5').toBe( this.getElementType(title) );
                expect( app.title ).toBe( title?.textContent );
            });

            it('menus',()=>{
                const menus = this.element.querySelector<HTMLElement>('.menus');
                const routes = app.router.getRoutes();
                 const childNodes = Array.from( menus?.childNodes ).filter( node=>!(node.nodeType==8 || node.nodeType==3) );
                expect(routes.length ).toBe(childNodes.length );
                childNodes.forEach( (child,index)=>{
                    const el = child as HTMLElement;
                    expect('a').toBe( this.getElementType( el ) );
                    expect( routes[index].path ).toEqual( el.getAttribute('href')?.replace('#','') );
                    expect( routes[index].name ).toEqual( el.textContent );
                });
            });

        });  


        describe('test main Index',()=>{
            const menus = app.getRefs<Component[]>('menu', true);
            const els = menus.map( menu=> menu['$el'] );
            if( els.length > 0 ){
                els[0].click();
                it('to home page',(done)=>{
                    setTimeout(()=>{
                        const el = document.querySelector('div[data-title="home"]');
                        expect( !!el ).toBeTrue();
                        done();
                    },500);
                })
            }else{
               throw new Error('Menus item is empty.');
            }
        });

    }
}
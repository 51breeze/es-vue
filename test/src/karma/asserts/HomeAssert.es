package karma.asserts;

import web.components.Component;
import karma.asserts.Base;
import web.events.ComponentEvent;
import karma.pages.Home as AppHome;
import karma.components.List;
import karma.Manger;

class HomeAssert extends Base {

    constructor(component:Component){
        super(component);
        Manger.getInstance().addAssert( this );
        this.start();
    }

    start( ){
        const app= this.component as AppHome;
        app.removeEventListener( ComponentEvent.UPDATED );

        describe('test Home page',()=>{

            console.log('----------------Home--------test------------')

            it('title',()=>{
                expect( 'home' ).toBe( this.element.getAttribute('data-title') )
                const title = app.getRefs('title') as HTMLElement;
                expect( app.title ).toBe( title.textContent ); 
            });

            it('add item and update props to child components',(done)=>{

                const list = app.getRefs('list') as List;
                const callback = ()=>{
                    app.removeEventListener( ComponentEvent.UPDATED );
                    app.addEventListener( ComponentEvent.UPDATED, ()=>{
                        const title = app.getRefs('title') as HTMLElement;
                        expect( app.title ).toBe( title.textContent );
                        expect( 1 ).toBe( list.items.length );
                        expect( 'three' ).toBe( list.items[0].label );
                        const listEl = list.getAttribute('el') as HTMLElement;
                        const listArray = list.items;
                        const children = listEl.querySelectorAll('.for-way1 > span');
                        expect( listArray.length ).toBe( children.length );
                        children.forEach( (child,index)=>{
                            expect(listArray[index].label).toEqual(child.textContent)
                        });

                        const from_data_account_el = listEl.querySelector('.from-data > .account');
                        expect('account:account').toEqual( from_data_account_el && from_data_account_el.textContent );

                        const from_data_password_el = listEl.querySelector('.from-data > .password');
                        expect('password:password').toEqual( from_data_password_el && from_data_password_el.textContent );

                        const from_data_type_el = listEl.querySelector('.from-data > .type');
                        expect('type:email').toEqual( from_data_type_el && from_data_type_el.textContent );
                        app.removeEventListener( ComponentEvent.UPDATED );
                        done();
                    });

                    app.addItem({label:"five"});
                    app.title = 'test home page 1';
                    app.title = 'test home page 2';
                    app.title = 'test home page 3';
                    app.title = 'test home page props';
                    app.setType('email123');
                }

                const slotOne = app.getRefs<Component>('slot-component-1');
                const slotTwo = app.getRefs<Component>('slot-component-2');

                slotOne.addEventListener(ComponentEvent.UPDATED,()=>{
                    const items = slotOne.getAttribute<HTMLElement>('el').querySelectorAll<HTMLElement>('.content div')
                    expect( app.list.length ).toEqual( items.length );
                    app.list.forEach( (item,index)=>{
                        expect( `default: ${item.label}` ).toEqual( items[index].textContent );
                    });
                });

                slotTwo.addEventListener(ComponentEvent.UPDATED,()=>{
                    const items = slotTwo.getAttribute<HTMLElement>('el').querySelectorAll<HTMLElement>('.content div')
                    expect( app.list.length ).toEqual( items && items.length );
                    app.list.forEach( (item,index)=>{
                        const el = items[index] as HTMLElement;
                        expect( `definition: ${item.label}` ).toEqual( el.textContent );
                    });
                });

                var app_update_count = 0;
                var list_update_count = 0;
                app.addEventListener( ComponentEvent.UPDATED, ()=>{

                    expect( 1 ).toBe( ++app_update_count );

                    const title = app.getRefs('title') as HTMLElement;
                    const listEl = list.getAttribute('el') as HTMLElement;
                    expect( app.title ).toBe( title.textContent );
                    expect( app.list.length ).toBe( list.items.length );
                    expect( true ).toBe( listEl.classList.contains('list') );
                    const ListComTileEl = list.getRefs<HTMLElement>('title');
                    expect( app.title ).toBe( ListComTileEl.textContent );

                    const listArray = app.list;
                    const children = listEl.querySelectorAll('.for-way1 > span');
                    expect( listArray.length ).toBe( children.length );
                    children.forEach( (child,index)=>{
                        expect( listArray[index].label ).toEqual(child.textContent)
                    });

                    const way1Items = list.getRefs<HTMLElement[]>('way1-item');
                    expect( listArray.length ).toBe( way1Items && way1Items.length );

                    const children2 = listEl.querySelectorAll('.for-way2 > span');
                    expect( listArray.length ).toBe( children2.length );
                    children2.forEach( (child,index)=>{
                        expect( `${listArray[index].label}-${index}` ).toEqual(child.textContent)
                    });

                    const children3 = listEl.querySelectorAll('.for-way3 > span');
                    expect( listArray.length ).toBe( children3.length );
                    children3.forEach( (child,index)=>{
                        expect( `${listArray[index].label}-${index}` ).toEqual(child.textContent)
                    });

                    const children4 = listEl.querySelector('.for-way4');
                    expect( listArray.map( (item,index)=>`${item.label}-${index}` ).join('') ).toEqual( children4 && children4.textContent)

                    const from_data_account_el = listEl.querySelector('.from-data > .account');
                    expect('account:account').toEqual( from_data_account_el && from_data_account_el.textContent );

                    const from_data_password_el = listEl.querySelector('.from-data > .password');
                    expect('password:password').toEqual( from_data_password_el && from_data_password_el.textContent );

                    const slotOne = app.getRefs<Component>('slot-component-1');
                    expect(`Slot component: default`).toEqual(slotOne.getAttribute<HTMLElement>('el').querySelector('.head > h3').textContent)

                    expect(`<div>footer default children</div>`).toEqual(slotOne.getAttribute<HTMLElement>('el').querySelector('.footer').innerHTML )

                    const slotTwo = app.getRefs<Component>('slot-component-2');
                    expect(`Slot component: definition`).toEqual(slotTwo.getAttribute<HTMLElement>('el').querySelector('.head > h3').textContent)

                    const slotTwo_Item = app.getRefs<HTMLElement[]>('slot-item');
                    expect( app.list.length ).toEqual( slotTwo_Item.length );
                    app.list.forEach( (item,index)=>{
                        const el = slotTwo_Item[index];
                        expect( `definition: ${item.label}` ).toEqual( el.textContent );
                    });
                    
                    list.addEventListener(ComponentEvent.UPDATED,()=>{

                        expect( 1 ).toBe( ++list_update_count );

                        const items = list.items;
                        expect( 1 ).toBe( items.length );
                        expect( items[0] && items[0].label ).toEqual( children.item(0) && children.item(0).textContent )
                        expect( list.title ).toEqual( ListComTileEl && ListComTileEl.textContent  )

                        const from_data_account_el = listEl.querySelector('.from-data > .account');
                        expect('account:account').toEqual( from_data_account_el && from_data_account_el.textContent );

                        const from_data_type_el = listEl.querySelector('.from-data > .type');
                        expect('type:email').toEqual( from_data_type_el && from_data_type_el.textContent );

                        //slotOne.removeEventListener(ComponentEvent.UPDATED)
                        //slotTwo.removeEventListener(ComponentEvent.UPDATED)
                        list.removeEventListener(ComponentEvent.UPDATED)
                        callback();

                    });

                    list.items = [ {label:'three'} ]
                    list.title = 'List Component 999999999999';
                    list.title = 'List Component';
                    type T = typeof list.fromData;
                    list.fromData = Object.assign( {} as T, list.fromData );
                    list.fromData.type='email';
                    list.fromData.check='checked123';
                    
                });

                app.addItem({label:"one"});
                app.addItem({label:"two"});

                app.title = 'test home 1';
                app.title = 'test home 2';
                app.title = 'test home title 123';

            })
        });

    }
}
package;

import PersonSkin;
import Test;
import web.components.Router;
import web.components.Viewport;
import Person;
import MyView;
import MySkin;
import web.components.Component;

@import(VueRouter='vue-router')

class Index{

    @main
    static main(){

        // describe('router view', () => {
        //     const index = new Index();
        //     index.testRouterClass();
        //     index.testRouterView();
        // });

        const index = new Index();

        var v = new MyView();
        v.skinClass = MySkin;

      //  new web.components.Router()

        //throw new Error('ss')
       

        var map = new Map<string,object>();
        map.set('name', {});

        var set = new Set<MyView>();
        set.add( v );


        var it = Array.from( set.values() )

        var en =  map.entries()

        for(var item of en ){
            var b = item[0]

        }


        console.log( map.size, set.size, Array.from<MyView,MyView>( set.values() ) )

       // map


         index.instance.childElements = v.render() as Node;



         index.display();


         index.test().then( (v)=>{
            console.log( `async result ${v}` );
            (console as {bsd:()=>void}).bsd(11111)
         })

      
    }

    async test(){
        var b = await load();
        console.log('=====test async==========')
        return b;

    }

    async load(){
        return new Promise( (resoval)=>{
                setTimeout(()=>{
                    resoval(1000);
                },5000);
        })
        
    }


    display(){
        this.instance.value = "深圳"
        this.instance.mount('#app');

        setTimeout(()=>{
            const vm = this.instance as {$router:Router,$el:Node};
            //vm.$router.push({path:'index'});
        },1000);
    }

    get router(){
        return new Router({
                routes:[
                    {
                        path:"/index",
                        component:Person
                    },
                    {
                        path:"/test",
                        component:PersonSkin
                    }
                ]
        });
    }

    private var _instance:Test = null;

    get instance(){
        if( this._instance ){
            return this._instance;
        }

        this._instance = new Test({
            router:this.router
        });
        return this._instance;
    }

    testRouterClass(){
        it("should VueRouter eq Router ",()=>{
            expect( VueRouter ).toBe( Router );
        })
    }
    
    test8(...args:number[]){

    }

    testRouterView(){

       // const div = document.createElement('div');
        //document.body.appendChild( div )


        this.instance.mount();
        it('should router page view', () => {
            this.instance.name = "标题名称";
            setTimeout(()=>{
                const vm = this.instance as {$el:Node};
                expect( vm.$el.textContent ).toContain( '标题名称' );
                expect( vm.$el.textContent ).toContain( '深圳' );
                expect( vm.$el.textContent ).toContain( '点击这里提示' );
                expect( vm.$el.textContent ).toContain( '测试页面' );
                expect( vm.$el.textContent ).toContain( '首页面' );
            },100)
        })


        it('should router page view', (done) => {
            const vm = this.instance as {$router:Router,$el:ParentNode};
            vm.$router.push({path:'index'});
            setTimeout(()=>{
                expect( vm.$el.textContent ).toContain( 'the is PersonSkin child' );
                expect( vm.$el.textContent ).toContain( 'the scope value:onetwothreefourfive' );
                const el = vm.$el.querySelector('#person-root-child');
                expect( 'Person page' ).toContain( el.textContent );
                done();
                
            },100)
        })

    }
    

}
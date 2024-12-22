import Class from "./Class.js";
import Application from "./web/Application.js";
import System from "./System.js";
import Router from "./web/components/Router.js";
import Person from "./Person.js";
import PersonSkin from "./PersonSkin.js";
function Index(){
    Application.apply(this,arguments);
}
Class.creator(Index,{
    m:513,
    name:"Index",
    inherit:Application,
    methods:{
        main:{
            m:800,
            value:function main(){
                setTimeout(()=>{
                    const index = new Index();
                    index.mount('#app');
                },100);
            }
        }
    },
    members:{
        render:{
            m:544,
            value:function render(){
                return createVNode(Test);
            }
        },
        router:{
            m:576,
            enumerable:true,
            get:function router(){
                return new Router({
                    mode:'hash',
                    routes:[{
                        path:"/index",
                        component:Person
                    },{
                        path:"/test",
                        component:PersonSkin
                    }]
                });
            }
        }
    }
});
System.setImmediate(()=>Index.main());
export default Index;
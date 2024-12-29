import Class from "./Class.js";
import {createVNode} from "vue";
import Application from "./web/Application.js";
import System from "./System.js";
import Test from "./Test.js";
import Router from "./web/components/Router.js";
import Person from "./Person.js";
import PersonSkin from "./PersonSkin.js";
import Component from "./web/components/Component.js";
import dev_tools_HMR from "./dev/tools/HMR.js";
function Index(){
    Application.call(this,arguments[0]);
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
            },
            configurable:true
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
            },
            configurable:true
        }
    }
});
System.setImmediate(()=>Index.main());
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("4f0caf29",Index)){
        dev_tools_HMR.reload("4f0caf29",Index)
    }
}
export default Component.createComponent(Index,{
    name:"es-Index",
    __hmrId:"4f0caf29"
});
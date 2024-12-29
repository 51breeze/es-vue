import "./../../asstes/karma/ui/Layout-83da7b49.js";
import Class from "./../../Class.js";
import {createVNode} from "vue";
import Component from "./../../web/components/Component.js";
import Manger from "./../Manger.js";
import Sidebar from "./Sidebar.js";
import Viewport from "./../../web/components/Viewport.js";
import dev_tools_HMR from "./../../dev/tools/HMR.js";
function Layout(){
    Component.call(this,arguments[0]);
}
Class.creator(Layout,{
    m:513,
    ns:"karma.ui",
    name:"Layout",
    inherit:Component,
    members:{
        render:{
            m:544,
            value:function render(){
                const routes = Manger.getInstance().get("routes");
                console.log('-----Layout render-----');
                return createVNode("div",{
                    class:'app',
                    style:{
                        display:"flex"
                    }
                },[
                    createVNode(Sidebar,{
                        routes:routes,
                        width:220
                    }),
                    createVNode("div",{
                        class:'right'
                    },[
                        createVNode("div",{
                            class:"container"
                        },[
                            createVNode(Viewport)
                        ])
                    ])
                ]);
            },
            configurable:true
        }
    }
});
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("7b2d658c",Layout)){
        dev_tools_HMR.reload("7b2d658c",Layout)
    }
}
export default Component.createComponent(Layout,{
    name:"es-Layout",
    __hmrId:"7b2d658c"
});
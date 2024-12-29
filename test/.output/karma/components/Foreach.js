import "element-plus/lib/components/button/style/css";
import Class from "./../../Class.js";
import {createVNode,withCtx,Fragment} from "vue";
import Component from "./../../web/components/Component.js";
import web_ui_Button from "element-plus/lib/components/button";
import dev_tools_HMR from "./../../dev/tools/HMR.js";
const _private = Class.getKeySymbols("05373d75");
function Foreach(){
    Component.call(this,arguments[0]);
    Object.defineProperty(this,_private,{
        value:{}
    });
    Object.defineProperties(this[_private],{
        infiniteCount:{
            get:()=>this.reactive("infiniteCount",void 0,()=>10),
            set:(value)=>this.reactive("infiniteCount",value)
        }
    });
}
Class.creator(Foreach,{
    m:513,
    ns:"karma.components",
    name:"Foreach",
    private:_private,
    inherit:Component,
    members:{
        infiniteCount:{
            m:2056,
            writable:true,
            value:10
        },
        render:{
            m:544,
            value:function render(){
                return createVNode(Fragment,null,[
                    createVNode("div",null,["1"]),
                    createVNode("div",null,["2"]),
                    createVNode(web_ui_Button,null,{
                        default:withCtx(()=>["sssss"])
                    })
                ]);
            },
            configurable:true
        }
    }
});
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("05373d75",Foreach)){
        dev_tools_HMR.reload("05373d75",Foreach)
    }
}
export default Component.createComponent(Foreach,{
    name:"es-Foreach",
    __hmrId:"05373d75"
});
import "element-plus/lib/components/infinite-scroll/style/css";
import Class from "./../../Class.js";
import {createVNode,withDirectives} from "vue";
import Component from "./../../web/components/Component.js";
import System from "./../../System.js";
import dev_tools_HMR from "./../../dev/tools/HMR.js";
import web_ui_InfiniteScroll from "element-plus/lib/components/infinite-scroll";
const _private = Class.getKeySymbols("4285668c");
function DirectiveTop(){
    Component.call(this,arguments[0]);
    Object.defineProperty(this,_private,{
        value:{}
    });
    Object.defineProperties(this[_private],{
        infiniteCount:{
            get:()=>this.reactive("infiniteCount",void 0,()=>0),
            set:(value)=>this.reactive("infiniteCount",value)
        }
    });
}
Class.creator(DirectiveTop,{
    m:513,
    ns:"karma.components",
    name:"DirectiveTop",
    private:_private,
    inherit:Component,
    members:{
        infiniteCount:{
            m:2056,
            writable:true,
            value:0
        },
        loadList:{
            m:2080,
            value:function loadList(){
                console.log('----DirectiveTop loadList------',this[_private].infiniteCount);
                this[_private].infiniteCount+=2;
            },
            configurable:true
        },
        render:{
            m:544,
            value:function render(){
                return [
                    withDirectives(createVNode("ul",{
                        "infinite-scroll-disabled":this[_private].infiniteCount > 20,
                        "infinite-scroll-distance":5,
                        class:"infinite-list",
                        style:"overflow: auto"
                    },System.forMap(this[_private].infiniteCount,(i,key)=>createVNode("li",{
                        key:i,
                        class:"infinite-list-item"
                    },[
                        "DirectiveTop: infinite-scroll ",
                        i
                    ]))),[
                        Component.resolveDirective({
                            name:"infinite-scroll",
                            directiveClass:web_ui_InfiniteScroll,
                            value:this.loadList.bind(this)
                        },this)
                    ])
                ];
            },
            configurable:true
        }
    }
});
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("4285668c",DirectiveTop)){
        dev_tools_HMR.reload("4285668c",DirectiveTop)
    }
}
export default Component.createComponent(DirectiveTop,{
    name:"es-DirectiveTop",
    __hmrId:"4285668c"
});
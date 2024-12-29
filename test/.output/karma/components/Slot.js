import Class from "./../../Class.js";
import {createVNode,renderSlot} from "vue";
import Component from "./../../web/components/Component.js";
import System from "./../../System.js";
import dev_tools_HMR from "./../../dev/tools/HMR.js";
function Slot(){
    Component.call(this,arguments[0]);
}
Class.creator(Slot,{
    m:513,
    ns:"karma.components",
    name:"Slot",
    inherit:Component,
    members:{
        items:{
            m:576,
            enumerable:true,
            get:function items(){
                return this.reactive("items");
            },
            set:function items(value){
                this.reactive("items",value);
            }
        },
        title:{
            m:576,
            enumerable:true,
            get:function title(){
                return this.reactive("title");
            },
            set:function title(value){
                this.reactive("title",value);
            }
        },
        render:{
            m:544,
            value:function render(){
                console.log('---Slot Component----render11-----',this.title,this.items);
                return createVNode("div",{
                    class:"slot"
                },[
                    createVNode("div",{
                        class:'head'
                    },renderSlot(this.getAttribute("slots"),"head",{},()=>[
                        createVNode("h3",null,[
                            "Slot component: "
                        ].concat(
                            this.title
                        ))
                    ])),
                    createVNode("div",{
                        class:'content'
                    },[
                        createVNode("p",null,["Content: "])
                    ].concat(
                        renderSlot(this.getAttribute("slots"),"content",{
                            items:this.items
                        },()=>System.forMap(this.items,(item,index)=>createVNode("div",{
                            ref:(node)=>this.setRefNode('item',node,true)
                        },[
                            "default: "
                        ].concat(
                            item.label
                        ))))
                    )),
                    createVNode("div",{
                        class:'footer'
                    },renderSlot(this.getAttribute("slots"),"default",{}))
                ]);
            },
            configurable:true
        }
    }
});
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("2245512a",Slot)){
        dev_tools_HMR.reload("2245512a",Slot)
    }
}
export default Component.createComponent(Slot,{
    name:"es-Slot",
    __hmrId:"2245512a",
    props:{
        items:{
            type:Array,
            default:()=>([])
        },
        items:{
            type:Array,
            default:()=>([])
        },
        title:{
            type:String,
            default:'default'
        },
        title:{
            type:String,
            default:'default'
        }
    }
});
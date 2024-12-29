import Class from "./../../Class.js";
import {createVNode,createCommentVNode,vShow,withDirectives} from "vue";
import Component from "./../../web/components/Component.js";
import dev_tools_HMR from "./../../dev/tools/HMR.js";
function Directive(){
    Component.call(this,arguments[0]);
    this.inject("list");
}
Class.creator(Directive,{
    m:513,
    ns:"karma.components",
    name:"Directive",
    inherit:Component,
    members:{
        condition:{
            m:576,
            enumerable:true,
            get:function condition(){
                return this.reactive("condition");
            },
            set:function condition(value){
                this.reactive("condition",value);
            }
        },
        onMounted:{
            m:544,
            value:function onMounted(){},
            configurable:true
        },
        list:{
            m:576,
            enumerable:true,
            set:function list(value){
                console.log('------Directive Injector(Home page list)---------',value);
            }
        },
        onUpdated:{
            m:1056,
            value:function onUpdated(){
                console.log('-----onUpdated  Directive----------',this.condition);
            },
            configurable:true
        },
        onBeforeMount:{
            m:1056,
            value:function onBeforeMount(){
                console.log('-----onBeforeMount  Directive----------',this.condition);
            },
            configurable:true
        },
        render:{
            m:544,
            value:function render(){
                console.log('---Directive Component render---',this.condition);
                return createVNode("div",{
                    class:"directive"
                },[
                    createVNode("div",{
                        class:'if-condition'
                    },[
                        this.condition ? createVNode("div",{
                            class:'way-1'
                        },["if-way 1"]) : createCommentVNode("end if")
                    ].concat(
                        this.condition ? [
                            createVNode("div",{
                                class:'way-2'
                            },["if-way 2-1"]),
                            createVNode("div",{
                                class:'way-2'
                            },["if-way 2-2"])
                        ] : createCommentVNode("end if")
                    )),
                    createVNode("div",{
                        class:'show'
                    },[
                        withDirectives(createVNode("div",{
                            class:'way-1'
                        },["show-way 1"]),[
                            [vShow,this.condition]
                        ])
                    ].concat(
                        withDirectives(createVNode("div",{
                            class:'way-2'
                        },["show-way 2-1"]),[
                            [vShow,this.condition]
                        ]),
                        withDirectives(createVNode("div",{
                            class:'way-2'
                        },["show-way 2-2"]),[
                            [vShow,this.condition]
                        ])
                    ))
                ]);
            },
            configurable:true
        }
    }
});
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("c80137e5",Directive)){
        dev_tools_HMR.reload("c80137e5",Directive)
    }
}
export default Component.createComponent(Directive,{
    name:"es-Directive",
    __hmrId:"c80137e5",
    props:{
        condition:{
            type:Boolean,
            default:true
        },
        condition:{
            type:Boolean,
            default:true
        }
    }
});
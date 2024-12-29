import "element-plus/lib/components/scrollbar/style/css";
import "element-plus/lib/components/menu/style/css";
import "element-plus/lib/components/menu-item/style/css";
import "element-plus/lib/components/sub-menu/style/css";
import Class from "./../../Class.js";
import {createVNode,withCtx,normalizeStyle} from "vue";
import Component from "./../../web/components/Component.js";
import Reflect from "./../../Reflect.js";
import Menu,{ElSubMenu as MenuSubitem,ElMenuItem as MenuItem} from "element-plus/lib/components/menu";
import Link from "./../../web/components/Link.js";
import Scrollbar from "element-plus/lib/components/scrollbar";
import dev_tools_HMR from "./../../dev/tools/HMR.js";
function Sidebar(){
    Component.call(this,arguments[0]);
}
Class.creator(Sidebar,{
    m:513,
    ns:"karma.ui",
    name:"Sidebar",
    inherit:Component,
    members:{
        routes:{
            m:576,
            enumerable:true,
            get:function routes(){
                return this.reactive("routes");
            },
            set:function routes(value){
                this.reactive("routes",value);
            }
        },
        height:{
            m:576,
            enumerable:true,
            get:function height(){
                return this.reactive("height");
            },
            set:function height(value){
                this.reactive("height",value);
            }
        },
        width:{
            m:576,
            enumerable:true,
            get:function width(){
                return this.reactive("width");
            },
            set:function width(value){
                this.reactive("width",value);
            }
        },
        logoHeight:{
            m:576,
            enumerable:true,
            get:function logoHeight(){
                return this.reactive("logoHeight");
            },
            set:function logoHeight(value){
                this.reactive("logoHeight",value);
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
        makeItems:{
            m:544,
            value:function makeItems(routes){
                return routes.filter((item)=>{
                    const res = (item).show;
                    return (res !== false);
                }).map((item)=>{
                    const has = item.children && item.children.length > 0;
                    if(has){
                        return createVNode(MenuSubitem,{
                            index:item.path
                        },{
                            default:withCtx(()=>[].concat(
                                this.makeItems(item.children)
                            )),
                            title:()=>[createVNode("span",null,[
                                item.meta && Reflect.get(Sidebar,item.meta,"title")
                            ])]
                        });
                    }else{
                        return createVNode(MenuItem,{
                            index:item.path,
                            style:{
                                minWidth:"100%"
                            }
                        },{
                            default:withCtx(()=>[
                                createVNode(Link,{
                                    to:item.path
                                },{
                                    default:withCtx(()=>[
                                        item.meta && Reflect.get(Sidebar,item.meta,"title")
                                    ])
                                })
                            ])
                        });
                    }
                });
            },
            configurable:true
        },
        onMounted:{
            m:544,
            value:function onMounted(){
                window.addEventListener('resize',()=>{
                    this.height=window.innerHeight - 1;
                });
            },
            configurable:true
        },
        render:{
            m:544,
            value:function render(){
                const style = {
                    width:`${this.width}px`,
                    height:`${this.height}px`,
                    color:"#fff",
                    fontSize:"14px",
                    background:"#fff",
                    borderRight:"solid 1px #ebebeb"
                }
                const wrapStyle = [{
                    overflowX:"hidden",
                    height:`${this.height}px`
                }];
                console.log('----Sidebar-render----');
                return createVNode("div",{
                    style:normalizeStyle(style)
                },[
                    createVNode(Scrollbar,{
                        wrapStyle:wrapStyle
                    },{
                        default:withCtx(()=>[
                            createVNode(Menu,{
                                mode:'vertical',
                                collapse:false,
                                style:{
                                    borderRight:"none"
                                }
                            },{
                                default:withCtx(()=>[].concat(
                                    this.makeItems(this.routes)
                                ))
                            })
                        ])
                    })
                ]);
            },
            configurable:true
        }
    }
});
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("4ad483c4",Sidebar)){
        dev_tools_HMR.reload("4ad483c4",Sidebar)
    }
}
export default Component.createComponent(Sidebar,{
    name:"es-Sidebar",
    __hmrId:"4ad483c4",
    props:{
        routes:{
            type:Array,
            default:()=>([])
        },
        routes:{
            type:Array,
            default:()=>([])
        },
        height:{
            type:Number,
            default:()=>(window.innerHeight - 1)
        },
        height:{
            type:Number,
            default:()=>(window.innerHeight - 1)
        },
        width:{
            type:Number,
            default:200
        },
        width:{
            type:Number,
            default:200
        },
        logoHeight:{
            type:Number,
            default:48
        },
        logoHeight:{
            type:Number,
            default:48
        },
        title:{
            type:String,
            default:'用户咨询列表'
        },
        title:{
            type:String,
            default:'用户咨询列表'
        }
    }
});
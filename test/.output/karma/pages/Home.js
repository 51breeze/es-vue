import "element-plus/lib/components/dialog/style/css";
import "element-plus/lib/components/button/style/css";
import Class from "./../../Class.js";
import {withCtx,createVNode,normalizeClass,normalizeStyle} from "vue";
import VList from "./../vue/list.js";
import Component from "./../../web/components/Component.js";
import UserStore from "./../../stores/UserStore.js";
import web_ui_Button from "element-plus/lib/components/button";
import web_ui_Dialog from "element-plus/lib/components/dialog";
import karma_components_List from "./../components/List.js";
import karma_components_Slot from "./../components/Slot.js";
import System from "./../../System.js";
import karma_components_Directive from "./../components/Directive.js";
import web_ui_RichText from "./../../web/ui/RichText.js";
import web_ui_RichTextBalloonBlock from "./../../web/ui/RichTextBalloonBlock.js";
import web_ui_RichTextInline from "./../../web/ui/RichTextInline.js";
import web_ui_RichTextDocument from "./../../web/ui/RichTextDocument.js";
import web_ui_RichTextMultiroot from "./../../web/ui/RichTextMultiroot.js";
import Lang from "./../../web/Lang.js";
import dev_tools_HMR from "./../../dev/tools/HMR.js";
const _private = Class.getKeySymbols("29813c5e");
function Home(){
    Component.call(this,arguments[0]);
    Object.defineProperty(this,_private,{
        value:{
            response:'null'
        }
    });
    Object.defineProperties(this[_private],{
        _title:{
            get:()=>this.reactive("_title",void 0,()=>'Home page'),
            set:(value)=>this.reactive("_title",value)
        },
        text:{
            get:()=>this.reactive("text",void 0,()=>'Hello,worlds'),
            set:(value)=>this.reactive("text",value)
        },
        text2:{
            get:()=>this.reactive("text2",void 0,()=>'Hello,worlds 22222'),
            set:(value)=>this.reactive("text2",value)
        },
        data:{
            get:()=>this.reactive("data",void 0,()=>({})),
            set:(value)=>this.reactive("data",value)
        },
        layout:{
            get:()=>this.reactive("layout",void 0,()=>({})),
            set:(value)=>this.reactive("layout",value)
        },
        showEditor:{
            get:()=>this.reactive("showEditor",void 0,()=>false),
            set:(value)=>this.reactive("showEditor",value)
        }
    });
    this.provide("list",()=>this.list);
    this.provide("homePage",this.providesss.bind(this));
}
Class.creator(Home,{
    m:513,
    ns:"karma.pages",
    name:"Home",
    private:_private,
    inherit:Component,
    members:{
        list:{
            m:576,
            enumerable:true,
            get:function list(){
                return this.reactive("list");
            },
            set:function list(value){
                this.reactive("list",value);
            }
        },
        fromData:{
            m:576,
            enumerable:true,
            get:function fromData(){
                return this.reactive("fromData");
            },
            set:function fromData(value){
                this.reactive("fromData",value);
            }
        },
        _title:{
            m:2056,
            writable:true,
            value:'Home page'
        },
        providesss:{
            m:544,
            value:function providesss(){
                return [1];
            },
            configurable:true
        },
        response:{
            m:1088,
            get:function response(){
                return this[_private].response;
            },
            set:function response(value){
                this[_private].response=value;
            }
        },
        title:{
            m:576,
            enumerable:true,
            get:function title(){
                return this[_private]._title;
            },
            set:function title(value){
                console.trace(this.toString(),'-------set title------',this.title,value);
                this[_private]._title=value;
            },
            configurable:true
        },
        addItem:{
            m:544,
            value:function addItem(item){
                this.list.push(item);
            },
            configurable:true
        },
        setType:{
            m:544,
            value:function setType(value){
                this.fromData.type=value;
            },
            configurable:true
        },
        onMounted:{
            m:544,
            value:function onMounted(){
                const header = this.getRefs('editor-header');
                this[_private].layout={
                    header:header,
                    main:this.getRefs('editor-main')
                }
                try{
                    const store = UserStore.use();
                    store.info={
                        add:123,
                        name:'zhangsan'
                    }
                    store.fetch();
                }catch(e){
                    console.log(e,'--------------');
                }
            },
            configurable:true
        },
        text:{
            m:2056,
            writable:true,
            value:'Hello,worlds'
        },
        text2:{
            m:2056,
            writable:true,
            value:'Hello,worlds 22222'
        },
        data:{
            m:2056,
            writable:true,
            value:{}
        },
        layout:{
            m:2056,
            writable:true,
            value:{}
        },
        spreadData:{
            m:576,
            enumerable:true,
            get:function spreadData(){
                return {
                    items:this.list,
                    title:this.title,
                    fromData:this.fromData
                }
            },
            configurable:true
        },
        showEditor:{
            m:2056,
            writable:true,
            value:false
        },
        render:{
            m:544,
            value:function render(){
                console.log('------Home page render-----------',this.title,this.list,this.fromData);
                return createVNode("div",{
                    "data-title":"home",
                    class:normalizeClass({
                        'roo-con':true
                    }),
                    style:normalizeStyle([{
                        width:'auto'
                    }])
                },[
                    "66666666666666 2222--33388866667777 ",
                    createVNode(web_ui_Button,{
                        onClick:()=>this[_private].showEditor=true
                    },{
                        default:withCtx(()=>["fdfdfdsf"])
                    }),
                    createVNode(web_ui_Dialog,{
                        modelValue:this[_private].showEditor,
                        "onUpdate:modelValue":(e)=>this[_private].showEditor=e
                    },{
                        default:withCtx(()=>["88866699996666 "])
                    }),
                    createVNode("h5",{
                        ref:'title'
                    },[
                        this.title
                    ]),
                    createVNode(karma_components_List,{
                        ...this.spreadData,
                        ref:'list'
                    }),
                    createVNode(karma_components_Slot,{
                        items:this.list,
                        ref:"slot-component-1"
                    },{
                        default:withCtx(()=>[
                            createVNode("div",null,["footer default children"])
                        ])
                    }),
                    createVNode(karma_components_Slot,{
                        items:this.list,
                        ref:"slot-component-2"
                    },{
                        head:withCtx(()=>[
                            createVNode("h3",null,["Slot component: definition"])
                        ]),
                        content:withCtx((props={})=>System.forMap(props.items,(item,index)=>createVNode("div",{
                            ref:(node)=>this.setRefNode('slot-item',node,true)
                        },[
                            "definition: "
                        ].concat(
                            item.label
                        ))))
                    }),
                    createVNode(karma_components_Directive),
                    createVNode("div",null,[
                        createVNode(web_ui_RichText,{
                            value:this[_private].text,
                            modelValue:this[_private].text,
                            height:"200px",
                            "onUpdate:modelValue":(e)=>this[_private].text=e
                        })
                    ]),
                    createVNode("div",null,[
                        createVNode(web_ui_RichTextBalloonBlock,{
                            value:this[_private].text2,
                            modelValue:this[_private].text2,
                            height:"100px",
                            "onUpdate:modelValue":(e)=>this[_private].text2=e
                        })
                    ]),
                    createVNode("div",null,[
                        createVNode(web_ui_RichTextInline,{
                            value:this[_private].text2,
                            modelValue:this[_private].text2,
                            "onUpdate:modelValue":(e)=>this[_private].text2=e
                        })
                    ]),
                    "------------------------- ",
                    createVNode("div",null,[
                        createVNode(web_ui_RichTextDocument,{
                            value:this[_private].text2,
                            modelValue:this[_private].text2,
                            "onUpdate:modelValue":(e)=>this[_private].text2=e
                        })
                    ]),
                    createVNode("div",{
                        ref:"editor-main"
                    },["editor-main "]),
                    createVNode("div",null,[
                        createVNode(web_ui_RichTextDocument,{
                            value:this[_private].text2,
                            modelValue:this[_private].text2,
                            "onUpdate:modelValue":(e)=>this[_private].text2=e
                        })
                    ]),
                    createVNode("div",null,[
                        createVNode(web_ui_RichTextMultiroot,{
                            layout:this[_private].layout,
                            value:this[_private].data,
                            modelValue:this[_private].data,
                            "onUpdate:modelValue":(e)=>this[_private].data=e
                        })
                    ]),
                    createVNode("div",{
                        ref:"editor-header"
                    },["editor-header "]),
                    createVNode("div",null,[].concat(
                        Lang.fetch('home.start')
                    ))
                ]);
            },
            configurable:true
        }
    }
});
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("29813c5e",Home)){
        dev_tools_HMR.reload("29813c5e",Home)
    }
}
export default Component.createComponent(Home,{
    name:"es-Home",
    __hmrId:"29813c5e",
    emits:Object.assign(["close","start","open"],{
        end:"ending"
    }),
    file:true,
    props:{
        list:{
            type:Array,
            default:()=>([])
        },
        list:{
            type:Array,
            default:()=>([])
        },
        fromData:{
            type:Object,
            default:()=>({
                account:'account',
                password:'password',
                check:'checked',
                type:'email'
            })
        },
        fromData:{
            type:Object,
            default:()=>({
                account:'account',
                password:'password',
                check:'checked',
                type:'email'
            })
        },
        title:{
            type:String
        }
    }
});
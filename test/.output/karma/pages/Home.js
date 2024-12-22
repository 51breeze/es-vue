import Class from "./../../Class.js";
import {withCtx,normalizeClass,normalizeStyle} from "vue";
import VList from "./../vue/list.js";
import Component from "./../../web/components/Component.js";
import UserStore from "./../../stores/UserStore.js";
import System from "./../../System.js";
import Lang from "./../../web/Lang.js";
const _private = Class.getKeySymbols("29813c5e");
function Home(){
    Component.apply(this,arguments);
    this.list=[];
    this.fromData={
        account:'account',
        password:'password',
        check:'checked',
        type:'email'
    }
    this.response='null';
    Object.defineProperty(this,_private,{
        value:{
            _title:'Home page',
            text:'Hello,worlds',
            text2:'Hello,worlds 22222',
            data:{},
            layout:{},
            showEditor:false
        }
    });
}
Class.creator(Home,{
    m:513,
    ns:"karma.pages",
    name:"Home",
    private:_private,
    inherit:Component,
    members:{
        list:{
            m:520,
            writable:true,
            enumerable:true
        },
        fromData:{
            m:520,
            writable:true,
            enumerable:true
        },
        _title:{
            m:2056,
            writable:true
        },
        providesss:{
            m:544,
            value:function providesss(){
                return [1];
            }
        },
        response:{
            m:1032,
            writable:true
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
            }
        },
        addItem:{
            m:544,
            value:function addItem(item){
                this.list.push(item);
            }
        },
        setType:{
            m:544,
            value:function setType(value){
                this.fromData.type=value;
            }
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
            }
        },
        text:{
            m:2056,
            writable:true
        },
        text2:{
            m:2056,
            writable:true
        },
        data:{
            m:2056,
            writable:true
        },
        layout:{
            m:2056,
            writable:true
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
            }
        },
        showEditor:{
            m:2056,
            writable:true
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
                    createVNode(Button,{
                        onClick:()=>this[_private].showEditor=true
                    },{
                        default:withCtx(()=>["fdfdfdsf"])
                    }),
                    createVNode(Dialog,{
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
                    createVNode(List,{
                        ...this.spreadData,
                        ref:'list'
                    }),
                    createVNode(Slot,{
                        items:this.list,
                        ref:"slot-component-1"
                    },{
                        default:withCtx(()=>[
                            createVNode("div",null,["footer default children"])
                        ])
                    }),
                    createVNode(Slot,{
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
                    createVNode(Directive),
                    createVNode("div",null,[
                        createVNode(RichText,{
                            value:this[_private].text,
                            modelValue:this[_private].text,
                            height:"200px",
                            "onUpdate:modelValue":(e)=>this[_private].text=e
                        })
                    ]),
                    createVNode("div",null,[
                        createVNode(RichTextBalloonBlock,{
                            value:this[_private].text2,
                            modelValue:this[_private].text2,
                            height:"100px",
                            "onUpdate:modelValue":(e)=>this[_private].text2=e
                        })
                    ]),
                    createVNode("div",null,[
                        createVNode(RichTextInline,{
                            value:this[_private].text2,
                            modelValue:this[_private].text2,
                            "onUpdate:modelValue":(e)=>this[_private].text2=e
                        })
                    ]),
                    "------------------------- ",
                    createVNode("div",null,[
                        createVNode(RichTextDocument,{
                            value:this[_private].text2,
                            modelValue:this[_private].text2,
                            "onUpdate:modelValue":(e)=>this[_private].text2=e
                        })
                    ]),
                    createVNode("div",{
                        ref:"editor-main"
                    },["editor-main "]),
                    createVNode("div",null,[
                        createVNode(RichTextDocument,{
                            value:this[_private].text2,
                            modelValue:this[_private].text2,
                            "onUpdate:modelValue":(e)=>this[_private].text2=e
                        })
                    ]),
                    createVNode("div",null,[
                        createVNode(RichTextMultiroot,{
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
            }
        }
    }
});
export default Home;
import "element-plus/lib/components/upload/style/css";
import "element-plus/lib/components/link/style/css";
import "element-plus/lib/components/button/style/css";
import "element-plus/lib/components/form/style/css";
import "element-plus/lib/components/form-item/style/css";
import "element-plus/lib/components/input/style/css";
import Class from "./Class.js";
import {createVNode,createCommentVNode,withCtx} from "vue";
import Component from "./web/components/Component.js";
import web_ui_Input from "element-plus/lib/components/input";
import web_ui_Icon from "./web/ui/Icon.js";
import web_ui_Form,{ElFormItem as web_ui_FormItem} from "element-plus/lib/components/form";
import Button from "element-plus/lib/components/button";
import web_ui_TextLink from "element-plus/lib/components/link";
import web_ui_Upload from "element-plus/lib/components/upload";
import dev_tools_HMR from "./dev/tools/HMR.js";
const _private = Class.getKeySymbols("84966386");
function Person(options){
    Component.call(this,options);
    Object.defineProperty(this,_private,{
        value:{}
    });
    console.log(options);
    Object.defineProperties(this[_private],{
        value:{
            get:()=>this.reactive("value",void 0,()=>''),
            set:(value)=>this.reactive("value",value)
        }
    });
}
Class.creator(Person,{
    m:513,
    name:"Person",
    private:_private,
    inherit:Component,
    members:{
        name:{
            m:576,
            enumerable:true,
            get:function name(){
                return this.reactive('name');
            },
            set:function name(value){
                this.reactive('name',value);
            },
            configurable:true
        },
        age:{
            m:2112,
            get:function age(){
                return 30;
            },
            configurable:true
        },
        add:{
            m:2112,
            set:function add(value){}
        },
        value:{
            m:2056,
            writable:true,
            value:''
        },
        onMounted:{
            m:544,
            value:function onMounted(){
                setTimeout(()=>{
                    this.reactive('name','=====手动设置不再接收上级的值 =======11111==');
                },1000);
            },
            configurable:true
        },
        render:{
            m:544,
            value:function render(h){
                return createVNode("div",null,[
                    true ? [
                        createVNode("div",null,["====the is if=0000000000===="])
                    ] : createCommentVNode("end if")
                ].concat(
                    createVNode("div",null,[
                        this.name
                    ]),
                    createVNode(web_ui_Input,{
                        modelValue:this[_private].value,
                        "onUpdate:modelValue":(e)=>this[_private].value=e
                    }),
                    createVNode(web_ui_Icon,null,{
                        default:withCtx(()=>[
                            createVNode("Plus")
                        ])
                    }),
                    createVNode(web_ui_Form,null,{
                        default:withCtx(()=>[
                            createVNode(web_ui_FormItem,{
                                label:"account"
                            },{
                                default:withCtx(()=>[
                                    createVNode(web_ui_Input,{
                                        modelValue:this[_private].value,
                                        "onUpdate:modelValue":(e)=>this[_private].value=e
                                    })
                                ])
                            })
                        ])
                    }),
                    createVNode("div",{
                        id:"@person-root-child"
                    },["Person page"]),
                    createVNode(Button,null,{
                        default:withCtx(()=>["button "])
                    }),
                    createVNode(web_ui_TextLink,{
                        type:'primary'
                    },{
                        default:withCtx(()=>["text link "])
                    }),
                    createVNode(web_ui_Upload,{
                        action:'http://sss.com/upload',
                        data:{
                            name:'yejun'
                        },
                        drag:true
                    },{
                        default:withCtx(()=>["Upload "]),
                        trigger:withCtx(()=>[
                            createVNode("div",null,["==========="])
                        ])
                    }),
                    2 ? [1,2].map((val,key)=>createVNode("div",null,[
                        createVNode("span",null,[val])
                    ])) : 3 > 2 ? [1,2].map((val,key)=>createVNode("div",null,["=========== "])) : createVNode("div",null,["99999999999 "])
                ));
            },
            configurable:true
        }
    }
});
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("84966386",Person)){
        dev_tools_HMR.reload("84966386",Person)
    }
}
export default Component.createComponent(Person,{
    name:"es-Person",
    __hmrId:"84966386",
    props:{
        name:{
            type:String
        }
    }
});
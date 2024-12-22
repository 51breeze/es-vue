import Class from "./Class.js";
import {createCommentVNode,withCtx} from "vue";
import Component from "./web/components/Component.js";
const _private = Class.getKeySymbols("84966386");
function Person(options){
    Component.call(this,options);
    Object.defineProperty(this,_private,{
        value:{
            value:''
        }
    });
    console.log(options);
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
            }
        },
        age:{
            m:2112,
            get:function age(){
                return 30;
            }
        },
        add:{
            m:2112,
            set:function add(value){}
        },
        value:{
            m:2056,
            writable:true
        },
        onMounted:{
            m:544,
            value:function onMounted(){
                setTimeout(()=>{
                    this.reactive('name','=====手动设置不再接收上级的值 =======11111==');
                },1000);
            }
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
                    createVNode(Input,{
                        modelValue:this[_private].value,
                        "onUpdate:modelValue":(e)=>this[_private].value=e
                    }),
                    createVNode(Icon,null,{
                        default:withCtx(()=>[
                            createVNode("Plus")
                        ])
                    }),
                    createVNode(Form,null,{
                        default:withCtx(()=>[
                            createVNode(FormItem,{
                                label:"account"
                            },{
                                default:withCtx(()=>[
                                    createVNode(Input,{
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
                    createVNode(web.ui.TextLink,{
                        type:'primary'
                    },{
                        default:withCtx(()=>["text link "])
                    }),
                    createVNode(web.ui.Upload,{
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
            }
        }
    }
});
export default Person;
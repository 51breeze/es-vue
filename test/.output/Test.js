import "element-plus/lib/components/notification/style/css";
import "./asstes/assets/test.js";
import Class from "./Class.js";
import {createVNode,withCtx} from "vue";
import Component from "./web/components/Component.js";
import Reflect from "./Reflect.js";
import Notification from "element-plus/lib/components/notification";
import MyOption from "./MyOption.js";
import Select from "./web/ui/Select.js";
import Link from "./web/components/Link.js";
import Viewport from "./web/components/Viewport.js";
import dev_tools_HMR from "./dev/tools/HMR.js";
const _private = Class.getKeySymbols("09f804d2");
function Test(options){
    Component.call(this,options);
    Object.defineProperty(this,_private,{
        value:{
            label:'9999999'
        }
    });
}
Class.creator(Test,{
    m:513,
    name:"Test",
    private:_private,
    inherit:Component,
    members:{
        onInitialized:{
            m:544,
            value:function onInitialized(){
                console.log('====onInitialized========');
                Component.prototype.onInitialized.call(this);
            },
            configurable:true
        },
        onMounted:{
            m:1056,
            value:function onMounted(){
                console.log(Reflect.get(Test,this.getAttribute('instance'),"setupState"));
            },
            configurable:true
        },
        address:{
            m:576,
            enumerable:true,
            get:function address(){
                return this.reactive("address");
            },
            set:function address(value){
                this.reactive("address",value);
            }
        },
        onBeforeMount:{
            m:544,
            value:function onBeforeMount(){
                console.log('=====beforeMount======');
            },
            configurable:true
        },
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
        value:{
            m:576,
            enumerable:true,
            get:function value(){
                return this.reactive('value');
            },
            set:function value(val){
                console.log('=====ssssssssss======');
                this.reactive('value',val);
            },
            configurable:true
        },
        tips:{
            m:544,
            value:function tips(){
                Notification({
                    title:'提示成功',
                    message:'这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案'
                });
            },
            configurable:true
        },
        skin:{
            m:576,
            enumerable:true,
            get:function skin(){
                return null;
            },
            configurable:true
        },
        childElements:{
            m:576,
            enumerable:true,
            get:function childElements(){
                return this.reactive('children');
            },
            set:function childElements(value){
                this.reactive('children',value);
            },
            configurable:true
        },
        label:{
            m:2056,
            writable:true
        },
        render:{
            m:544,
            value:function render(){
                return createVNode("div",null,[
                    createVNode("p",null,[
                        createVNode("h5",{
                            onClick:this.tips.bind(this).bind(this)
                        },[
                            "点击 "
                        ].concat(
                            "ssss",
                            666,
                            "这\"里\'提示 ",
                            this.name
                        )),
                        createVNode(Select,{
                            modelValue:this.value,
                            name:"name",
                            size:"mini",
                            "onUpdate:modelValue":(e)=>this.value=e
                        },{
                            default:withCtx(()=>[
                                createVNode(MyOption,{
                                    value:"深圳"
                                }),
                                createVNode(MyOption,{
                                    value:"长沙"
                                })
                            ]),
                            prefix:withCtx(()=>[
                                createVNode("div",null,["6666"])
                            ])
                        })
                    ])
                ].concat(
                    this[_private].label,
                    createVNode(Link,{
                        to:'/test'
                    },{
                        default:withCtx(()=>["测试页面"])
                    }),
                    createVNode("br"),
                    createVNode(Link,{
                        to:'/index'
                    },{
                        default:withCtx(()=>["首页面"])
                    }),
                    createVNode("div",null,[
                        createVNode(Viewport)
                    ])
                ));
            },
            configurable:true
        },
        beforeEnter:{
            m:544,
            value:function beforeEnter(...args){
                console.log(args);
            },
            configurable:true
        },
        isShow:{
            m:576,
            enumerable:true,
            get:function isShow(){
                return this.reactive("isShow");
            },
            set:function isShow(value){
                this.reactive("isShow",value);
            }
        },
        toggle:{
            m:544,
            value:function toggle(){
                this.isShow=!this.isShow;
                console.log('--------',this.isShow);
            },
            configurable:true
        }
    }
});
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("09f804d2",Test)){
        dev_tools_HMR.reload("09f804d2",Test)
    }
}
export default Component.createComponent(Test,{
    name:"es-Test",
    __hmrId:"09f804d2",
    props:{
        address:{
            type:String
        },
        address:{
            type:String
        },
        name:{
            type:String
        },
        value:{
            type:String
        },
        childElements:{
            type:null
        },
        isShow:{
            type:Boolean,
            default:true
        },
        isShow:{
            type:Boolean,
            default:true
        }
    }
});
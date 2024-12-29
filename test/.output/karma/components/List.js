import Class from "./../../Class.js";
import {createVNode,normalizeClass} from "vue";
import Component from "./../../web/components/Component.js";
import System from "./../../System.js";
import dev_tools_HMR from "./../../dev/tools/HMR.js";
const _private = Class.getKeySymbols("753d6fe9");
function List(){
    Component.call(this,arguments[0]);
    Object.defineProperty(this,_private,{
        value:{
            _homePage:null,
            lists:null
        }
    });
    Object.defineProperties(this[_private],{
        name:{
            get:()=>this.reactive("name",void 0,()=>'the is list Component'),
            set:(value)=>this.reactive("name",value)
        }
    });
    this.inject("homePage");
    this.inject("homeList","list");
}
Class.creator(List,{
    m:513,
    ns:"karma.components",
    name:"List",
    private:_private,
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
        name:{
            m:2056,
            writable:true,
            value:'the is list Component'
        },
        title:{
            m:576,
            enumerable:true,
            get:function title(){
                return this[_private].name;
            },
            set:function title(value){
                this[_private].name=value;
            },
            configurable:true
        },
        _homePage:{
            m:2056,
            writable:true
        },
        homePage:{
            m:576,
            enumerable:true,
            get:function homePage(){
                return this[_private]._homePage;
            },
            set:function homePage(value){
                this[_private]._homePage=value;
                console.log('------Injector(homePage) List components---------');
            },
            configurable:true
        },
        lists:{
            m:2056,
            writable:true
        },
        homeList:{
            m:576,
            enumerable:true,
            set:function homeList(value){
                this[_private].lists=value;
            }
        },
        onMounted:{
            m:1056,
            value:function onMounted(){
                console.log(this.getAttribute('config'));
                console.log('---List Component----onMounted-----',this.title,this.items);
            },
            configurable:true
        },
        render:{
            m:544,
            value:function render(){
                console.log('---List Component----render--',this.title,this.items,this.fromData);
                return createVNode("div",{
                    class:"list"
                },[
                    createVNode("h5",{
                        ref:'title'
                    },[].concat(
                        this.title
                    )),
                    createVNode("h6",null,[].concat(
                        this[_private].name
                    )),
                    createVNode("div",{
                        class:'for-way1'
                    },System.forMap(this.items,(item,key)=>createVNode("span",{
                        ref:(node)=>this.setRefNode('way1-item',node,true)
                    },[].concat(
                        item.label
                    )))),
                    createVNode("div",{
                        class:'for-way2'
                    },System.forMap(this.items,(item,index)=>createVNode("span",null,[
                        item.label
                    ].concat(
                        "-",
                        index
                    )))),
                    createVNode("div",{
                        class:'for-way3'
                    },this.items.map((item,index)=>createVNode("span",null,[
                        item.label
                    ].concat(
                        "-",
                        index
                    )))),
                    createVNode("div",{
                        class:'for-way4'
                    },this.items.map((item,key)=>[
                        item.label
                    ].concat(
                        "-",
                        key
                    ))),
                    createVNode("div",{
                        class:'from-data'
                    },System.forMap(this.fromData,(item,key)=>createVNode("div",{
                        class:normalizeClass(key)
                    },[
                        key,
                        ":",
                        item
                    ])))
                ]);
            },
            configurable:true
        }
    }
});
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("753d6fe9",List)){
        dev_tools_HMR.reload("753d6fe9",List)
    }
}
export default Component.createComponent(List,{
    name:"es-List",
    __hmrId:"753d6fe9",
    props:{
        items:{
            type:Array,
            default:()=>([])
        },
        items:{
            type:Array,
            default:()=>([])
        },
        fromData:{
            type:Object,
            default:()=>({
                check:'string',
                type:'123',
                account:'string',
                password:'string'
            })
        },
        fromData:{
            type:Object,
            default:()=>({
                check:'string',
                type:'123',
                account:'string',
                password:'string'
            })
        },
        title:{
            type:String
        }
    }
});
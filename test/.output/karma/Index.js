import "./../asstes/theme.js";
import Class from "./../Class.js";
import {createVNode,normalizeStyle,withCtx} from "vue";
import Application from "./../web/Application.js";
import Lang from "./../web/Lang.js";
import Manger from "./Manger.js";
import Router from "./../web/components/Router.js";
import Home from "./pages/Home.js";
import List from "./pages/List.js";
import Link from "./../web/components/Link.js";
import Layout from "./ui/Layout.js";
import Component from "./../web/components/Component.js";
import dev_tools_HMR from "./../dev/tools/HMR.js";
const _private = Class.getKeySymbols("2b668c2c");
function Index(){
    Application.call(this);
    Object.defineProperty(this,_private,{
        value:{
            _router:null
        }
    });
    Manger.getInstance().setApp(this);
    Manger.getInstance().register('routes',()=>{
        return this.routes;
    });
}
Class.creator(Index,{
    m:513,
    ns:"karma",
    name:"Index",
    private:_private,
    inherit:Application,
    methods:{
        main:{
            m:800,
            value:function main(){
                const obj = new Index();
                const app = document.createElement('div');
                document.body.append(app);
                obj.mount(app);
                const lang = Lang.use();
                console.trace(lang.format('home.start',{
                    start:'2002.12'
                }),lang.getLocale(),'---------------',Lang.format('home.start',{
                    start:'2002.12'
                }),Lang.format('Begin',{}),Lang.format('start',{
                    start:'2012'
                }));
            }
        }
    },
    members:{
        start:{
            m:544,
            value:async function start(arg){
                const obj = {}
                obj.test??=null;
                obj.test?.name;
            },
            configurable:true
        },
        globals:{
            m:576,
            enumerable:true,
            get:function globals(){
                return {
                    Lang:Lang
                }
            },
            configurable:true
        },
        onMounted:{
            m:544,
            value:function onMounted(){
                const lang = Lang.use();
                console.log('onMounted',lang.fetch('home.title'));
                this.title=lang.fetch('home.title');
            },
            configurable:true
        },
        _router:{
            m:2056,
            writable:true
        },
        router:{
            m:576,
            enumerable:true,
            get:function router(){
                if(this[_private]._router)
                return this[_private]._router;
                return this[_private]._router=new Router({
                    mode:'hash',
                    routes:this.routes
                });
            },
            configurable:true
        },
        routes:{
            m:576,
            enumerable:true,
            get:function routes(){
                const ro = Class.callSuperGetter(Index,this,"routes");
                console.log(ro);
                return [{
                    path:"/",
                    name:'default',
                    redirect:'/home'
                },{
                    path:"/home",
                    name:'Home',
                    meta:{
                        title:"Home"
                    },
                    component:Home
                },{
                    path:"/list",
                    name:'List',
                    meta:{
                        title:"List"
                    },
                    component:List
                }];
            },
            configurable:true
        },
        locale:{
            m:576,
            enumerable:true,
            get:function locale(){
                return Lang.use();
            },
            configurable:true
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
        styles:{
            m:576,
            enumerable:true,
            get:function styles(){
                return this.reactive("styles");
            },
            set:function styles(value){
                this.reactive("styles",value);
            }
        },
        render:{
            m:544,
            value:function render(){
                const styles = {
                    padding:"0 1rem"
                }
                return createVNode("div",null,[
                    createVNode("h5",{
                        class:"title"
                    },[
                        this.title
                    ]),
                    createVNode("div",{
                        class:"menus"
                    },this.router.getRoutes().map((route,index)=>createVNode(Link,{
                        to:route.path,
                        ref:(node)=>this.setRefNode('menu',node,true),
                        key:index,
                        style:normalizeStyle(styles)
                    },{
                        default:withCtx(()=>[].concat(
                            route.name
                        ))
                    }))),
                    createVNode("br"),
                    createVNode(Layout)
                ]);
            },
            configurable:true
        }
    }
});
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("2b668c2c",Index)){
        dev_tools_HMR.reload("2b668c2c",Index)
    }
}
export default Component.createComponent(Index,{
    name:"es-Index",
    __hmrId:"2b668c2c",
    props:{
        title:{
            type:String,
            default:'Karma Testing555'
        },
        title:{
            type:String,
            default:'Karma Testing555'
        },
        styles:{
            type:String,
            default:'ssss'
        },
        styles:{
            type:String,
            default:'ssss'
        }
    }
});
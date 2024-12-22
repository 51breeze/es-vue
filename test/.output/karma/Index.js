import "./../asstes/theme.js";
import Class from "./../Class.js";
import {normalizeStyle,withCtx} from "vue";
import Application from "./../web/Application.js";
import Lang from "./../web/Lang.js";
import Manger from "./Manger.js";
import Router from "./../web/components/Router.js";
import Home from "./pages/Home.js";
import List from "./pages/List.js";
const _private = Class.getKeySymbols("2b668c2c");
function Index(){
    Application.call(this);
    this.title='Karma Testing555';
    this.styles='ssss';
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
            }
        },
        globals:{
            m:576,
            enumerable:true,
            get:function globals(){
                return {
                    Lang:Lang
                }
            }
        },
        onMounted:{
            m:544,
            value:function onMounted(){
                const lang = Lang.use();
                console.log('onMounted',lang.fetch('home.title'));
                this.title=lang.fetch('home.title');
            }
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
            }
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
            }
        },
        locale:{
            m:576,
            enumerable:true,
            get:function locale(){
                return Lang.use();
            }
        },
        title:{
            m:520,
            writable:true,
            enumerable:true
        },
        styles:{
            m:520,
            writable:true,
            enumerable:true
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
            }
        }
    }
});
export default Index;
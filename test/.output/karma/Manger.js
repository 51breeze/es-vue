import Class from "./../Class.js";
const _private = Class.getKeySymbols("5589cba5");
function Manger(){
    Object.defineProperty(this,_private,{
        value:{
            _app:null,
            _dataset:null,
            pages:[],
            asserts:[],
            tasks:{}
        }
    });
}
Class.creator(Manger,{
    m:513,
    ns:"karma",
    name:"Manger",
    private:_private,
    methods:{
        instance:{
            m:2312,
            writable:true
        },
        getInstance:{
            m:800,
            value:function getInstance(){
                let obj = Manger.instance;
                if(!obj){
                    Manger.instance=obj=new Manger();
                }
                return obj;
            }
        }
    },
    members:{
        _app:{
            m:2056,
            writable:true
        },
        _dataset:{
            m:2056,
            writable:true
        },
        dataset:{
            m:576,
            enumerable:true,
            get:function dataset(){
                const dataset = this[_private]._dataset;
                if(dataset){
                    return dataset;
                }
                return this[_private]._dataset=new Map();
            }
        },
        register:{
            m:544,
            value:function register(name,value){
                this.dataset.set(name,value);
            }
        },
        get:{
            m:544,
            value:function get(name){
                const value = this.dataset.get(name);
                if(value instanceof Function){
                    return value();
                }
                return this.dataset.get(name);
            }
        },
        getApp:{
            m:544,
            value:function getApp(){
                return this[_private]._app;
            }
        },
        setApp:{
            m:544,
            value:function setApp(app){
                this[_private]._app=app;
            }
        },
        pages:{
            m:2056,
            writable:true
        },
        pushPage:{
            m:544,
            value:function pushPage(page){
                this[_private].pages.push(page);
            }
        },
        popPage:{
            m:544,
            value:function popPage(){
                return this[_private].pages.shift();
            }
        },
        asserts:{
            m:2056,
            writable:true
        },
        addAssert:{
            m:544,
            value:function addAssert(page){
                this[_private].asserts.push(page);
            }
        },
        getAsserts:{
            m:544,
            value:function getAsserts(){
                return this[_private].asserts;
            }
        },
        tasks:{
            m:2056,
            writable:true
        },
        addTask:{
            m:544,
            value:function addTask(name,task){
                this[_private].tasks[name]=task;
            }
        },
        getTask:{
            m:544,
            value:function getTask(name){
                return this[_private].tasks[name];
            }
        }
    }
});
export default Manger;
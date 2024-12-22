import Class from "./../Class.js";
import {defineStore,createPinia,getActivePinia,setActivePinia} from "pinia";
import {watch as _watch} from "vue";
import {computed,ref,toRefs,markRaw} from "@vue/reactivity";
import System from "./../System.js";
import Reflect from "./../Reflect.js";
function Store(){
    this.key='store';
    this.storeProxy=null;
    this.storeInstance=null;
}
Class.creator(Store,{
    m:513,
    ns:"web",
    name:"Store",
    methods:{
        getInstances:{
            m:2336,
            value:function getInstances(){
                let dataset = System.getConfig('globals.webStoreInstances');
                if(!dataset){
                    System.setConfig('globals.webStoreInstances',dataset=new Map());
                }
                return dataset;
            }
        },
        _plugins:{
            m:2312,
            writable:true,
            value:[]
        },
        setPlugins:{
            m:800,
            value:function setPlugins(plugins){
                Store._plugins.push(...plugins);
            }
        },
        _getActivePinia:{
            m:2336,
            value:function _getActivePinia(){
                return System.getConfig('globals.store.pinia.active.instance') || getActivePinia();
            }
        },
        main:{
            m:800,
            value:function main(){
                System.registerOnceHook('application:created',(app)=>{
                    const pinia = createPinia();
                    setActivePinia(pinia);
                    System.setConfig('globals.store.pinia.active.instance',pinia);
                    Store._plugins.forEach((plugin)=>{
                        pinia.use(plugin);
                    });
                    const vue = app.getAttribute('vueApp');
                    vue.use(pinia);
                });
            }
        },
        use:{
            m:800,
            value:function use(storeClass){
                let dataset = Store.getInstances();
                let instance = dataset.get(storeClass);
                if(!instance){
                    instance=new storeClass();
                    instance.create();
                    dataset.set(storeClass,instance);
                }
                return instance.storeProxy;
            }
        }
    },
    members:{
        key:{
            m:1032,
            writable:true
        },
        getOptions:{
            m:1056,
            value:function getOptions(){
                return {}
            }
        },
        getStorage:{
            m:1056,
            value:function getStorage(){
                return {}
            }
        },
        create:{
            m:1056,
            value:function create(){
                const descriptor = Reflect.getDescriptor(this) || {}
                const states = this.getStorage();
                const getters = {}
                const actions = {}
                const members = (descriptor.members || []);
                const bindMethods = {}
                const selfMethods = ['setState','getState','whenPropertyNotExists','getOptions','getStorage'];
                const selfProperties = ['storeInstance','key','storeProxy'];
                const publicMethods = ['patch','onAction','reset','subscribe','watch','dispose'];
                const _proxy = new Proxy(this,{
                    get:(target,key,receiver)=>{
                        if(Reflect.get(Store,descriptor,"privateKey") === key){
                            return this[Reflect.get(Store,descriptor,"privateKey")];
                        }
                        if(selfMethods.includes(key)){
                            if(bindMethods.hasOwnProperty(key)){
                                return bindMethods[key];
                            }
                            return bindMethods[key]=(this[key]).bind(this);
                        }else 
                        if(selfProperties.includes(key)){
                            return this[key];
                        }
                        const desc = members[key];
                        if(desc){
                            if(Reflect.get(Store,desc,"label") === 'property'){
                                if(Reflect.get(Store,desc,"permission") === 'public'){
                                    return store.$state[key];
                                }
                                return this[key];
                            }else 
                            if(Reflect.get(Store,desc,"label") === 'accessor'){
                                if(Reflect.get(Store,desc,"get")){
                                    return Reflect.call(Store,Reflect.get(Store,desc,"get"),"call",[this]);
                                }else{
                                    throw new ReferenceError(`Store property the "${key}" is not readable.`);
                                }
                            }else 
                            if(Reflect.get(Store,desc,"label") === 'method'){
                                if(bindMethods.hasOwnProperty(key)){
                                    return bindMethods[key];
                                }
                                return bindMethods[key]=Reflect.call(Store,Reflect.get(Store,desc,"value"),"bind",[this]);
                            }
                        }else{
                            key=String(key);
                            if(key === 'Symbol(Symbol.toStringTag)'){
                                return this.toString();
                            }else{
                                return this.whenPropertyNotExists(key);
                            }
                        }
                    },
                    set:(target,key,value)=>{
                        const desc = members[key];
                        if(desc){
                            if(Reflect.get(Store,desc,"label") === 'property'){
                                if(Reflect.get(Store,desc,"permission") === 'public'){
                                    store.$state[key]=value;
                                }else{
                                    this[key]=value;
                                }
                                return true;
                            }else 
                            if(Reflect.get(Store,desc,"label") === 'accessor'){
                                if(Reflect.get(Store,desc,"set")){
                                    Reflect.call(Store,Reflect.get(Store,desc,"set"),"call",[this,value]);
                                    return true;
                                }
                            }
                            throw new ReferenceError(`Store property the "${key}" is not writable.`);
                        }else{
                            throw new ReferenceError(`Store properties the "${key}" is not exist.`);
                        }
                    }
                });
                for(let name in members){
                    const desc = members[name];
                    if(Reflect.get(Store,desc,"permission") !== 'public')
                    continue;
                    if(Reflect.get(Store,desc,"label") === 'property'){
                        if(!states.hasOwnProperty(name)){
                            states[name]=Reflect.get(Store,desc,"value");
                        }
                    }else 
                    if(Reflect.get(Store,desc,"label") === 'accessor'){
                        if(Reflect.get(Store,desc,"get")){
                            getters[name]=Reflect.call(Store,Reflect.get(Store,desc,"get"),"bind",[_proxy]);
                        }
                    }else 
                    if(Reflect.get(Store,desc,"label") === 'method'){
                        actions[name]=Reflect.call(Store,Reflect.get(Store,desc,"value"),"bind",[_proxy]);
                    }
                }
                const pinia = Store._getActivePinia();
                const id = this.key + ':' + (descriptor.namespace ? descriptor.namespace + '.' + descriptor.className : descriptor.className);
                let setupOptions = {
                    state:()=>states,
                    getters:getters,
                    actions:actions
                }
                let store = null;
                let options = this.getOptions();
                const newStore = defineStore(id,setupOptions,options);
                store=newStore();
                this.storeInstance=store;
                this.storeProxy=new Proxy(store,{
                    set:(target,key,value)=>{
                        const desc = members[key];
                        if(!desc){
                            throw new ReferenceError(`Store property the "${key}" is not exist`);
                        }
                        if(Reflect.get(Store,desc,"permission") !== 'public'){
                            throw new ReferenceError(`Store ${Reflect.get(Store,desc,"label")} the "${key}" is not accessible`);
                        }
                        if(Reflect.get(Store,desc,"label") === 'accessor'){
                            if(Reflect.get(Store,desc,"set")){
                                Reflect.call(Store,Reflect.get(Store,desc,"set"),"call",[this,value]);
                                return true;
                            }else{
                                throw new ReferenceError(`Store property the "${key}" is not writable.`);
                            }
                        }else 
                        if(Reflect.get(Store,desc,"label") === 'property'){
                            if(Reflect.get(Store,desc,"writable")){
                                store.$state[key]=value;
                                return true;
                            }else{
                                throw new ReferenceError(`Store state the "${key}" is not writable.`);
                            }
                        }else{
                            throw new ReferenceError(`Store property the "${key}" is not writable`);
                        }
                    },
                    get:(target,key,receiver)=>{
                        if(key === "$id"){
                            return store[key];
                        }
                        if(publicMethods.includes(key)){
                            if(bindMethods.hasOwnProperty(key)){
                                return bindMethods[key];
                            }
                            return bindMethods[key]=(this[key]).bind(this);
                        }
                        const desc = members[key];
                        if(!desc){
                            return this.whenPropertyNotExists(String(key));
                        }
                        if(Reflect.get(Store,desc,"permission") !== 'public'){
                            throw new ReferenceError(`Store ${Reflect.get(Store,desc,"label")} the "${key}" is not accessible`);
                        }
                        return store[key];
                    }
                });
            }
        },
        storeProxy:{
            m:1032,
            writable:true
        },
        storeInstance:{
            m:1032,
            writable:true
        },
        setState:{
            m:1056,
            value:function setState(name,value){
                this.storeInstance.$state[':' + name]=value;
            }
        },
        getState:{
            m:1056,
            value:function getState(name){
                return this.storeInstance.$state[':' + name];
            }
        },
        whenPropertyNotExists:{
            m:1056,
            value:function whenPropertyNotExists(key){
                throw new ReferenceError(`Store property the "${key}" is not exist.`);
            }
        },
        patch:{
            m:544,
            value:function patch(data){
                this.storeInstance.$patch(data);
            }
        },
        onAction:{
            m:544,
            value:function onAction(callback,always=false){
                return this.storeInstance.$onAction(callback,always);
            }
        },
        subscribe:{
            m:544,
            value:function subscribe(callback,options){
                this.storeInstance.$subscribe(callback);
            }
        },
        watch:{
            m:544,
            value:function watch(callback,options){
                return _watch(this.storeInstance.$state,callback,options);
            }
        },
        dispose:{
            m:544,
            value:function dispose(){
                this.storeInstance.$dispose();
            }
        },
        reset:{
            m:544,
            value:function reset(){
                this.storeInstance.$reset();
            }
        }
    }
});
Store.main();
export default Store;
package web{

    import {defineStore, createPinia} from 'pinia'; 
    import {watch as _watch} from 'vue';
    class Store{

        static protected instances = new Map();
        static use<T extends class<Store>>(storeClass:T){
            let instance = Store.instances.get(storeClass) as Store;
            if(!instance){
                if( instances.size===0 ){
                    System.registerHook('application:created', (app)=>{
                        const vue = (app as web.Application).getAttribute('vueApp')
                        vue.use(createPinia())
                    });
                }
                instance = new storeClass() as Store;
                instance.create();
                Store.instances.set(storeClass, instance);
            }
            return instance.store as T;
        }

        protected create(){
            const descriptor = Reflect.getDescriptor(this) || {};
            const states = {};
            const opts = {
                state:()=>states,
                getters:{},
                actions:{}
            };

            const members = descriptor.members || {};
            const setters:{[key:string]:(value)=>void} = {};
            const bindMethods = {};
            const proxy = new Proxy(this, {
                get:(target,key,receiver)=>{

                    if(descriptor.privateKey === key){
                        return this[descriptor.privateKey];
                    }

                    if(states.hasOwnProperty(key)){
                        return store.$state[key];
                    }

                    if( bindMethods.hasOwnProperty(key) ){
                        return bindMethods[key];
                    }

                    let method = this[key] as Function;
                    if( typeof method ==='function'){
                        return bindMethods[key] = method.bind(this);
                    }
                    throw new ReferenceError(`Store.state "${key}" property is not exist.`)
                },
                set:(target,key,value)=>{
                    if(states.hasOwnProperty(key)){
                        store.$state[key] = value;
                        return true;
                    }
                    throw new ReferenceError(`Store.state "${key}" property is not exist.`)
                }
            });
            
            for(let name in members){
                const desc = members[name] as {[key:string]:any, value:Function, get:Function, set:Function};
                if(desc.permission==='private')continue;
                if(desc.label==='property'){
                    states[name] = desc.value;
                }
                if(desc.permission==='public'){
                    if(desc.label==='accessor'){
                        if(desc.get){
                            opts.getters[name] = desc.get.bind(proxy);
                        }
                    }else if(desc.label==='method'){
                        opts.actions[name] = desc.value.bind(proxy);
                    }
                }
            }

            const id = descriptor.namespace ? descriptor.namespace +'.'+ descriptor.className : descriptor.className;
            const make = defineStore(id, opts) as Function;
            const store = make() as StoreInstance
            this.instance = store;
            this.store = new Proxy(store, {
                set:(target,key,value)=>{
                    const desc = members[key] as {[key:string]:any, value:Function, get:Function, set:Function};
                    if(!desc){
                        throw new ReferenceError(`Store.state "${key}" property is not exist`)
                    }
                    if(desc.permission!=='public'){
                        throw new ReferenceError(`Store.state "${key}" ${desc.label} is not accessible`)
                    }
                    if(desc.label==='accessor'){
                        if(desc.set){
                            desc.set.call(proxy, value);
                            return true;
                        }else{
                            throw new ReferenceError(`Store.state "${key}" property is not writable.`)
                        }
                    }else if(desc.label==='property'){
                        if(desc.writable){
                            store.$state[key] = value;
                            return true;
                        }else{
                            throw new ReferenceError(`Store.state "${key}" property is not writable.`)
                        }
                    }else{
                        throw new ReferenceError(`Cannot assign value to the 'Store.${key}' method.`)
                    }
                },
                get:(target,key,receiver)=>{
                    if(['setState','patch','onAction','reset','subscribe','watch'].includes(key) ){
                        return this[key].bind(this);
                    }
                    return store[key];
                }
            });
        }

        protected store=null;
        protected instance:StoreInstance= null

        setState(name:string, value:any){
            this.instance.$state[name] = value;
        }

        getState<T=any>(name:string){
            return this.instance.$state[name] as T;
        }

        patch(data:vue.Record|(state:vue.Record)=>void){
            this.instance.$patch(data);
        }

        onAction(callback:(options:{
            name?:string,
            store?:{},
            args?:any[],
            after?:(callback:(...args)=>void)=>void,
            onError?:(callback:(...args)=>void)=>void,
        })=>void, always=false){
           return this.instance.$onAction(callback, always);
        }

        subscribe(callback:(mutation:vue.Record, state:vue.Record)=>void, options?:{detached: boolean}&vue.Record){
            this.instance.$subscribe(callback);
        }

        watch(callback:vue.WatchCallback<vue.Record>, options?:vue.WatchOptions):()=>void{
            return _watch(this.instance.$state, callback, options)
        }

        reset(){
            this.instance.$reset();
        }
    }


    declare interface StoreInstance{
        $state:vue.Record
        $onAction:(...args)=>(()=>void)
        $reset:(...args)=>void
        $patch:(...args)=>void
        $subscribe:(...args)=>void
        [key:string]:any
    }
    
}
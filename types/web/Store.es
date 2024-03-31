package web{

    import {defineStore, createPinia,getActivePinia,setActivePinia} from 'pinia'; 
    import {watch as _watch} from 'vue';
    class Store{

        static protected getInstances():Map<class<Store>,Store>{
            let dataset = System.getConfig('globals.webStoreInstances');
            if(!dataset){
                System.setConfig('globals.webStoreInstances', dataset=new Map());
            }
            return dataset;
        }

        static use<T extends class<Store>>(storeClass:T){
            let dataset = Store.getInstances();
            let instance = dataset.get(storeClass) as Store;
            if(!instance){
                if(dataset.size===0){
                    System.registerOnceHook('application:created', (app)=>{
                        const vue = (app as web.Application).getAttribute('vueApp');
                        const pinia =createPinia();
                        setActivePinia(pinia);
                        vue.use(pinia);
                    });
                }
                instance = new storeClass() as Store;
                instance.create();
                dataset.set(storeClass, instance);
            }
            return instance.storeProxy as T;
        }

        protected key = 'store';

        protected create(){
            const descriptor = Reflect.getDescriptor(this) || {};
            const states = {};
            const opts = {
                state:()=>states,
                getters:{},
                actions:{}
            };

            type DT = {[key:string]:any, value:Function, get:Function, set:Function};
            const members:{[key:string]:DT} = descriptor.members || {};
            const bindMethods = {};
            const selfMethods = ['setState','getState'];
            const selfProperties = ['store','key','instance'];
            const publicMethods = ['patch','onAction','reset','subscribe','watch','dispose']
            const _proxy = new Proxy(this, {
                get:(target,key,receiver)=>{
                    if(descriptor.privateKey === key){
                        return this[descriptor.privateKey];
                    }
                    const desc = members[key];
                    if(desc){
                        if(desc.label==='property'){
                            if(store.$state.hasOwnProperty(key)){
                                return store.$state[key];
                            }
                            return this[key];
                        }else if(desc.label==='accessor'){
                            if(desc.get){
                                return desc.get.call(this);
                            }else{
                                throw new ReferenceError(`Store property the "${key}" is not readable.`) 
                            }
                        }else if(desc.label==='method'){
                            if( bindMethods.hasOwnProperty(key) ){
                                return bindMethods[key];
                            }
                            return bindMethods[key] = desc.value.bind(this);
                        }
                    }else{
                        if(selfMethods.includes(key)){
                            if( bindMethods.hasOwnProperty(key) ){
                                return bindMethods[key];
                            }
                            return bindMethods[key] = (this[key] as Function).bind(this);
                        }else if(selfProperties.includes(key)){
                            return this[key];
                        }else{
                            key = String(key);
                            if(key==='Symbol(Symbol.toStringTag)'){
                                return this.toString()
                            }else{
                                return this.whenPropertyNotExists(key);
                            }
                        }
                    }
                },
                set:(target,key,value)=>{
                    const desc = members[key];
                    if(desc){
                        if(desc.label==='property'){
                            if(desc.permission==='public'){
                                store.$state[key]=value
                            }else{
                                this[key] = value;
                            }
                            return true
                        }else if(desc.label==='accessor'){
                            if(desc.set){
                                desc.set.call(this, value);
                                return true;
                            }
                        }
                        throw new ReferenceError(`Store property the "${key}" is not writable.`)
                    }else{
                        throw new ReferenceError(`Store property the "${key}" is not exist.`)
                    }
                }
            });
            
            for(let name in members){
                const desc = members[name];
                if(desc.permission!=='public')continue;
                if(desc.label==='property'){
                    states[name] = desc.value;
                }else if(desc.label==='accessor'){
                    if(desc.get){
                        opts.getters[name] = desc.get.bind(_proxy);
                    }
                }else if(desc.label==='method'){
                    opts.actions[name] = desc.value.bind(_proxy);
                }
            }

            const id = this.key+':'+(descriptor.namespace ? descriptor.namespace +'.'+ descriptor.className : descriptor.className);
            let store:StoreInstance = null;
            when( Env(mode, 'production', expect=false) ){
                const pinia = getActivePinia() as {_s:Map<string,any>}
                const oldFactory = pinia._s.get(id);
                const newFactory = defineStore(id, opts) as (...args)=>any;
                if(oldFactory){
                    store = newFactory(pinia, oldFactory);
                }else{
                    store = newFactory();
                }
            }then{
                const newFactory = defineStore(id, opts) as Function;
                store = newFactory();
            }

            this.storeInstance = store;
            this.storeProxy = new Proxy(store, {
                set:(target,key,value)=>{
                    const desc = members[key];
                    if(!desc){
                        throw new ReferenceError(`Store property the "${key}" is not exist`)
                    }
                    if(desc.permission!=='public'){
                        throw new ReferenceError(`Store ${desc.label} the "${key}" is not accessible`)
                    }
                    if(desc.label==='accessor'){
                        if(desc.set){
                            desc.set.call(this, value);
                            return true;
                        }else{
                            throw new ReferenceError(`Store property the "${key}" is not writable.`)
                        }
                    }else if(desc.label==='property'){
                        if(desc.writable){
                            store.$state[key] = value;
                            return true;
                        }else{
                            throw new ReferenceError(`Store state the "${key}" is not writable.`)
                        }
                    }else{
                        throw new ReferenceError(`Store property the "${key}" is not writable`)
                    }
                },
                get:(target,key,receiver)=>{
                    if(publicMethods.includes(key)){
                        if( bindMethods.hasOwnProperty(key) ){
                            return bindMethods[key];
                        }
                        return bindMethods[key] = (this[key] as Function).bind(this);
                    }
                    const desc = members[key];
                    if(!desc){
                        return this.whenPropertyNotExists(String(key))
                    }
                    if(desc.permission!=='public'){
                        throw new ReferenceError(`Store ${desc.label} the "${key}" is not accessible`)
                    }
                    return store[key];
                }
            });
        }

        protected storeProxy=null;
        protected storeInstance:StoreInstance= null

        protected setState(name:string, value:any){
            this.storeInstance.$state[name] = value;
        }

        protected getState<T=any>(name:string){
            return this.storeInstance.$state[name] as T;
        }

        protected whenPropertyNotExists(key){
            throw new ReferenceError(`Store property the "${key}" is not exist.`)
        }

        patch(data:vue.Record|(state:vue.Record)=>void){
            this.storeInstance.$patch(data);
        }

        onAction(callback:(options:{
            name?:string,
            store?:{},
            args?:any[],
            after?:(callback:(...args)=>void)=>void,
            onError?:(callback:(...args)=>void)=>void,
        })=>void, always=false){
           return this.storeInstance.$onAction(callback, always);
        }

        subscribe(callback:(mutation:vue.Record, state:vue.Record)=>void, options?:{detached: boolean}&vue.Record){
            this.storeInstance.$subscribe(callback);
        }

        watch(callback:vue.WatchCallback<vue.Record>, options?:vue.WatchOptions):()=>void{
            return _watch(this.storeInstance.$state, callback, options)
        }

        dispose(){
            this.storeInstance.$dispose();
        }

        reset(){
            this.storeInstance.$reset();
        }
    }

    declare interface StoreInstance{
        $state:vue.Record
        $onAction:(...args)=>(()=>void)
        $reset:(...args)=>void
        $patch:(...args)=>void
        $subscribe:(...args)=>void
        $dispose:()=>void
        [key:string]:any
    }

    declare interface PiniaInstance{
        install(app):void
        use(plugin):this
        _p:any[]
        _a:any
        _e:any
        _s:Map<string,any>
        state:{[key:string]:any}
    }
    
}
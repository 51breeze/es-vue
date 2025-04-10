package web{

    import {defineStore, createPinia,getActivePinia,setActivePinia} from 'pinia'; 
    import {watch as _watch} from 'vue';
    import {computed, ref, toRefs, markRaw} from '@vue/reactivity';
    class Store{

        static private getInstances():Map<class<Store>,Store>{
            let dataset = System.getConfig('globals.webStoreInstances');
            if(!dataset){
                System.setConfig('globals.webStoreInstances', dataset=new Map());
            }
            return dataset;
        }

        static private _plugins = []
        static setPlugins(plugins:any[]){
            _plugins.push(...plugins)
        }

        static private _getActivePinia():PiniaInstance{
            return System.getConfig('globals.store.pinia.active.instance') || getActivePinia();
        }

        @Main(false)
        static main(){
            when(Syntax('es-nuxt')){
                System.registerOnceHook('application:created', (app)=>{
                    const nuxt = app.getAttribute('nuxtApp') as Record;
                    const pinia = nuxt.$pinia as PiniaInstance
                    System.setConfig('globals.store.pinia.active.instance', pinia)
                    _plugins.forEach(plugin=>{
                        pinia.use(plugin)
                    })
                })
            }then{
                System.registerOnceHook('application:created', (app)=>{
                    const pinia =createPinia() as PiniaInstance
                    setActivePinia(pinia);
                    System.setConfig('globals.store.pinia.active.instance', pinia)
                    _plugins.forEach(plugin=>{
                        pinia.use(plugin)
                    })
                    const vue = app.getAttribute('vueApp');
                    vue.use(pinia);
                });
            }
        }

        static use<T extends class<Store>>(storeClass:T){
            let dataset = Store.getInstances();
            let instance = dataset.get(storeClass) as Store;
            if(!instance){
                instance = new storeClass() as Store;
                instance.create();
                dataset.set(storeClass, instance);
            }
            return instance.storeProxy as T;
        }

        protected key = 'store';

        protected getOptions(){
            return {}
        }

        protected getStorage(){
            return {}
        }

        protected create(){
            const descriptor = Reflect.getDescriptor(this);
            const states = this.getStorage();
            const getters = {};
            const actions = {};
            if(!descriptor){
                throw new Error("Invalid this object");
            }
            const members:MemberDescriptor[] = descriptor.members;
            const bindMethods = {};
            const selfMethods = ['setState','getState','whenPropertyNotExists','getOptions','getStorage'];
            const selfProperties = ['storeInstance','key','storeProxy'];
            const publicMethods = ['patch','onAction','reset','subscribe','watch','dispose']
            const _proxy = new Proxy(this, {
                get:(target,key,receiver)=>{
                    if(descriptor.isPrivatePropertyKey(key)){
                        return this[key];
                    }
                    if(selfMethods.includes(key)){
                        if( bindMethods.hasOwnProperty(key) ){
                            return bindMethods[key];
                        }
                        return bindMethods[key] = (this[key] as Function).bind(this);
                    }else if(selfProperties.includes(key)){
                        return this[key];
                    }

                    const desc = descriptor.getMemberDescriptor(key);
                    if(desc){
                        if(desc.isProperty()){
                            if(desc.isPublic()){
                                return store.$state[key];
                            }
                            return this[key];
                        }else if(desc.isAccessor()){
                            if(desc.getter){
                                return desc.invokeGetter(this);
                            }else{
                                throw new ReferenceError(`Store property the "${key}" is not readable.`) 
                            }
                        }else if(desc.isMethod()){
                            if( bindMethods.hasOwnProperty(key) ){
                                return bindMethods[key];
                            }
                            return bindMethods[key] = desc.value.bind(this);
                        }
                    }else{
                        key = String(key);
                        if(key==='Symbol(Symbol.toStringTag)'){
                            return this.toString()
                        }else{
                            return this.whenPropertyNotExists(key);
                        }
                    }
                },
                set:(target,key,value)=>{
                    const desc = descriptor.getMemberDescriptor(key);
                    if(desc){
                        if(desc.isProperty()){
                            if(desc.isPublic()){
                                store.$state[key]=value
                            }else{
                                this[key] = value;
                            }
                            return true
                        }else if(desc.isAccessor()){
                            if(desc.setter){
                                desc.invokeSetter(this, value);
                                return true;
                            }
                        }
                        throw new ReferenceError(`Store property the "${key}" is not writable.`)
                    }else{
                        throw new ReferenceError(`Store properties the "${key}" is not exist.`)
                    }
                }
            });

            members.forEach( desc=>{
                if(!desc.isPublic())return;
                if(desc.isProperty()){
                    if(!states.hasOwnProperty(desc.key)){
                        states[desc.key] = desc.value;
                    }
                }else if(desc.isAccessor()){
                    if(desc.getter){
                        getters[desc.key] = desc.getter.bind(_proxy);
                    }
                }else if(desc.isMethod()){
                    actions[desc.key] = desc.value.bind(_proxy);
                }
            })

            const pinia = _getActivePinia();
            const id = this.key+':'+(descriptor.namespace ? descriptor.namespace +'.'+ descriptor.className : descriptor.className);
            
            let setupOptions = {
                state:()=>states,
                getters,
                actions
            }

            let store:StoreInstance = null;
            let options = this.getOptions();

            when( Env(mode, 'production', expect=false) ){
                const oldStore = pinia._s.get(id);
                const newStore = defineStore(id, setupOptions, options) as Function;
                if(oldStore){
                    store = newStore(pinia, oldStore);
                }else{
                    store = newStore();
                }
            }then{
                const newStore = defineStore(id, setupOptions, options) as Function;
                store = newStore();
            }

            this.storeInstance = store;
            this.storeProxy = new Proxy(store, {
                set:(target,key,value)=>{
                    const desc = descriptor.getMemberDescriptor(key);
                    if(!desc){
                        throw new ReferenceError(`Store property the "${key}" 222 is not exist`)
                    }
                    if(!desc.isPublic()){
                        throw new ReferenceError(`Store ${desc.label} the "${key}" is not accessible`)
                    }
                    if(desc.isAccessor()){
                        if(desc.setter){
                            desc.invokeSetter(this, value);
                            return true;
                        }else{
                            throw new ReferenceError(`Store property the "${key}" is not writable.`)
                        }
                    }else if(desc.isProperty()){
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
                    if(key==="$id"){
                        return store[key];
                    }
                    if(publicMethods.includes(key)){
                        if( bindMethods.hasOwnProperty(key) ){
                            return bindMethods[key];
                        }
                        return bindMethods[key] = (this[key] as Function).bind(this);
                    }
                    const desc = descriptor.getMemberDescriptor(key);
                    if(!desc){
                        return this.whenPropertyNotExists(String(key))
                    }
                    if(!desc.isPublic()){
                        throw new ReferenceError(`Store ${desc.label} the "${key}" is not accessible`)
                    }
                    //getters computed 在服务端使用了缓存导致与客户端状态不同步
                    when(Env(platform, server)){
                        when(Env(mode, development)){
                            if(desc.getter){
                                return desc.invokeGetter(this)
                            }
                        }
                    }
                    return store[key];
                }
            });
        }

        protected storeProxy=null;
        protected storeInstance:StoreInstance= null

        protected setState(name:string, value:any){
            this.storeInstance.$state[':'+name] = value;
        }

        protected getState<T=any>(name:string){
            return this.storeInstance.$state[':'+name] as T;
        }

        protected whenPropertyNotExists(key){
            throw new ReferenceError(`Store property the "${key}" is not exist.`)
        }

        patch(data:Record|(states:Record)=>void){
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

        subscribe(callback:(mutation:Record, state:Record)=>void, options?:{detached: boolean}&Record){
            this.storeInstance.$subscribe(callback);
        }

        watch(callback:vue.WatchCallback<Record>, options?:vue.WatchOptions):()=>void{
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
        $state:Record
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
        state:{value:Record<Record<any>>}
    }
}



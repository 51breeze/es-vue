package web.components{

    import web.IApplication;

    @WebComponent
    declare class Component implements IEventDispatcher {

        static getAttribute<T>(target:Component,name:string):T;
        static getPolyfillValue(value:any, name:string, classModule:class<any>):any;

        constructor(props?:{[key:string]:any});

        @Noop
        protected onInitialized():void;
        @Noop
        protected onBeforeMount():void;
        @Noop
        protected onMounted():void;
        @Noop
        protected onBeforeUpdate():void;
        @Noop
        protected onUpdated():void;
        @Noop
        protected onBeforeUnmount():void;
        @Noop
        protected onUnmounted():void;
        @Noop
        protected onActivated():void;
        @Noop
        protected onDeactivated():void;
        @Noop
        protected onErrorCaptured():void;
        @Noop
        protected render():vue.VNode | Component;
        protected receivePropValue<T>(value:T,name:string):T;
        protected beforeReceiveProp(value:any,name:string):boolean;
        protected withAsyncContext<T=any>(handler:()=>Promise<T>):[Promise<T>, ()=>void]
        protected createVNode(name:string|Component,data?:VNodeDataConfig,children?:VNode|Component[]):VNode;
        
        get parent():Component|vue.ComponentPublicInstance;
        get children():Component[];
        get element():HTMLElement;

        getParentComponent( filter:boolean | (child?:Component|vue.ComponentPublicInstance)=>boolean ):Component|vue.ComponentPublicInstance;

        /**
        * 获取应用实例
        * 此访问器在子类中不可重写
        * @return IApplication
        */
        final get app():IApplication

        slot( name:string , scope?:boolean, called?:boolean, params?:object ):VNode|Component[];
        reactive<T>(name:string, value?:T, initValue?:any):T;
        reference<T>(value?:T,shallowFlag?:boolean):vue.Ref<T>;
        observable<T extends object>(target:T):T;
        nextTick(callback:()=>void):void;
        forceUpdate();
        provide(name:string, provider:()=>any):void;
        inject<T=any>(name:string, from?:string, defaultValue?:T):T;
        watch(name: string, callback:(uewVlaue?,oldValue?)=>void, options?:boolean | {immediate?:boolean,deep?:boolean}):void;
        getRoute():web.components.Route | null;
        getRefs<T=NodeElementType | NodeElementType[]>(name:string, toArray=false):T;
        toValue<T>(value:T):T;
        getAttribute<T>(name:string):T;
        getAttribute(name:'vueApp'):vue.App;
        on(type: string, listener:(...args)=>void):void;
        off(type: string, listener?:(...args)=>void):void;
        emit(type: string, ...args?:any[]):void;
        addEventListener(type: string, listener: (event?:Event)=>void):this;
        dispatchEvent(event: Event):boolean;
        removeEventListener(type: string, listener?: (event?:Event)=>void):boolean;
        hasEventListener(type: string, listener?: (event?:Event)=>void):boolean;
    }

    declare type NodeElementType = HTMLElement | Component;
    
    declare type VNodeDataConfig = {
        props?:{},
        data?:()=>{},
        on?:{},
        style?:{},
        className?:string,
        ref?:string
    };
}




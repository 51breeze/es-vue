package web.components{

    import web.IApplication;

    @WebComponent
    declare class Component implements IEventDispatcher {

        static getAttribute<T>(target:Component,name:string):T;
        static getPolyfillValue(value:any, name:string, classModule:class<any>):any;
        static createComponent<T extends class<Component>>(classModule:T, options:Record):T;
        static resolveDirective(options:Record):any[];
        static getCompnentInstanceByVNode<T extends Component=Component>(vnode):T;

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
        protected render():VNode | Component;
        protected receivePropValue<T>(value:T,name:string):T;
        protected beforeReceiveProp(value:any,name:string):boolean;
        protected withAsyncContext<T=void>(handler:()=>T):[T, ()=>void]
        protected withContext<T=void>(handler:()=>T):T;
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

        @Deprecated
        slot( name:string , scope?:boolean, called?:boolean, params?:object ):(VNode|Component)[];

        hasSlot(name?:string):boolean;
        renderSlot(name?:string,props?:Record,fallback?:(...args)=>(VNode | Component)[]):VNode;

        reactive<T>(name:string, value?:T, initValue?:any):T;
        reference<T>(value:T,shallowFlag?:boolean):vue.Ref<T>;
        observable<T extends object>(target:T):T;
        nextTick(callback:()=>void):void;
        forceUpdate();
        provide(name:string, provider:()=>any):void;
        inject<T=any>(name:string, from?:string, defaultValue?:T):T;
        watch<T=any>(name:string, callback:vue.WatchCallback<T>, options?:boolean | vue.WatchOptions):()=>void;
        watch<T=any>(name:vue.WatchSource<T>, callback:vue.WatchCallback<T>, options?:boolean | vue.WatchOptions):()=>void;
        getRoute():web.components.Route | null;
        getRefs<T=NodeElementType>(name:string):T;
        getRefs<T=NodeElementType[]>(name:string, toArray:boolean):T;
        toValue<T>(value:T): T;
        toValue<T extends vue.Ref>(value:T):T['value'];
        getAttribute<T=any>(name:string):T;
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




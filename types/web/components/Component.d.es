package web.components{

    @WebComponent
    declare class Component implements IEventDispatcher {
        public constructor( options?:any );
        protected onReceiveProps(props:object):object;
        protected onInitialized():void;
        protected onBeforeMount():void;
        protected onMounted():void;
        protected onBeforeUpdate():void;
        protected onUpdated():void;
        protected onBeforeUnmount():void;
        protected onUnmounted():void;
        protected onActivated():void;
        protected onDeactivated():void;
        protected onErrorCaptured():void;
        protected render():Node|Component;
        public get parent():Component;
        public get children():Component[];
        public getConfig():object;
        public slot( name:string , scope?:boolean, called?:boolean, params?:object ):NodeElementResult[];
        public createElement(name:string|Component,data?:NodeDataConfig,children?:NodeElementResult[]):NodeElementResult;
        public getElementByName(name:string):NodeElementResult | NodeElementResult[];
        public forceUpdate();
        public on(type: string, listener:(...args)=>void):void;
        public off(type: string, listener?:(...args)=>void):void;
        public emit(type: string, ...args?:any[]):void;
        public watch(name: string, callback:(uewVlaue?,oldValue?)=>void):void;
        public reactive<T>(name:string, value?:T):T;
        public mount( element?:string|Node ):this;
        public observable<T extends object>(target:T):T;
        public nextTick(callback:()=>void):void;
        public destroy():void;
        /**
        * 获取原始对象中的属性
        */
        public getAttribute<T>(name:string):T;
        public addEventListener(type: string, listener: (event?:Event)=>void):this;
        public dispatchEvent(event: Event):boolean;
        public removeEventListener(type: string, listener?: (event?:Event)=>void):boolean;
        public hasEventListener(type: string, listener?: (event?:Event)=>void):boolean;
    }

    declare internal type NodeElementResult = Node | Component;
    
    declare internal type NodeDataConfig = {
        props?:{},
        data?:()=>{},
        on?:{},
        style?:{},
        className?:string,
        ref?:string
    };
}




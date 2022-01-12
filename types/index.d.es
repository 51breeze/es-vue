package web.ui{

    declare class Viewport extends web.components.Component{
        name:string;
    }

    declare class KeepAlive extends web.components.Component{}
    
    declare class Link extends web.components.Component{
        exact:boolean;
        activeClass:string;
        exactActiveClass:string;
        ariaCurrentValue:'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
        append:boolean;
        replace:boolean;
        tag:string;
        event:string[];
    }

    @import(ElSelect = "element-ui/packages/select")
    @Embed('element-ui/lib/theme-chalk/select.css')
    declare class ElSelect extends web.components.Component{

        /**
        * 绑定值
        */
        value:any;
        /**
        * select input 的 name 属性
        */
        name:string;
        /**
        * select input 的 autocomplete 属性
        */
        autocomplete:'off' | 'auto';
        /**
        * 占位符
        */
        placeholder:string;
        /**
        * 是否多选
        */
        multiple:boolean = false;
        /**
        * 是否禁用
        */
        disabled:boolean = false;
        /**
        * 是否可以清空选项
        */
        clearable:boolean = false;
        /**
        * 是否可搜索
        */
        filterable:boolean = false;
        /**
        * 是否允许用户创建新条目，需配合 filterable 使用
        */
        allowCreate:boolean = false;
        /**
        * 自定义搜索方法
        */
        filterMethod:(queryString: string)=>void;

        /**
        * 是否为远程搜索
        */
        remote:boolean = false;
        /**
        * 远程搜索方法
        */
        remoteMethod:(queryString: string)=>void;
        /**
        * 是否正在从远程获取数据
        */
        loading:boolean = false;
        /**
        * 是否正在从远程获取数据
        */
        loadingText:string = '加载中';
        /**
        * 多选时是否将选中值按文字的形式展示
        */
        collapseTags:boolean = false;
        /**
        * 作为 value 唯一标识的键名，绑定值为对象类型时必填
        */
        valueKey:string='value';
        /**
        * 输入框尺寸
        */
        size:'large' | 'medium' | 'small' | 'mini';
        /**
        * 多选时用户最多可以选择的项目数，为 0 则不限制
        */
        multipleLimit:number=0;

        /**
        * 使 input 获取焦点
        */
        focus(): void

        /**
        * 使 input 失去焦点，并隐藏下拉框
        */
        blur(): void
    }

    @import(Option = "element-ui/packages/option")
    declare class Option extends web.components.Component{
        multiple:boolean = false;
    }

    @import(Notification = "element-ui/packages/notification")
    @Embed('element-ui/lib/theme-chalk/notification.css');
    @Embed('element-ui/lib/theme-chalk/icon.css');
    declare class Notification{
        @Callable
        constructor(options:{title:string,message:string});
    }
   
}


package web.components{

    @import(Vue = "vue")
    declare class Vue{
        constructor(props?:object);
        static extend( options:object );
        static use(plugin):void;
        static component(name:string):web.components.Component;
        static get options():object;
    }

    @import(Router = "vue-router")
    declare class Router{
        static const START_LOCATION:RouteConfig;
        mode:string;
        base:string;
        currentRoute:RouteConfig;
        push(location: RouteLocation, onComplete?:()=>void, onAbort?:()=>void):Promise<any>;
        replace(location: RouteLocation, onComplete?:()=>void, onAbort?:()=>void):Promise<any>;
        go( value?:number ):void;
        back():void;
        forward():void;
        beforeEach( callback:(to:Route, from:Route, next:()=>void) =>void );
        beforeResolve( callback:(to:Route, from:Route, next:()=>void) =>void );
        afterEach( callback:(to:Route, from:Route) =>void );
        getMatchedComponents( location?:RouteLocation ):Component[];
        resolve( location?:RouteLocation, current?, append? ):{ location:RouteLocation,route:Route, href:string};
        addRoute(route:RouteConfig,parentPath?:string);
        getRoutes():Route[];
        onReady( done:()=>void, error?:()=>void ):void;
        onError( error?:()=>void ):void;
    }

    declare type RouteLocation=string | { name?:string, path?:string, params?:{} }

    declare type Route={
        path:string,
        params?:{},
        query?:{},
        hash?:string,
        name?:string,
        redirectedFrom?:string,
        fullPath?:string,
        matched?:Route[],
    }

    declare type RouteConfig={
        path: string,
        component ?: Component,
        name?: string,
        components?: { [string]:Component }, 
        redirect?: RouteLocation | Function,
        props?: boolean | {} | (name)=>any,
        alias?: string | string[],
        children?: RouteConfig[],
        beforeEnter?: (to: Route, from: Route, next: ()=>void) => void,
        meta?: any,
        caseSensitive?: boolean, 
        pathToRegexpOptions?: object 
    }

    declare class State{
        public constructor(name:string);
    }

    class ComponentEvent extends Event{
        static const BEFORE_CREATE:string = 'componentBeforeCreate';
        static const BEFORE_MOUNT:string = 'componentBeforeMount';
        static const BEFORE_UPDATE:string = 'componentBeforeUpdate';
        static const BEFORE_DESTROY:string = 'componentBeforeDestroy';
        static const ERROR_CAPTURED:string = 'componentErrorCaptured';
        static const UPDATED:string = 'componentUpdated';
        static const MOUNTED:string = 'componentMounted';
        static const CREATED:string = 'componentCreated';
        static const ACTIVATED:string = 'componentActivated';
        static const DEACTIVATED:string = 'componentDeactivated';
        static const DESTROYED:string = 'componentDestroyed';
        public constructor(type:string, bubbles?:boolean,cancelable?:boolean){
            super(type);
        }
    }

    @WebComponent
    declare class Component implements IEventDispatcher {
        public constructor( options?:any );
        protected onReceiveProps(props:object):object;
        protected onInitialized():void;
        protected onBeforeMount():void;
        protected onMounted():void;
        protected onShouldUpdate(newVlaue:any,oldValue:any):boolean;
        protected onBeforeUpdate():void;
        protected onUpdated():void;
        protected onBeforeUnmount():void;
        protected onUnmounted():void;
        protected onActivated():void;
        protected onDeactivated():void;
        protected onErrorCaptured():void;
        protected render():Node|Component;
        public slot( name:string , scope?:boolean, called?:boolean, params?:object ):NodeElementResult[];
        public createElement(name:string|Component,data?:NodeDataConfig,children?:NodeElementResult[]):NodeElementResult;
        public getElementByRefName(name:string):NodeElementResult | NodeElementResult[];
        public forceUpdate();
        public on(type: string, listener:(...args)=>void):void;
        public off(type: string, listener?:(...args)=>void):void;
        public emit(type: string, ...args?:any[]):void;
        public watch(name: string, callback:(uewVlaue?,oldValue?)=>void):void;
        public get parent():Component;
        public get children():Component[];
        public data<T=any>(name?:string, value?:any):T;
        public mount( element?:string|Node ):this;
        public nextTick(callback:()=>void):void;
        public destroy():void;
        public addEventListener(type: string, listener: (event?:Event)=>void):this;
        public dispatchEvent(event: Event):boolean;
        public removeEventListener(type: string, listener?: (event?:Event)=>void):boolean;
        public hasEventListener(type: string, listener?: (event?:Event)=>void):boolean;
    }

    declare type NodeElementResult = Node | Component;
    declare type NodeDataConfig = {
        props?:{},
        data?:()=>{},
        on?:{},
        style?:{},
        className?:string,
        ref?:string
    };
}
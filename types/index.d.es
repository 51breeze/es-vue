package web.ui{

    declare class Viewport extends web.components.Component{
        name:string;
    }

    /**
    * <transition> 元素作为单个元素/组件的过渡效果。<transition> 只会把过渡效果应用到其包裹的内容上，而不会额外渲染 DOM 元素，也不会出现在可被检查的组件层级中。
    */
    @define(slot,'default')
    declare class Transition extends web.components.Component{
        /**
        * 用于自动生成 CSS 过渡类名。例如：name: 'fade' 将自动拓展为 .fade-enter，.fade-enter-active 等。默认类名为 "v"
        */
        name:string
        /**
        * 是否在初始渲染时使用过渡。默认为 false
        */
        appear:boolean = false
        /**
        * 是否使用 CSS 过渡类。默认为 true。如果设置为 false，将只通过组
        */
        css:boolean = true
        /**
        * 指定过渡事件类型，侦听过渡何时结束。有效值为 "transition" 和 "animation"。默认将自动检测出持续时间长的为过渡事件类型。
        */
        type:"transition" | "animation"
        /**
        * 控制离开/进入过渡的时间序列
        */
        mode:"out-in" | "in-out"
        /**
        * 指定过渡的持续时间。默认情况下会等待过渡所在根元素的第一个 transitionend 或 animationend 事件
        */
        duration:number | {enter: number, leave: number}

        enterClass:string
        leaveClass:string
        appearClass:string
        enterToClass:string
        leaveToClass:string
        appearToClass:string
        enterActiveClass:string
        leaveActiveClass:string
        appearActiveClass:string
    }

    /**
    * <transition-group> 元素作为多个元素/组件的过渡效果。<transition-group> 渲染一个真实的 DOM 元素。默认渲染 <span>，可以通过 tag attribute 配置哪个元素应该被渲染。
    * 注意，每个 <transition-group> 的子节点必须有独立的 key，动画才能正常工作
    * <transition-group> 支持通过 CSS transform 过渡移动。当一个子节点被更新，从屏幕上的位置发生变化，它会被应用一个移动中的 CSS 类 (通过 name attribute 或配置 move-class attribute 自动生成)。
    * 如果 CSS transform property 是“可过渡”property，当应用移动类时，将会使用 FLIP 技术使元素流畅地到达动画终点。
    */
    declare class TransitionGroup extends Transition{
        tag:string= 'span'
        moveClass:string
    }

    /**
    * 过渡事件名集合
    */
    class TransitionEvent{
        static const BEFORE_ENTER= 'before-enter'
        static const BEFORE_LEAVE= 'before-leave'
        static const BEFORE_APPEAR='before-appear'
        static const ENTER='enter'
        static const LEAVE='leave'
        static const APPEAR='appear'
        static const AFTER_ENTER='after-enter'
        static const AFTER_LEAVE='after-leave'
        static const AFTER_APPEAR='after-appear'
        static const ENTER_CANELLED='enter-cancelled'
        static const LEAVE_CANELLED= 'leave-cancelled'
        static const APPEAR_CANCELLED='appear-cancelled'
    }

    /**
    * <keep-alive> 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。
    * 和 <transition> 相似，<keep-alive> 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。
    * 当组件在 <keep-alive> 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。
    */
    @define(slot,'default')
    declare class KeepAlive extends web.components.Component{
        /**
        * 只有名称匹配的组件会被缓存
        */
        include:string | RegExp

        /**
        * 任何名称匹配的组件都不会被缓存
        */
        exclude:string | RegExp

        /**
        *最多可以缓存多少组件实例
        */
        max:number | string
    }

    
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

    @define(slot,'prefix')
    @define(slot,'default')
    @import(ElSelect = "element-ui/packages/select")
    @Embed('element-ui/lib/theme-chalk/select.css')
    @Embed('element-ui/lib/theme-chalk/icon.css');
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
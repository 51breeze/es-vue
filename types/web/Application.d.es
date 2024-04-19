package web{
  
    import web.components.Router;
    import web.components.RouteConfig;
    import web.components.Component;
    import '#es-vue-web-application-style';

    declare class Application extends Component implements IApplication{
        constructor( options?:object );
    }

    declare interface IApplication extends IEventDispatcher{

        /**
        * 获取一个路由器的实例
        * @return web.components.Router;
        */
        get router():Router

        /**
        * 获取路由配置
        * return RouteConfig[];
        */
        get routes():RouteConfig[];

        /**
        * 获取一个语言包实例，通常为 i18n 实例对象
        * return web.Lang;
        */
        get locale():web.Lang | null

        /**
        * 获取一个全局数据存储实例，通常为 Store 实例对象
        * return web.Store;
        */
        get store():web.Store | null

        get globals():{[key:string]:any} | null;

        /**
        * 获取应用配置
        */
        get config():{[key:string]:any};

        /**
        * 获取需要混入全局的方法
        * return object;
        */
        mixin(name:string, method:Function):this;
        provide(name:string, value:any):this;
        plugin( plugin:any ):this;

        /**
        * 挂载并显示整个应用的页面
        */
        mount(el:string | Node):void
        unmount():void;
    }
}
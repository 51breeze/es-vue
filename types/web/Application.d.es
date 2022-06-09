@Reference('./components');
package web{
    import web.components.Component;
    import web.components.Router;
    import web.components.RouteConfig;
    @Import(Vue = "vue");
    class Application{

        private _router:Router;
        private _app:any = null;

        /**
        * 获取应用实例
        * 此访问器在子类中不可重写
        * @return object
        */
        final get app(){
            return this._app;
        }

        /**
        * 获取一个路由器的实例
        * @return web.components.Router;
        */
        get router(){
            const router = this._router;
            if( router )return router;
            return this._router = new Router({
                routes:this.routes
            });
        }

        /**
        * 获取路由配置
        * return RouteConfig[];
        */
        get routes():RouteConfig[]{
            return [];
        }

        /**
        * 获取一个语言包实例，通常为 i18n 这种实例对象
        * return object;
        */
        get locale(){
            return null;
        }

        /**
        * 获取一个全局数据存储实例，通常为 Store 这种实例对象
        * return object;
        */
        get store(){
            return null;
        }

        /**
        * 获取需要混入全局的方法
        * return object;
        */
        get mixins():{[key:string]:Function}{
           return null;
        }

        /**
        * 获取需要注入到根应用的初始选项。这部分的属性可以通过实例组件Component.getAttribute的方法获取到。
        * return object;
        */
        get options(){
            return {
                router:this.router,
                locale:this.locale,
                store:this.store,
            };
        }

        /**
        * 子级元素渲染方法，此方法必须在子类中重写。
        */
        render():Node | Component{
           throw new Error('application render method must overwrite in subclass');
        }

        /**
        * 挂载并显示整个应用的页面
        */
        mount(el:string | Node){
            if(this._app)return this;
            const mixins = this.mixins;
            if( mixins ){
                Vue.mixin({
                    methods:mixins
                });
            }
            const options = this.options;
            options.el = el;
            options.render=(h)=>{
                return this.render(h);
            }
            this._app = new Vue(options);
            return this;
        }
    }
}
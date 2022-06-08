@Reference('./components');
package web{
    import web.components.Component;
    import web.components.Router;
    import web.components.RouteConfig;
    @Import(Vue = "vue");
    class Application{

        private _router:Router;
        private _app:any = null;

        get router(){
            const router = this._router;
            if( router )return router;
            return this._router = new Router({
                routes:this.getRoutes()
            });
        }

        final get app(){
            return this._app;
        }

        get locale(){
            return null;
        }

        get store(){
            return null;
        }

        getRoutes():RouteConfig[]{
            return [];
        }

        getOptions(){
            return {
                router:this.router,
                locale:this.locale,
                store:this.store,
            };
        }

        render(createElement?):Node | Component{
           throw new Error('application render method must overwrite in subclass');
        }

        mount(el:string | Node){
           if(this._app)return this;
           const options = this.getOptions();
           options.el = el;
           options.render=(h)=>{
               return this.render(h);
           }
           this._app = new Vue(options);
           return this;
        }
    }
}
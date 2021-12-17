package vue;

import PersonSkin;
import Test;
import web.Vue;
import web.Router;
import web.ui.Viewport;
import Person;
import web.components.Component

class Index{

    @main
    static main(){

        const router = new Router({
            routes:[
                {
                    path:"/index",
                    component:Person
                },
                 {
                    path:"/test",
                    component:PersonSkin
                }
            ]
        });

        const p = new Test({
            router
        });

        p.name = "深圳";
        p.mount('#app');

    }
}
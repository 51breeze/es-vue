package;

import PersonSkin;
import Test;
import web.components.Router;
import web.components.Viewport;
import Person;
import web.components.Component;
import web.Application;

class Index extends Application{

    @main
    static main(){
        setTimeout(()=>{
            const index = new Index();
            index.mount('#app')
        },100)
    }

    @Override
    render(){
        return <Test />;
    }

    get routes(){
        console.log( super.routes )
        return super.routes;
    }

    // get router(){
    //     return new Router({
    //             mode:'hash',
    //             routes:[
    //                 {
    //                     path:"/index",
    //                     component:Person
    //                 },
    //                 {
    //                     path:"/test",
    //                     component:PersonSkin
    //                 }
    //             ]
    //     });
    // }

}
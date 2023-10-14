package karma;

import web.components.Router;
import web.components.Viewport;
import karma.pages.Home;
import karma.pages.List;
import web.components.Component;
import web.events.ComponentEvent;
import web.Application;
import web.components.Link;
import karma.asserts.IndexAssert;
import karma.Manger;
import karma.ui.Layout;

import "../theme.scss";

class Index extends Application{

   // @main
    static main(){
        
        const obj = new Index();
        const app = document.createElement('div')
        document.body.append( app );
        obj.mount(app);
    }

    async start(){

    }

    constructor(){
        super();
        Manger.getInstance().setApp( this );
        Manger.getInstance().register('routes',()=>{
            return this.routes;
        });
    }

    onMounted(){
        when( Env(testframework, 'karma') ){
            new IndexAssert(this as Component );
        }
    }

    private _router:Router;

    @Override
    get router(){
        if(_router)return _router;
        return _router = new Router({
            mode:'hash',
            routes:this.routes
        });
    }

    @Override
    get routes(){
        return [
            {
                path:"/",
                name:'default',
                redirect:'/home',
            },
            {
                path:"/home",
                name:'Home',
                meta:{title:"Home"},
                component:Home
            },
            {
                path:"/list",
                name:'List',
                meta:{title:"List"},
                component:List
            }
        ]
    }

    title:string = 'Karma Testing';

    styles = 'ssss';

    @Override
    render(){
        const styles={
            padding:"0 1rem"
        }
        return <div xmlns:d="@directives" >
            <h5 class="title">{title}</h5>
            <div class="menus">
                <d:each name={this.router.getRoutes()} item="route" key="index">
                    <Link to={route.path} ref='menu' key={index} style={styles}>{route.name}</Link>
                </d:each>
            </div>
            <br />
            <Layout />
        </div>
    }

}
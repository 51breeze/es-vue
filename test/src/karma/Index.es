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

import web.Lang;

import "../theme.scss";

class Index extends Application{

   // @main
    static main(){

        const obj = new Index();
        const app = document.createElement('div')
        document.body.append( app );
        obj.mount(app);

        const lang = Lang.use();

        console.trace( lang.format('home.start', {start:'2002.12'}), lang.getLocale() , '---------------', Lang.format('home.start', {start:'2002.12'}), Lang.format('Begin', {}), Lang.format('start', {start:'2012'}) )
    }

    async start(arg){
         const obj = {};
        obj.test ??= null;
        obj.test?.name;
        //const name = obj ?? 12
    }

    constructor(){
        super();
        Manger.getInstance().setApp( this );
        Manger.getInstance().register('routes',()=>{
            return this.routes;
        });
    }

    
    get globals(){
        return {
            Lang
        }
    }

    @Override
    onMounted(){
        when( Env(testframework, 'karma') ){
            new IndexAssert(this as Component );
        }

        const lang = Lang.use();
        console.log('onMounted', lang.fetch('home.title') )
        this.title = lang.fetch('home.title');
    }

    private _router:Router;

    
    get router(){
        if(_router)return _router;
        return _router = new Router({
            mode:'hash',
            routes:this.routes
        });
    }

    
    get routes(){

        const ro = super.routes;
        console.log( ro )

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

    get locale(){
        return Lang.use();
    }

    title:string = 'Karma Testing555';

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
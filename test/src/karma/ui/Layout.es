package karma.ui;

import web.components.Component
import web.components.Viewport
import karma.ui.Sidebar;
import web.components.Router;
import web.components.RouteConfig;
import karma.Manger;

class Layout extends Component{

    @Override
    render(){
        const routes = Manger.getInstance().get<RouteConfig[]>("routes");
        const route = this.getAttribute<RouteConfig>('route');
        // if( route && route.path=== "/login" ){
        //     return <Viewport />
        // }
        console.log( '-----Layout render-----')
        return <div class='app' style={{display:"flex"}}>
            <Sidebar routes={routes} width={220} />
            <div class='right'>
                <div class="container"><Viewport /></div>
            </div>
        </div>
    }

}

<style>
    .app{
        display:flex;
        border-top:solid 1px #ebebeb;
    }
    .app > .right{
        width:100%;
        display:flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .app > .right > .container{
        width:100%;
        height:100%;
    }
</style>





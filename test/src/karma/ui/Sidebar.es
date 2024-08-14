package karma.ui;

import web.components.Component
import web.ui.Scrollbar;
import web.ui.Menu;
import web.ui.MenuItem;
import web.ui.MenuSubitem;
import web.components.RouteConfig;
import web.components.Link;

class Sidebar extends Component{

    routes:RouteConfig[] = [];
    height:number=window.innerHeight-1;
    width:number=200;
    logoHeight:number = 48;
    title:string = '用户咨询列表'

    makeItems(routes:RouteConfig[]){
        return routes.filter( item=>{
            const res = (item as {show:boolean}).show;
            return (res !== false) as boolean;
        }).map( (item)=>{
            const has = item.children &&  item.children.length > 0;
            if( has ){
                return <MenuSubitem index={item.path}>
                    <span slot:title>{item.meta && item.meta.title}</span>
                    {this.makeItems( item.children )}
                </MenuSubitem>
            }else{
                return <MenuItem index={item.path} style={{minWidth:"100%"}}>
                   <Link to={item.path}>{item.meta && item.meta.title}</Link>
                </MenuItem>
            }
        });
    }

    @Override
    onMounted(){
        window.addEventListener('resize',()=>{
            this.height = window.innerHeight-1;
        });
    }

    @Override
    render(){

        const style = {
            width:`${width}px`,
            height:`${height}px`,
            color:"#fff",
            fontSize:"14px",
            background:"#fff",
            borderRight:"solid 1px #ebebeb"
        };

        // const logoStyle = {
        //     width:"100%",
        //     height:`${logoHeight}px`,
        //     display:"flex",
        //     justifyContent:"center",
        //     alignItems:"center",
        //     color:"#000",
        // };

        // const imgStyle = {
        //     maxHeight:`${logoHeight-logoHeight*0.3}px`,
        //     marginRight:"8px"
        // };

        const wrapStyle = [{
            overflowX:"hidden",
            height:`${height}px`
        }]

        console.log('----Sidebar-render----'  );

        return <div style={style}>
            <Scrollbar wrapStyle={wrapStyle}>
                <Menu mode='vertical' collapse={false} style={{borderRight:"none"}}>
                    {makeItems(routes)}
                </Menu>
            </Scrollbar>
        </div>
    }


}

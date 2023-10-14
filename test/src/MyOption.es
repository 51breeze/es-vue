package{

    import web.components.Component;
    import PersonSkin;
    import web.ui.Option;

    class MyOption extends Component{

        @override
        render(){
            console.log( this, '------------MyOption-----' )
            return this.createVNode( Option, this.getConfig() as web.components.VNodeDataConfig, {default:()=>{
                const child = this.slot('default') as any;
                if( typeof child ==='function' ){
                    return child()
                }
                return child;
            }} as any )
        }
    }
}
package{

    import web.components.Component;
    import PersonSkin;
    import web.ui.Button;
    import MyView;

    import web.ui.InfiniteScroll;

    class Person extends Component{

        constructor( options ){
            super(options);
        }

        get name():string{
            return this.reactive<string>('name');
        }

        set name(value:string){
            this.reactive('name', value);
        }

        @override
        onMounted(){
             setTimeout( ()=>{
                 this.reactive('name', '=====手动设置不再接收上级的值 66666=====')
             }, 1000);
        }

        @override
        render(){

            return <div xmlns:slot="@slots" xmlns:d="@directives" xmlns:dd="@directives"  >

                       <d:if condition="true" >
                        <div>====the is if=============</div>
                       </d:if>     

                        <InfiniteScroll value="sdfd" >
                            <div>ssssssssssss</div>
                        </InfiniteScroll>

                        <PersonSkin name={this.name} d:show="false" >
                            <slot:foot scope="props">
                                <div>====the is PersonSkin child====</div>
                                <div>the scope value:{props.props}</div>
                            </slot:foot>
                            <slot:default>
                               ==================
                            </slot:default>
                        </PersonSkin>

                        <div id="@person-root-child">Person page</div>


                        <Button> button </Button>
                        <web.ui.TextLink type='primary'> text link </web.ui.TextLink>
                        <web.ui.Upload action='http://sss.com/upload' dataset={{name:'yejun'}} drag={true} > 
                            <slot:trigger>
                               <div>===========</div>
                            </slot:trigger>
                            Upload
                         </web.ui.Upload>
                     
                       
                       
                    </div>
        }

    }

}
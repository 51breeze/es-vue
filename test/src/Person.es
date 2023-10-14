package{

    import web.components.Component;
    // import PersonSkin;
     import web.ui.Button;
    // import MyView;

    //import web.ui.InfiniteScroll;

   // import 'element-plus/theme-chalk/base.css';
   

    class Person extends Component{

        constructor( options ){
            super(options);
            console.log( options )
        }

        get name():string{
            return this.reactive<string>('name');
        }

        set name(value:string){
            this.reactive('name', value);
        }

        private get age(){
            return 30
        }

        private set add(value:string){
            
        }

        @Reactive
        private value:string = '';
       
        @override
        onMounted(){
             setTimeout( ()=>{
                 this.reactive('name', '=====手动设置不再接收上级的值 =======11111==')
             }, 1000);
        }

        @override
        render(h){

            return <div xmlns:slot="@slots" xmlns:d="@directives" xmlns:dd="@directives" xmlns:ui="web.ui"  >

                       <d:if condition="true" >
                        <div>====the is if=0000000000====</div>
                       </d:if>

                       <div>{name}</div>

                       <ui:Input bind:value={value}></ui:Input>
                       <ui:Icon><Plus /></ui:Icon>

                       <ui:Form>
                            <ui:FormItem label = "account">
                                <ui:Input bind:value={value}></ui:Input>
                            </ui:FormItem>
                       </ui:Form>

                        <div id="@person-root-child">Person page</div>


                        <Button> button </Button>
                        <web.ui.TextLink type='primary'> text link </web.ui.TextLink>
                        <web.ui.Upload action='http://sss.com/upload' dataset={{name:'yejun'}} drag={true} > 
                            <slot:trigger>
                               <div>===========</div>
                            </slot:trigger>
                            Upload
                         </web.ui.Upload>
                     
                       
                       <div d:if={2} d:each="val in [1,2]">
                            <span>{val}</span>
                       </div>
                       <div d:elseif={3 > 2} d:each="val in [1,2]" >
                        ===========
                       </div>
                       <div d:else>
                        99999999999
                       </div>

                       
                    </div>
        }

    }

}
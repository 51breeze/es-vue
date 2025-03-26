package{

    import web.components.Component;
    import web.events.ComponentEvent;
    import Person;
    import ChildPerson;
    import web.ui.Select;
    import web.ui.Option;
    import web.ui.Notification;
    import web.components.Viewport
    import web.components.Link;
    import web.animation.Transition;
    import web.animation.TransitionGroup;
    import web.components.KeepAlive;
    import MyOption;
    import web.ui.Dialog;

    @Embed('./assets/test.css')
    class Test extends Component{

        constructor( options ){
            super(options);
        }

        @override
        onInitialized(){

            console.log('====onInitialized========')
            super.onInitialized()
        }

        @Override
        protected onMounted():void{
            
             console.log( this.getAttribute('instance').setupState  )
        }

        @Required
        address:string;

        @override
        onBeforeMount(){
             console.log('=====beforeMount======')
        }

        get name():string{
            return this.reactive<string>('name');
        }

        set name(value:string){
            this.reactive('name', value);
        }

        get value():string{
            return this.reactive<string>('value');
        }

        set value(val:string){
            console.log('=====ssssssssss======')
            this.reactive('value',val);
        }

        tips(){
            
            Notification({
                title: '提示成功',
                message: '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案'
            });

        }

        get skin(){
            return null;
            //return new MySkin(this);
        }

        set childElements(value:Node){
            
            this.reactive('children', value);

        }

        get childElements():Node{
            return this.reactive('children');
        }

        getNavs(){
            const getItem = (val)=>{
                return <div on:click={this.tips}>{val}</div>
            }
            return [1,2].map(item=>getItem(item))
        }

        getNodes(){
            return <div on:click={tips}></div>
        }

        private  label='9999999'

        @override
        render(){

            // var s = new Select();
            // s.value = 666;
            // s.focus();

            return <div xmlns:slot="@slots" >
                        <p > 
                            <h5 on:click={this.tips}>      
                            
                            点击
                                {"ssss"} {666}
                               这"里'提示 
                               
                                       {this.name}</h5> 
                            <Select bind:value={value} name = "name" size = "mini"  >
                                <MyOption value="深圳" />
                                <MyOption value="长沙" />
                                <slot:prefix>
                                    <div>6666</div>
                                </slot:prefix>
                            </Select>
                        </p>

                        {this.label}

                        <Link to='/pages/Address'>测试页面</Link>
                        <br />
                        <Link to='/index'>首页面</Link>

                        <div d:each="(item,i) in [1,2,3]" on:click={tips} >{item}</div>
                        <div>
                            <Viewport />
                        </div>
                </div>

        
                

            // return <div xmlns:slot="@slots" >
            //            <h5 on:click={this.tips}>点击这里提示</h5>
            //             <Person name={this.name} >

            //                 <Select bind:value={this.value} >
            //                     <MyOption value="深圳" />
            //                     <MyOption value="长沙" />
            //                 </Select>

            //             </Person>
            //             {this.skin.render()}
            //     </div>




            // return <div xmlns:d="@directives" xmlns:on="@events"  xmlns:te="@events::web.ui.TransitionEvent" >
            //             <button on:click={this.toggle}>
            //                 Toggle
            //             </button>
            //             <TransitionGroup name="fade" duration={{enter: 5000, leave: 5000}} te:BEFORE_ENTER={this.beforeEnter}>
            //                 <p d:if="this.isShow" key="1" >hello</p>
            //                 <p d:if="this.isShow" key="2" >hello</p>
            //                 <p d:if="this.isShow" key="3" >hello</p>
            //             </TransitionGroup>
            //         </div>

        }

        beforeEnter(...args){

            console.log( args )

        }

        isShow:boolean = true;

        toggle(){
            this.isShow = !this.isShow;
            console.log('--------', this.isShow )
        }

    }

} 
package{

    import web.components.Component;
    import web.components.ComponentEvent;
    import Person;
    import web.ui.Select;
    import web.ui.SelectOption;
    import web.ui.Notification;
    import web.components.Skin;
    import MySkin;
    import web.ui.Viewport
    import web.ui.Link


    @Embed('../assets/test.css')

    @Import(Vue = 'vue');

    class Test extends Component{

        constructor( options ){
            super(options);
        }

        @override
        beforeCreate(){

            this.addEventListener( ComponentEvent.BEFORE_MOUNT, (e)=>{
                console.log( e , "=====sssss======")
            });
        }

        @Required
        public var address:string;

        @override
        beforeMount(){
             console.log("=========beforeMount========")
        }

        get name():string{
            return this.data<string>('name');
        }

        set name(value:string){
            this.data('name', value);
        }

        get value():string{
            return this.data<string>('value') || this.data<string>('name');
        }

        set value(val:string){
            this.data('value',val);
        }

        tips(){

            Notification({
                title: '提示成功',
                message: '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案'
            });

        }

        get skin(){
            return new MySkin(this);
        }

        @override
        render(){

            return <div xmlns:slot="@slots" >
                        <p> 
                            <h5 on:click={this.tips}>点击这里提示</h5> 
                            <Select bind:value={this.value} >
                                <MyOption value="深圳" />
                                <MyOption value="长沙" />
                            </Select>
                        </p>

                        <Link to='/test'>测试页面</Link>
                        <br />
                        <Link to='/index'>首页面</Link>
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
        }

    }

} 
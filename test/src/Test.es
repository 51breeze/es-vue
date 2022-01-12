package{

    import web.components.Component;
    import web.components.ComponentEvent;
    import Person;
    import web.ui.Select;
    import web.ui.Option;
    import web.ui.Notification;
    import web.Skin;
    import MySkin;
    import web.ui.Viewport
    import web.ui.Link;
    import MyOption;

    @Embed('./assets/test.css')
    class Test extends Component{

        constructor( options ){
            super(options);
        }

        @override
        onInitialized(){

            console.log('====onInitialized========')
        }

        @Required
        public var address:string;

        @override
        onBeforeMount(){
             console.log('=====beforeMount======')
        }

        get name():string{
            return this.data<string>('name');
        }

        set name(value:string){
            this.data('name', value);
        }

        get value():string{
            return this.data<string>('value');
        }

        set value(val:string){
            console.log('=====ssssssssss======')
            this.data('value',val);
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
            
            this.data('children', value)

        }

        get childElements():Node{
            return this.data('children');
        }

        @override
        render(){

            // var s = new Select();
            // s.value = 666;
            // s.focus();

            return <div xmlns:slot="@slots" >
                        <p> 
                            <h5 on:click={this.tips}>点击这里提示 {this.name}</h5> 
                            <Select bind:value={this.value}>
                                <MyOption value="深圳" />
                                <MyOption value="长沙" />
                                <slot:prefix>
                                    <div>6666</div>
                                </slot:prefix>
                            </Select>
                        </p>

                        <Link to='/test'>测试页面</Link>
                        <br />
                        <Link to='/index'>首页面</Link>
                        <div>
                            <Viewport />
                        </div>
                        <div>{this.childElements}</div>
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
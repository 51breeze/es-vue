package{

    import web.components.Component;
    import PersonSkin;

    class Person extends Component{

        constructor( options ){
            super(options);
        }

        get name():string{
            return this.data<string>('name');
        }

        set name(value:string){
            this.data('name', value);
        }

        @override
        mounted(){
             setTimeout( ()=>{
                 this.data('name', '=====手动设置不再接收上级的值 66666=====')
             }, 1000);
        }

        @override
        render(){

            return <div xmlns:slot="@slots">
                        <PersonSkin name={this.name} >
                            <slot:foot scope="props">
                                <div>the is PersonSkin child==========foot {props.props}</div>
                            </slot:foot>
                        </PersonSkin>
                        <slot:default />
                </div>
        }

    }

}
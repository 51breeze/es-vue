package karma.components;
import web.components.Component
import karma.asserts.DirectiveAssert;

class Directive extends Component {

    condition:boolean = true;

    @Override
    onMounted(){
        
        when( Env(testframework, 'karma') ){
            new DirectiveAssert(this);
        }
    }

    @Injector
    set list(value){
        console.log('------Directive Injector(Home page list)---------', value )
    }

    @Override
    protected onUpdated():void{
        
         console.log('-----onUpdated  Directive----------', this.condition)
    }

    @Override
    protected onBeforeMount():void{
        
        console.log('-----onBeforeMount  Directive----------', this.condition )
    }
    
    @Override
    render(){
        console.log('---Directive Component render---', this.condition)
        return <div class="directive" xmlns:ui="web.ui" xmlns:d="@directives">
            <div class='if-condition'>
                <div d:if="condition" class='way-1'>if-way 1</div>
                <d:if condition="condition">
                    <div class='way-2'>if-way 2-1</div>
                    <div class='way-2'>if-way 2-2</div>
                </d:if>
            </div>
            <div class='show'>
                <div d:show="condition" class='way-1'>show-way 1</div>
                <d:show condition="condition">
                    <div class='way-2'>show-way 2-1</div>
                    <div class='way-2'>show-way 2-2</div>
                </d:show>
            </div>
        </div>
    }

}
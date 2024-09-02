package karma.components;
import web.components.Component

class Foreach extends Component {

    @Reactive
    private infiniteCount = 10;

    @Override
    render(){
        return <root>
                <div>1</div>
                <div>2</div>
        
        </root>
    }

}
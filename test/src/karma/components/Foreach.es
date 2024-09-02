package karma.components;
import web.components.Component

class Foreach extends Component {

    @Reactive
    private infiniteCount = 10;

    @Override
    render(){
        return <root xmlns:ui='web.ui'>
            <div>1</div>
            <div>2</div>
            <ui:Button>sssss</ui:Button>
        </root>
    }

}
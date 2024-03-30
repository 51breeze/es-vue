package karma.components;
import web.components.Component
import karma.asserts.SlotAssert;

class Slot extends Component {

    items:({label:string})[] = [];

    title:string ='default';

    @Override
    render(){
        console.log('---Slot Component----render11-----', this.title, this.items );
        return <div class="slot" xmlns:ui="web.ui" xmlns:d="@directives" xmlns:s="@slots">
            <div class='head'>
                <s:head>
                    <h3>Slot component: {this.title}</h3>
                </s:head>
            </div>
            <div class='content'>
                <p>Content: </p>
                <s:content scope={{items}}>
                    <div d:for="(item,index) in items" ref='item'>default: {item.label}</div>
                </s:content>
            </div>
            <div class='footer'><s:default /></div>
        </div>
    }

}
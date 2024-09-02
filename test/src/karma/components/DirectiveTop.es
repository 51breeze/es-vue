package karma.components;
import web.components.Component
import karma.asserts.DirectiveAssert;

class DirectiveTop extends Component {

    @Reactive
    private infiniteCount = 0;

    private loadList(){
        console.log('----DirectiveTop loadList------', this.infiniteCount )
        this.infiniteCount+=2;
    }

    @Override
    render(){
        return <ui:InfiniteScroll xmlns:ui="web.ui" xmlns:d="@directives" value = {this.loadList} disabled = {this.infiniteCount > 20} distance={5}>
                <ul class="infinite-list" style="overflow: auto">
                        <li d:for="i in this.infiniteCount"  key={i} class="infinite-list-item">DirectiveTop: infinite-scroll {i}</li>
                </ul>
        </ui:InfiniteScroll>
    }

}
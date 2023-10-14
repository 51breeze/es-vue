package web.ui;

import web.components.Component

@Import(Timeline = "element-ui/packages/timeline")
@Embed('element-ui/lib/theme-chalk/timeline.css')

declare final class Timeline extends Component{
    reverse:boolean=false;
}
package web.ui;

import web.components.Component

@Import(TimelineItem = "element-ui/packages/timeline-item")
@Embed('element-ui/lib/theme-chalk/timeline-item.css')
@Define('slot', 'dot');
@Define('slot', 'default');
declare final class TimelineItem extends Component{
    timestamp:string;
    hideTimestamp:boolean;
    placement:'top' | 'bottom';
    type:'primary' | 'success' | 'warning' | 'danger' | 'info';
    color:'hsl' | 'hsv' | 'hex' | 'rgb';
    size:'normal' | 'large';
    icon:string;
}
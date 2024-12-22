package web.ui;

import web.components.Component
import {ElTimelineItem as TimelineItem} from 'element-plus/lib/components/timeline'
import 'element-plus/lib/components/timeline-item/style/css'

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
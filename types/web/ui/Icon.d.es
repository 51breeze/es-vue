package web.ui;

import web.components.Component

import 'element-ui/lib/theme-chalk/icon.css'
declare final class Icon extends Component{

    //SVG 图标的大小，size x size
    size:string|number;

    /**
    * svg 的 fill 颜色
    */
    color:string;

    //图标名称
    name:string;
}


package web.ui;

import web.components.Component
import Row from 'element-plus/lib/components/row'
import 'element-plus/lib/components/row/style/css'

declare final class Row extends Component{

    //栅格间隔
    gutter:number

    //布局模式，可选 flex，现代浏览器下有效
    type:string

    //flex 布局下的水平排列方式
    justify:'start'|'end'|'center'|'space-around'|'space-between' =	'start'

    //flex 布局下的垂直排列方式	
    align:'top'|'middle'|'bottom'
    
    //自定义元素标签
    tag:string|VNode|Component='div'

}
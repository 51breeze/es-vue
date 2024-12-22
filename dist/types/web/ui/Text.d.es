package web.ui;

import web.components.Component

import Text from "element-plus/lib/components/text"
import "element-plus/lib/components/text/style/css"

declare final class Text extends Component{
    //类型
    type:'primary'|'success'|'warning'|'danger'|'info'

    //大小
    size:'large' | 'default' | 'small'

    //显示省略号
    truncated:boolean=false

    //最大行数
    @Alias('line-clamp')
    lineClamp:string|number

    //自定义元素标签
    tag:string
}
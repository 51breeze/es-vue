package web.ui;

import web.components.Component
import TextLink from 'element-plus/lib/components/link'
import 'element-plus/lib/components/link/style/css'

declare final class TextLink extends Component{

    //类型
    type:'primary'|'success'|'warning'|'danger'|'info'|'default'

    //是否下划线
    underline:boolean=true

    //是否禁用状态
    disabled:boolean=false

    //原生 href 属性
    href:string

    //图标类名
    icon:string

}
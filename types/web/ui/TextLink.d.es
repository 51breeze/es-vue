package web.ui;

import web.components.Component

@Import(TextLink = "element-ui/packages/link")
@Embed('element-ui/lib/theme-chalk/link.css')

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
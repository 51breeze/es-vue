package web.ui;
import web.components.Component
@Import(Button = "element-ui/packages/button")
@Embed('element-ui/lib/theme-chalk/button.css')

declare final class Button extends Component{

    //尺寸 
    size:'medium' | 'small' | 'mini'

    //类型
    type:'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'

    //是否朴素按钮
    plain:boolean=false

    //是否圆角按钮
    round:boolean=false

    //是否圆形按钮
    circle:boolean=false

    //是否加载中状态
    loading:boolean=false

    //是否禁用状态
    disabled:boolean=false

    //图标类名
    icon:string

    //是否默认聚焦
    autofocus:boolean=false

    //原生 type 属性
    @DOMAttribute
    nativeType:'button' | 'submit' | 'reset' = 'button'
}
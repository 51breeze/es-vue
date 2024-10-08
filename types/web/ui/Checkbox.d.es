package web.ui;

import web.components.Component
@Import(Checkbox = "element-ui/packages/checkbox")
@Embed('element-ui/lib/theme-chalk/checkbox.css')

@Define(
    emits, 
    //当绑定值变化时触发的事件
    change
)

declare final class Checkbox extends Component{
    //绑定值
    value:string | number | boolean
    //选中状态的值（只有在checkbox-group或者绑定对象类型为array时有效）
    label:string | number | boolean
    //是否禁用
    disabled:boolean=false

    //	选中时的值
    trueLabel:string | number
    //没有选中时的值
    falseLabel:string | number

    //当前是否勾选
    checked:boolean	= false
    //设置 indeterminate 状态，只负责样式控制
    indeterminate:boolean=false

    //是否显示边框
    border:boolean=false
    //Checkbox 的尺寸，仅在 border 为真时有效	
    @Hook('polyfills:value')
    size:'large' | 'medium' | 'small' | 'mini';
    //原生 name 属性
    name:string
}
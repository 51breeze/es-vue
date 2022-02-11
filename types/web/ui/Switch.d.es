package web.ui;

import web.components.Component

@Import(Switch = "element-ui/packages/switch")
@Embed('element-ui/lib/theme-chalk/switch.css')

declare final class Switch extends Component{

    //绑定值
    value:boolean | string | number

    //是否禁用
    disabled:boolean=false

    //switch 的宽度（像素）
    width:number=40
    //switch 打开时所显示图标的类名，设置此项会忽略 active-text
    activeIconClass:string
    //switch 关闭时所显示图标的类名，设置此项会忽略 inactive-text
    inactiveIconClass:string
    //switch 打开时的文字描述
    activeText:string
    //switch 关闭时的文字描述
    inactiveText:string
    //switch 打开时的值
    activeValue:boolean | string | number = true
    //switch 关闭时的值
    inactiveValue:boolean | string | number	= false
    //switch 打开时的背景色
    activeColor:string='#409EFF'
    //switch 关闭时的背景色	
    inactiveColor:string='#C0CCDA'
    //switch 对应的 name 属性
    name:string
    //改变 switch 状态时是否触发表单的校验
    validateEvent:boolean=true
    //使 Switch 获取焦点
    focus():void
}
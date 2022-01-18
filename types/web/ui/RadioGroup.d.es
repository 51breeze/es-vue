package web.ui

import web.components.Component

@import(RadioGroup = "element-ui/packages/radio-group")

@Embed('element-ui/lib/theme-chalk/radio-group.css')
declare class RadioGroup extends Component{
    //绑定值
    value:string | number | boolean
    //是否禁用
    disabled:boolean=false
    //Radio 的尺寸，仅在 border 为真时有效
    size:'medium' | 'small' | 'mini'
    //按钮形式的 Radio 激活时的填充色和边框色
    fill:string ='#409EFF'
    //按钮形式的 Radio 激活时的文本颜色
    textColor:string = '#ffffff'
}

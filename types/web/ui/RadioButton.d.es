package web.ui

import web.components.Component

@import(RadioButton = "element-ui/packages/radio-button")

@Embed('element-ui/lib/theme-chalk/radio-group.css')
declare class RadioButton extends Component{
    //Radio 的 value
    label:string | number
    //是否禁用
    disabled:boolean=false
    //原生 name 属性
    name:string
}
package web.ui;

import web.components.Component

@Import(Radio = "element-ui/packages/radio")
@Embed('element-ui/lib/theme-chalk/radio.css')

declare final class Radio extends Component{
    //绑定值
    value:string | number | boolean
    //Radio 的 value
    label:string | number | boolean
    //是否禁用
    disabled:boolean=false
    //是否显示边框
    border:boolean=false
    //Radio 的尺寸，仅在 border 为真时有效
    @Hook('polyfills:value')
    size:'large' | 'medium' | 'small' | 'mini';
    //原生 name 属性
    name:string
}
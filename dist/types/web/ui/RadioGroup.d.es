package web.ui;

import web.components.Component
import {ElRadioGroup as RadioGroup} from 'element-plus/lib/components/radio'
import 'element-plus/lib/components/radio-group/style/css'

declare final class RadioGroup extends Component{
    //绑定值
    @Alias('modelValue')
    value:string | number | boolean
    //是否禁用
    disabled:boolean=false
    //Radio 的尺寸，仅在 border 为真时有效
    @Hook('polyfills:value')
    size:'large' | 'medium' | 'small' | 'mini';
    //按钮形式的 Radio 激活时的填充色和边框色
    fill:string ='#409EFF'
    //按钮形式的 Radio 激活时的文本颜色
    textColor:string = '#ffffff'
}

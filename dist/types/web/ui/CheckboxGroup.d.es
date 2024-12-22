package web.ui;

import web.components.Component
import {ElCheckboxGroup as CheckboxGroup} from 'element-plus/lib/components/checkbox'
import 'element-plus/lib/components/checkbox-group/style/css'

@Define(
    emits, 
    //当绑定值变化时触发的事件
    change
)

declare final class CheckboxGroup extends Component{
    //绑定值
    @Alias('modelValue')
    value:array
    //是否禁用
    disabled:boolean=false
    //多选框组尺寸，仅对按钮形式的 Checkbox 或带有边框的 Checkbox 有效
    @Hook('polyfills:value')
    size:'large' | 'medium' | 'small' | 'mini';
    //可被勾选的 checkbox 的最小数量
    min:number
    //可被勾选的 checkbox 的最大数量
    max:number
    //按钮形式的 Checkbox 激活时的文本颜色
    textColor:string='#ffffff'
    //按钮形式的 Checkbox 激活时的填充色和边框色
    fill:string='#409EFF'
}
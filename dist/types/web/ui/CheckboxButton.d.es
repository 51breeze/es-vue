package web.ui;

import web.components.Component
import {ElCheckboxButton as CheckboxButton} from 'element-plus/lib/components/checkbox'
import 'element-plus/lib/components/checkbox-button/style/css'

declare final class CheckboxButton extends Component{
   
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

    //原生 name 属性
    name:string
}
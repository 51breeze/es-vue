package web.ui;

import web.components.Component
import {ElRadioButton as RadioButton} from 'element-plus/lib/components/radio'
import 'element-plus/lib/components/radio-button/style/css'

declare final class RadioButton extends Component{
    //Radio 的 value
    label:string | number
    //是否禁用
    disabled:boolean=false
    //原生 name 属性
    name:string
}
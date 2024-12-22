package web.ui;

import web.components.Component
import {ElOption as Option} from 'element-plus/lib/components/select'
import 'element-plus/lib/components/option/style/css'

declare final class Option extends Component{
    multiple:boolean = false;
    /**
    * 选项的值
    */
    value:string|number|object

    /**
    * 选项的标签，若不设置则默认与 value 相同
    */
    label:string|number	
    /**
    * 是否禁用该选项
    */
    disabled:boolean = false
}
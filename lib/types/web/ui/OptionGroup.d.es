package web.ui;

import web.components.Component
import {ElOptionGroup as OptionGroup} from 'element-plus/lib/components/select'
import 'element-plus/lib/components/option-group/style/css'

declare final class OptionGroup extends Component{

    /**
    * 分组的组名
    */
    label:string

    /**
    * 是否将该分组下所有选项置为禁用
    */
    disabled:boolean = false
}
package web.ui;

import web.components.Component

@Import(OptionGroup = "element-ui/packages/option-group")
@Embed('element-ui/lib/theme-chalk/option-group.css')

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
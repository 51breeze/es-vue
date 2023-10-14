package web.ui;

import web.components.Component

@Import(Option = "element-ui/packages/option")
@Embed('element-ui/lib/theme-chalk/option.css')

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
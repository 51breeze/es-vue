package web.ui;

@import(OptionGroup = "element-ui/packages/option-group")
declare class OptionGroup extends web.components.Component{

    /**
    * 分组的组名
    */
    label:string	

    /**
    * 是否将该分组下所有选项置为禁用
    */
    disabled:boolean = false
}
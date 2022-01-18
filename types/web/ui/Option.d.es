package web.ui;

@import(Option = "element-ui/packages/option")
declare class Option extends web.components.Component{
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
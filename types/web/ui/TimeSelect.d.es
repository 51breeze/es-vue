package web.ui;

import web.components.Component

@Import(TimeSelect = "element-ui/packages/time-select")
@Embed('element-ui/lib/theme-chalk/time-select.css')

declare final class TimeSelect extends Component{
    //尺寸 
    @Hook('polyfills:value')
    size:'large' | 'medium' | 'small' | 'mini'
    //绑定值
    value:string | string[]
    //完全只读
    readonly:boolean=false
    //禁用
    disabled:boolean=false
    //文本框可输入
    editable:boolean=true
    //是否显示清除按钮
    clearable:boolean=true
    //非范围选择时的占位内容
    placeholder:string
    //范围选择时开始日期的占位内容
    startPlaceholder:string
    //范围选择时开始日期的占位内容
    endPlaceholder:string
    //对齐方式
    align:'left' | 'center' | 'right' = 'left'
    //TimePicker 下拉框的类名
    popperClass:string
    //当前时间日期选择器特有的选项
    pickerOptions:{
        /*
        * 开始时间    
        * 默认 '09:00'
        */
        start:string,
        /*
        * 结束时间
        * 默认 '18:00'
        */
        end:string,

        /*
        * 间隔时间
        * 默认 '00:30'
        */
        step:string,
        /*
        * 最小时间，小于该时间的时间段将被禁用
        * 默认 '00:00'
        */
        minTime:string,

        /*
        * 最大时间，大于该时间的时间段将被禁用
        */
        maxTime:string
    }
    //选择范围时的分隔符
    rangeSeparator:string='-'
    //可选，选择器打开时默认显示的时间
    defaultValue:string | string[]
    //原生属性
    name:string
    //自定义头部图标的类名
    prefixIcon:string='el-icon-time'
    //自定义清空图标的类名
    clearIcon:string='el-icon-circle-close'
}
package web.ui;

import web.components.Component

@Import(TimePicker = "element-ui/packages/time-picker")
@Embed('element-ui/lib/theme-chalk/time-picker.css')

declare final class TimePicker extends Component{
    //尺寸 
    size:'medium' | 'small' | 'mini'
    //绑定值
    value: Date | Date[]
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
    //是否为时间范围选择，仅对<el-time-picker>有效	
    isRange:boolean=false
    //是否使用箭头进行时间选择，仅对<el-time-picker>有效
    arrowControl:boolean=false
    //对齐方式
    align:'left' | 'center' | 'right' = 'left'
    //TimePicker 下拉框的类名
    popperClass:string
    //当前时间日期选择器特有的选项
    pickerOptions:{
        /**
        * 可选时间段，例如'18:30:00 - 20:30:00'或者传入数组['09:30:00 - 12:00:00', '14:30:00 - 18:30:00']
        */
        selectableRange : string | string[],
        /**
        * 时间格式化(TimePicker)
        * 默认 HH:mm:ss
        */
        format:'HH' | 'mm' | 'ss' | 'AM' | 'PM'
    }
    //选择范围时的分隔符
    rangeSeparator:string='-'
    //可选，仅TimePicker时可用，绑定值的格式。不指定则绑定值为 Date 对象
    valueFormat:string
    //可选，选择器打开时默认显示的时间
    defaultValue: Date | Date[]
    //原生属性
    name:string
    //自定义头部图标的类名
    prefixIcon:string='el-icon-time'
    //自定义清空图标的类名
    clearIcon:string='el-icon-circle-close'
}
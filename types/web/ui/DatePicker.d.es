package web.ui;

import web.components.Component

@Import(DatePicker = "element-ui/packages/date-picker")
@Embed('element-ui/lib/theme-chalk/date-picker.css')

@Define(
    emits,
    //用户确认选定的值时触发
    change,	
    //在组件 Input 失去焦点时触发	
    blur,
    //在组件 Input 获得焦点时触发	
    focus,
    //2.7.7	可清空的模式下用户点击清空按钮时触发
    clear,
    //在日历所选日期更改时触发
    'calendar-change',	
    //当日期面板改变时触发。
    'panel-change',		
    //当 DatePicker 的下拉列表出现/消失时触发
    'visible-change'
)

declare final class DatePicker extends Component{
    //尺寸 
    @Hook('polyfills:value')
    size:'large' | 'medium' | 'small' | 'mini';
    //绑定值
    @Alias('modelValue')
    value: TimePickerValueType | TimePickerValueType[]
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
    //显示类型
    type:'year'|'month'|'date'|'dates'|'week'|'datetime'|'datetimerange'|'daterange'|'monthrange' = 'date'
    /**
    * 显示在输入框中的格式
    *   可用值
        格式	含义	备注	举例
        yyyy	年		2017
        M	月	不补0	1
        MM	月		01
        W	周	仅周选择器的 format 可用；不补0	1
        WW	周	仅周选择器的 format 可用	01
        d	日	不补0	2
        dd	日		02
        H	小时	24小时制；不补0	3
        HH	小时	24小时制	03
        h	小时	12小时制，须和 A 或 a 使用；不补0	3
        hh	小时	12小时制，须和 A 或 a 使用	03
        m	分钟	不补0	4
        mm	分钟		04
        s	秒	不补0	5
        ss	秒		05
        A	AM/PM	仅 format 可用，大写	AM
        a	am/pm	仅 format 可用，小写	am
        timestamp	JS时间戳	仅 value-format 可用；组件绑定值为number类型	1483326245000
        [MM]	不需要格式化字符	使用方括号标识不需要格式化的字符 (如 [A] [MM])	MM
    */
    format:string
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
        //设置快捷选项
        shortcuts:({ 
            //标题文本
            text:string, 
            //选中后的回调函数，参数是 vm，可通过触发 'pick' 事件设置选择器的值。例如 vm.$emit('pick', new Date())
            onClick:(picker:DatePicker)=>void
        })[],
        //设置禁用状态，参数为当前日期，要求返回 Boolean
        disabledDate:()=>boolean,
        //设置日期的 className
        cellClassName:(date:Date)=>void,
        //周起始日
        firstDayOfWeek:1|2|3|4|5|6|7,
        //选中日期后会执行的回调，只有当 daterange 或 datetimerange 才生效
        onPick:(value:{maxDate,minDate})=>void
    }
    //选择范围时的分隔符
    rangeSeparator:string='-'
    /**
    * 绑定值的格式。不指定则绑定值为。不指定则绑定值为 Date 对象
    * 具体值,参考日期格式
    */
    valueFormat:string
    //可选，选择器打开时默认显示的时间
    defaultValue: Date | Date[];
    //数组，长度为 2，每项值为字符串，形如12:00:00，第一项指定开始日期的时刻，第二项指定结束日期的时刻，不指定会使用时刻 00:00:00
    defaultTime:string[]
    //原生属性
    name:string
    //在范围选择器里取消两个日期面板之间的联动
    unlinkPanels:boolean=false
    //自定义头部图标的类名
    prefixIcon:string='el-icon-date'
    //自定义清空图标的类名
    clearIcon:string='el-icon-circle-close'
    //输入时是否触发表单的校验
    validateEvent:boolean=true
    //使 input 获取焦点
    focus():void
}

declare type TimePickerValueType = Date | number | string;
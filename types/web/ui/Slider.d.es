package web.ui;

import web.components.Component

@Import(Slider = "element-ui/packages/slider")
@Embed('element-ui/lib/theme-chalk/slider.css')

declare final class Slider extends Component{
    //绑定值
    value:number=0
    //最小值
    min:number=0
    //最大值
    max:number=100
    //是否禁用
    disabled:boolean=false
    //步长
    step:number=1
    //是否显示输入框，仅在非范围选择时有效
    showInput:boolean=false
    //在显示输入框的情况下，是否显示输入框的控制按钮
    showInputControls:boolean=true
    //	输入框的尺寸
    @Hook('polyfills:value')
    inputSize:'large' | 'medium' | 'small' | 'mini'
    //是否显示间断点
    showStops:boolean = false
    //是否显示 tooltip
    showTooltip:boolean=true
    //格式化 tooltip message
    formatTooltip:(value)=>any
    //是否为范围选择
    range:boolean=false
    //是否竖向模式
    vertical:boolean=false
    //Slider 高度，竖向模式时必填
    height:string
    //屏幕阅读器标签
    label:string
    //输入时的去抖延迟，毫秒，仅在show-input等于true时有效
    debounce:number=300
    //tooltip 的自定义类名
    tooltipClass:string
    //标记， key 的类型必须为 number 且取值在闭区间 [min, max] 内，每个标记可以单独设置样式	
    marks:{number:any}
}
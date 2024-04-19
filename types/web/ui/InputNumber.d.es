package web.ui;

import web.components.Component

import InputNumber from 'element-ui/packages/input-number'
import 'element-ui/lib/theme-chalk/input-number.css';
import 'element-plus/theme-chalk/el-input.css';
import 'element-plus/theme-chalk/el-input-number.css';

//输入框头部内容，只对 type="text" 有效
@define(slot, 'prefix')

//suffix	输入框尾部内容，只对 type="text" 有效
@define(slot, 'suffix')

//prepend	输入框前置内容，只对 type="text" 有效
@define(slot, 'prepend')

//append	输入框后置内容，只对 type="text" 有效
@define(slot, 'append')

declare final class InputNumber extends Component{
    //绑定值
    value:number=0
    //设置计数器允许的最小值
    min:number
    //设置计数器允许的最大值
    max:number
    //计数器步长
    step:number=1
    //是否只能输入 step 的倍数
    stepStrictly:boolean=false
    //数值精度	
    precision:number
    //计数器尺寸
    @Hook('polyfills:value')
    size:'large' | 'medium' | 'small' | 'mini';
    //是否禁用计数器
    disabled:boolean=false
    //是否使用控制按钮
    controls:boolean=true
    //控制按钮位置
    controlsPosition:'right'
    //原生属性
    name:string
    //输入框关联的label文字
    label:string
    //输入框默认 placeholder
    placeholder:string
    //使 input 获取焦点
    focus():void
    //选中 input 中的文字
    select():void
}
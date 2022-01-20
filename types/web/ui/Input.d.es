package web.ui

import web.components.Component

@Import(Input = "element-ui/packages/input")
@Embed('element-ui/lib/theme-chalk/input.css')

//输入框头部内容，只对 type="text" 有效
@define(slot, 'prefix')

//suffix	输入框尾部内容，只对 type="text" 有效
@define(slot, 'suffix')

//prepend	输入框前置内容，只对 type="text" 有效
@define(slot, 'prepend')

//append	输入框后置内容，只对 type="text" 有效
@define(slot, 'append')

@Final
declare class Input extends Component{
    //类型
    type:'text'|'textarea'|'submit'|'checkbox'|'file'|'hidden'|'image'|'radio'|'reset' = 'text'
    //绑定值
    value:string | number
    //原生属性，最大输入长度
    maxlength:number
    //原生属性，最小输入长度
    minlength:number
    //是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效
    showWordLimit:boolean= false
    //输入框占位文本
    placeholder:string
    //是否可清空
    clearable:boolean=false
    //是否显示切换密码图标
    showPassword:boolean=false
    //禁用
    disabled:boolean=false
    //输入框尺寸，只在 type!="textarea" 时有效
    size:'medium' | 'small' | 'mini'
    //输入框头部图标
    prefixIcon:string
    //输入框尾部图标
    suffixIcon:string
    //输入框行数，只对 type="textarea" 有效
    rows:number=2
    //自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows: 2, maxRows: 6 }
    autosize:boolean | { minRows: 2, maxRows: 6 } =	false
    //原生属性，自动补全
    autocomplete:'on'|'off' = 'off'
    //原生属性
    name:string
    //原生属性，是否只读
    readonly:boolean=false
    //原生属性，设置最大值
    max:number
    //原生属性，设置最小值
    min:number
    //原生属性，设置输入字段的合法数字间隔
    step:number
    //控制是否能被用户缩放
    resize:'none' | 'both' | 'horizontal' | 'vertical' = 'none'
    //原生属性，自动获取焦点
    autofocus:boolean = false
    //原生属性
    form:string
    //输入框关联的label文字
    label:string
    //输入框的tabindex
    tabindex:string
    //	输入时是否触发表单的校验
    validateEvent:boolean=true
    //使 input 获取焦点
    focus():void
    //使 input 失去焦点
    blur():void
    //选中 input 中的文字
    select():void
}
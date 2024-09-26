package web.ui

import web.components.Component

@Import(Autocomplete = "element-ui/packages/autocomplete")
@Embed('element-ui/lib/theme-chalk/autocomplete.css')

@Define(emits, blur, focus, input, clear, select, change)

//自定义输入建议，参数为 { item }
@Define(slot, 'default', scope = 'item' )

//输入框尾部内容
@Define(slot, 'suffix')

//输入框头部内容
@Define(slot, 'prefix')

//输入框前置内容
@Define(slot, 'prepend')

//输入框后置内容
@Define(slot, 'append')

declare final class Autocomplete extends Component{
    //输入框占位文本
    @DOMAttribute
    placeholder:string
    //禁用
    disabled:boolean=false
    //输入建议对象中用于显示的键名
    valueKey:string = 'value'
    //必填值，输入绑定值
    value:string
    //获取输入建议的去抖延时
    debounce:number=300
    //菜单弹出位置
    placement:'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'='bottom-start'
    //返回输入建议的方法，仅当你的输入建议数据 resolve 时，通过调用 callback(data:[]) 来返回它
    fetchSuggestions:(queryString, callback)=>void
    //Autocomplete 下拉列表的类名
    popperClass:string
    //是否在输入框 focus 时显示建议列表
    triggerOnFocus:boolean=true
    //原生属性
    @DOMAttribute
    name:string
    //在输入没有任何匹配建议的情况下，按下回车是否触发 select 事件
    selectWhenUnmatched:boolean=false
    //输入框关联的label文字
    label:string
    //输入框头部图标
    prefixIcon:string
    //输入框尾部图标
    suffixIcon:string
    //是否隐藏远程加载时的加载图标
    hideLoading:boolean=false
    //是否将下拉列表插入至 body 元素。在下拉列表的定位出现问题时，可将该属性设置为 false
    popperAppendToBody:boolean=true
    //是否默认突出显示远程搜索建议中的第一项
    highlightFirstItem:boolean=false
    //使 input 获取焦点
    focus():void
}
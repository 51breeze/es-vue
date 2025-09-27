package web.ui

import web.components.Component
//import Select from 'element-plus/lib/components/select'
import 'element-plus/lib/components/select/style/css'

@Define(slot,'prefix')
@Define(slot,'default')
@Define(slot,'empty')
@Define(slot,'header')
@Define(slot,'footer')
@Define(slot,'tag', props={})
@Define(slot,'loading')
@Define(slot,'label')

@Define(
    emits,
    //当触发滚动事件时，返回滚动的距离
    change,
    //下拉框出现/隐藏时触发
    'visible-change',
    //多选模式下移除tag时触发
    'remove-tag',
    //可清空的单选模式下用户点击清空按钮时触发
    clear,
    //当 input 失去焦点时触发
    blur,
    //当 input 获得焦点时触发
    focus,
    //下拉滚动时触发
    'popup-scroll'
)

declare final class Select extends Component{

    /**
    * 绑定值
    */
    @Alias('modelValue')
    value:any;
    /**
    * select input 的 name 属性
    */
    name:string;
    /**
    * select input 的 autocomplete 属性
    */
    autocomplete:'off' | 'auto';
    /**
    * 占位符
    */
    placeholder:string;
    /**
    * 是否多选
    */
    multiple:boolean = false;
    /**
    * 是否禁用
    */
    disabled:boolean = false;
    /**
    * 是否可以清空选项
    */
    clearable:boolean = false;
    /**
    * 是否可搜索
    */
    filterable:boolean = false;
    /**
    * 是否允许用户创建新条目，需配合 filterable 使用
    */
    allowCreate:boolean = false;
    /**
    * 自定义搜索方法
    */
    filterMethod:(queryString: string)=>void;

    /**
    * 搜索条件无匹配时显示的文字，也可以使用 empty 插槽设置，默认是 “No matching data'”
    */
    noMatchText?:string

    /**
    * 无选项时显示的文字，也可以使用 empty 插槽设置自定义内容，默认是 “No data”
    */
    noDataText?:string

    /**
    * 自定义清除图标
    */
    clearIcon:string | object

    /**
    * 自定义后缀图标组件
    */
    suffixIcon:string | object

    /**
    * 标签类型
    */
    tagType:'primary' | 'success' | 'info' | 'warning' | 'danger' = 'info'

    /**
    * 标签效果
    */
    tagEffect:'' | 'light' | 'dark' | 'plain' = 'light'

    /**
    * 下拉面板偏移量
    */
    offset:number = 12

    /**
    * 下拉菜单的内容是否有箭头
    */
    showArrow  = true

    /**
    * 下拉框出现的位置
    */
    placement?:'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'

    /**
    * dropdown 可用的 positions 请查看popper.js 文档
    */
    fallbackPlacements?:string[]

    /**
    * 是否触发表单验证
    */
    validateEvent = true

    /**
    * 下拉框的宽度是否与输入框相同
    */
    fitInputWidth = false

    /**
    * 是否为远程搜索
    */
    remote:boolean = false;
    /**
    * 远程搜索方法
    */
    remoteMethod:(queryString: string)=>void;
    /**
    * 是否正在从远程获取数据
    */
    loading:boolean = false;
    /**
    * 是否正在从远程获取数据
    */
    loadingText:string = '加载中';
    /**
    * 多选时是否将选中值按文字的形式展示
    */
    collapseTags:boolean = false;

    /**
    * 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。 要使用此属性，collapse-tags属性必须设定为 true
    */
    collapseTagsTooltip = false

    /**
    * 需要显示的 Tag 的最大数量 只有当 collapse-tags 设置为 true 时才会生效。
    */
    maxCollapseTags:number = 1

    /**
    * 作为 value 唯一标识的键名，绑定值为对象类型时必填
    */
    valueKey:string='value';
    /**
    * 输入框尺寸
    */
    @Hook('polyfills:value')
    size:'large' | 'medium' | 'small' | 'mini';
    /**
    * 多选时用户最多可以选择的项目数，为 0 则不限制
    */
    multipleLimit:number=0;

    /**
    * 使 input 获取焦点
    */
    focus(): void

    /**
    * 使 input 失去焦点，并隐藏下拉框
    */
    blur(): void

    /**
    * 为 Select 的下拉菜单自定义样式
    */
    popperStyle?:string|Record;

    /**
    * 选择器下拉菜单的自定义类名
    */
    popperClass:string = ''

    /**
    * 当 multiple 和 filterable被设置为 true 时，是否在选中一个选项后保留当前的搜索关键词
    */
    reserveKeyword = true;

    /**
    * 是否在输入框按下回车时，选择第一个匹配项。 需配合 filterable 或 remote 使用
    */
    defaultFirstOption = false;

    /**
    * 是否使用 teleport。设置成 true则会被追加到 append-to 的位置
    */
    teleported = true;

    /**
    * 下拉框挂载到哪个 DOM 元素
    */
    appendTo?:string|HTMLElement

    /*
    * 当下拉选择器未被激活并且persistent设置为false，选择器会被删除。
    */
    persistent=true

    /*
    * 对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单
    */
    automaticDropdown = false

    /**
    * tooltip 主题，内置了 dark / light 两种
    */
    effect:'light'|'dark' = 'light'
    /**
    * 选项的数据源， value 的 key 和 label 和  disabled可以通过 props自定义.
    */
    options?:Record[]

    /**
    * options 的配置
    */
    props?:{value?:string, label?:string, options?:string, disabled?:string}

    /**
    * popper.js 参数
    */
    popperOptions?:Record

    /**
    * 等价于原生 input aria-label 属性
    */
    ariaLabel?:string

    /**
    * input 的 tabindex
    */
    tabindex?:string|number

    /**
    * 清空选项的值 参考 config-provider
    */
    valueOnClear?:string|number|boolean|Function
}
package web.ui

import web.components.Component

@Define(slot,'prefix')
@Define(slot,'default')
@Define(slot,'empty')

@Import(Select = "element-ui/packages/select")
@Embed('element-ui/lib/theme-chalk/select.css')

//@Embed('element-ui/lib/theme-chalk/icon.css');

declare final class Select extends Component{

    /**
    * 绑定值
    */
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
}
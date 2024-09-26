package web.ui;

import web.components.Component
import Cascader from 'element-ui/packages/cascader'
import 'element-ui/lib/theme-chalk/cascader.css';

/*
import 'element-plus/theme-chalk/el-cascader.css';
import 'element-plus/theme-chalk/el-input.css';
import 'element-plus/theme-chalk/el-popper.css';
import 'element-plus/theme-chalk/el-tag.css';
import 'element-plus/theme-chalk/el-tag.css';
*/

@define(slot,'default')
@define(slot,'empty')

@Define(
    emits, 
    //当绑定值变化时触发的事件
    change, 
    //当展开节点发生变化时触发
    'expand-change', 
    //当失去焦点时触发
    blur, 
    //当获得焦点时触发
    focus, 
    //可清空的单选模式下用户点击清空按钮时触发
    clear, 
    //下拉框出现/隐藏时触发
    'visible-change', 
    //在多选模式下，移除Tag时触发
    'remove-tag'
)

declare final class Cascader extends Component{
    /**
    * 绑定值
    */
    @Alias('modelValue')
    value:any;

    //可选项数据源，键名可通过 Props 属性配置
    options:object[]

    //配置选项，具体见下表
    props:{
        /*
        * 次级菜单的展开方式
        * 默认：click
        */
        expandTrigger?:'click' | 'hover',
        /*
        * 是否多选
        * 默认：false
        */
        multiple?:boolean,
        /*
        * 是否严格的遵守父子节点不互相关联
        * 默认：false
        */
        checkStrictly?:boolean,
        
        /*
        * 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
        * 默认：true
        */
        emitPath?:boolean,

        /*
        * 是否动态加载子节点，需与 lazyLoad 方法结合使用
        * 默认：false
        */
        lazy?:boolean,

        /*
        * 加载动态数据的方法，仅在 lazy 为 true 时有效
        * @param node 为当前点击的节点
        * @param resolve 为数据加载完成的回调(必须调用)
        */
        lazyLoad?:(node:HTMLElement, resolve:(...args)=>void)=>void,

        /*
        * 指定选项的值为选项对象的某个属性值
        * 默认：value
        */
        value?:string,
        /*
        * 指定选项标签为选项对象的某个属性值
        * 默认：label
        */
        label?:string,
        /*
        * 指定选项的子选项为选项对象的某个属性值
        * 默认：children
        */
        children?:string,
        /*
        * 指定选项的禁用为选项对象的某个属性值
        * 默认：disabled
        */
        disabled?:string,
        /*
        * 指定选项的叶子节点的标志位为选项对象的某个属性值
        * 默认：leaf
        */
        leaf?:string,
    }

    //尺寸
    @Hook('polyfills:value')
    size:'large' | 'medium' | 'small' | 'mini';
    //输入框占位文本
    placeholder:string='请选择'
    //是否禁用
    disabled:boolean=false
    //是否支持清空选项
    clearable:boolean=false
    //输入框中是否显示选中值的完整路径
    showAllLevels:boolean=true
    //多选模式下是否折叠Tag
    collapseTags:boolean=false

    //当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。 要使用此属性，collapse-tags属性必须设定为 true
    collapseTagsTooltip = false;

    //选项分隔符
    separator:string = ' / '
    //是否可搜索选项
    filterable:boolean
    //自定义搜索逻辑，第一个参数是节点node，第二个参数是搜索关键词keyword，通过返回布尔值表示是否命中	
    filterMethod:(node:HTMLElement, keyword:string)=>boolean
    //搜索关键词输入的去抖延迟，毫秒
    debounce:number=300
    //筛选之前的钩子，参数为输入的值，若返回 false 或者返回 Promise 且被 reject，则停止筛选
    beforeFilter:(value)=>boolean | Promise<any>
    //自定义浮层类名
    popperClass:string
    //弹层是否使用 teleport
    teleported:boolean = true
    /**
    * 获取选中的节点
    * @param leafOnly
    */
    getCheckedNodes(leafOnly:boolean = false):object[]
    //标签类型
    tagType:'success' | 'info' | 'warning' | 'danger' = 'info'
    //tag effect
    tagEffect:'light' | 'dark' | 'plain' = 'light'
    //输入时是否触发表单的校验
    validateEvent:boolean=true
    //需要显示的 Tag 的最大数量 只有当 collapse-tags 设置为 true 时才会生效。
    maxCollapseTags:number = 1
    //组件的空值配置 参考config-provider
    emptyValues:any[]
    //清空选项的值 参考 config-provider
    valueOnClear:string|number|boolean|Function
    //当下拉框未被激活并且persistent设置为false，下拉框容器会被删除。
    persistent:boolean = true
    //Tooltip 可用的 positions 请查看popper.js 文档
    fallbackPlacements:any[]
    //下拉框出现的位置
    placement:'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end' = 'bottom-start'

}
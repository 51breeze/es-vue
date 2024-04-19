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

declare final class Cascader extends Component{
    /**
    * 绑定值
    */
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
    /**
    * 获取选中的节点
    * @param leafOnly
    */
    getCheckedNodes(leafOnly:boolean = false):object[]

}
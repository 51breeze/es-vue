package web.ui;
import web.components.Component
//自定义备选项的节点内容，参数为 { node, data }，分别为当前节点的 Node 对象和数据
@Define(slot,'default', scope)
@Import(CascaderPanel = "element-ui/packages/cascader-panel")
@Embed('element-ui/lib/theme-chalk/cascader-panel.css')

declare final class CascaderPanel extends Component{
    
    //选中项绑定值
    value:any
    //可选项数据源，键名可通过 Props 属性配置
    options:object[]
    //配置选项，具体见下表
    props:{
        /*
        * 次级菜单的展开方式
        * 默认：click
        */
        expandTrigger:'click' | 'hover',
        /*
        * 是否多选
        * 默认：false
        */
        multiple:boolean,
        /*
        * 是否严格的遵守父子节点不互相关联
        * 默认：false
        */
        checkStrictly:boolean,
        
        /*
        * 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
        * 默认：true
        */
        emitPath:boolean,

        /*
        * 是否动态加载子节点，需与 lazyLoad 方法结合使用
        * 默认：false
        */
        lazy:boolean,

        /*
        * 加载动态数据的方法，仅在 lazy 为 true 时有效
        * @param node 为当前点击的节点
        * @param resolve 为数据加载完成的回调(必须调用)
        */
        lazyLoad:(node:HTMLElement, resolve:(...args)=>void)=>void,

        /*
        * 指定选项的值为选项对象的某个属性值
        * 默认：value
        */
        value:string,
        /*
        * 指定选项标签为选项对象的某个属性值
        * 默认：label
        */
        label:string,
        /*
        * 指定选项的子选项为选项对象的某个属性值
        * 默认：children
        */
        children:string,
        /*
        * 指定选项的禁用为选项对象的某个属性值
        * 默认：disabled
        */
        disabled:string,
        /*
        * 指定选项的叶子节点的标志位为选项对象的某个属性值
        * 默认：leaf
        */
        leaf:string,
    }

    /**
    * 获取选中的节点
    * @param leafOnly
    */
    getCheckedNodes(leafOnly:boolean=false):object[]

    /**
    * 清空选中的节点
    */
    clearCheckedNodes():void

}
package web.ui;

import web.components.Component
import CascaderPanel from 'element-plus/lib/components/cascader-panel'
import 'element-plus/lib/components/cascader-panel/style/css'

@Define(slot,'default', scope:{node:Node, data:Record<any>})
@Define(slot,'empty')

@Define(
    emits, 
    //当选中节点变化时触发
    change, 
    //当展开节点发生变化时触发
    'expand-change', 
    //面板的关闭事件，提供给 Cascader 以便做更好的判断
    close
)

declare final class CascaderPanel extends Component{
    
    //选中项绑定值
    @Alias('modelValue')
    value:any
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
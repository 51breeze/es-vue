package web.components{

    import web.components.Component
    
    /**
    * 是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去。
    */
    @define(slot,'default')
    declare class Teleport extends Component{
        /**
        * 必填项。指定目标容器。
        * 可以是选择器或实际元素。
        */
        to: string | HTMLElement
        /**
        * 当值为 `true` 时，内容将保留在其原始位置
        * 而不是移动到目标容器中。
        * 可以动态更改。
        */
        disabled?: boolean
        /**
        * 当值为 `true` 时，Teleport 将推迟
        * 直到应用的其他部分挂载后
        * 再解析其目标。(3.5+)
        */
        defer?: boolean
    }
}
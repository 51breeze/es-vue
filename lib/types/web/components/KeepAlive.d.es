package web.components{

    import web.components.Component
    
    /**
    * <keep-alive> 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。
    * 和 <transition> 相似，<keep-alive> 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。
    * 当组件在 <keep-alive> 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。
    */
    @define(slot,'default')
    declare class KeepAlive extends Component{
        /**
        * 只有名称匹配的组件会被缓存
        */
        include:string | RegExp

        /**
        * 任何名称匹配的组件都不会被缓存
        */
        exclude:string | RegExp

        /**
        *最多可以缓存多少组件实例
        */
        max:number | string
    }
}
package web.components{

    import web.components.Component
    
    /**
    * 用于协调对组件树中嵌套的异步依赖的处理。
    */
    @define(slot,'default')
    @define(slot,'fallback')
    declare class Suspense extends Component{
        timeout?: string | number
        suspensible?: boolean
    }
}
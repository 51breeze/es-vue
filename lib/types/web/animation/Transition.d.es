 package web.animation{

    import web.components.Component
 
    /**
    * <transition> 元素作为单个元素/组件的过渡效果。<transition> 只会把过渡效果应用到其包裹的内容上，而不会额外渲染 DOM 元素，也不会出现在可被检查的组件层级中。
    */
    @define(slot,'default')
    declare class Transition extends Component{
        /**
        * 用于自动生成过渡 CSS class 名。
        * 例如 `name: 'fade'` 将自动扩展为 `.fade-enter`、
        * `.fade-enter-active` 等。
        */
        name?: string
        /**
        * 是否应用 CSS 过渡 class。
        * 默认：true
        */
        css?: boolean
        /**
        * 指定要等待的过渡事件类型
        * 来确定过渡结束的时间。
        * 默认情况下会自动检测
        * 持续时间较长的类型。
        */
        type?: 'transition' | 'animation'
        /**
        * 显式指定过渡的持续时间。
        * 默认情况下是等待过渡效果的根元素的第一个 `transitionend`
        * 或`animationend`事件。
        */
        duration?: number | { enter: number; leave: number }
        /**
        * 控制离开/进入过渡的时序。
        * 默认情况下是同时的。
        */
        mode?: 'in-out' | 'out-in' | 'default'
        /**
        * 是否对初始渲染使用过渡。
        * 默认：false
        */
        appear?: boolean

        /**
        * 用于自定义过渡 class 的 prop。
        * 在模板中使用短横线命名，例如：enter-from-class="xxx"
        */
        enterFromClass?: string
        enterActiveClass?: string
        enterToClass?: string
        appearFromClass?: string
        appearActiveClass?: string
        appearToClass?: string
        leaveFromClass?: string
        leaveActiveClass?: string
        leaveToClass?: string
    }

 }
 package web.animation{

    import web.components.Component
 
    /**
    * <transition> 元素作为单个元素/组件的过渡效果。<transition> 只会把过渡效果应用到其包裹的内容上，而不会额外渲染 DOM 元素，也不会出现在可被检查的组件层级中。
    */
    @define(slot,'default')
    declare class Transition extends Component{
        /**
        * 用于自动生成 CSS 过渡类名。例如：name: 'fade' 将自动拓展为 .fade-enter，.fade-enter-active 等。默认类名为 "v"
        */
        name:string
        /**
        * 是否在初始渲染时使用过渡。默认为 false
        */
        appear:boolean = false
        /**
        * 是否使用 CSS 过渡类。默认为 true。如果设置为 false，将只通过组
        */
        css:boolean = true
        /**
        * 指定过渡事件类型，侦听过渡何时结束。有效值为 "transition" 和 "animation"。默认将自动检测出持续时间长的为过渡事件类型。
        */
        type:"transition" | "animation"
        /**
        * 控制离开/进入过渡的时间序列
        */
        mode:"out-in" | "in-out"
        /**
        * 指定过渡的持续时间。默认情况下会等待过渡所在根元素的第一个 transitionend 或 animationend 事件
        */
        duration:number | {enter: number, leave: number}

        enterClass:string
        leaveClass:string
        appearClass:string
        enterToClass:string
        leaveToClass:string
        appearToClass:string
        enterActiveClass:string
        leaveActiveClass:string
        appearActiveClass:string
    }

 }
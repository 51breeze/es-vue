 package web.animation{

    import  web.animation.Transition
 
    /**
    * <transition-group> 元素作为多个元素/组件的过渡效果。<transition-group> 渲染一个真实的 DOM 元素。默认渲染 <span>，可以通过 tag attribute 配置哪个元素应该被渲染。
    * 注意，每个 <transition-group> 的子节点必须有独立的 key，动画才能正常工作
    * <transition-group> 支持通过 CSS transform 过渡移动。当一个子节点被更新，从屏幕上的位置发生变化，它会被应用一个移动中的 CSS 类 (通过 name attribute 或配置 move-class attribute 自动生成)。
    * 如果 CSS transform property 是“可过渡”property，当应用移动类时，将会使用 FLIP 技术使元素流畅地到达动画终点。
    */
    declare class TransitionGroup extends Transition{
        tag:string= 'span'
        moveClass:string
    }
 }
package web.ui

import web.components.Component
import web.components.Directive

@Import(Loading = "element-ui/packages/loading")
@Embed('element-ui/lib/theme-chalk/loading.css')

@Define(directives,'loading')

/** Loading Component */
declare final class Loading extends Component {
    static service(options?:LoadingOptions):LoadingService
    static get directive():Directive
    
    //是否应用指令
    value:boolean;

    //显示在加载图标下方的加载文案
    @Alias('element-loading-text')
    text:string

    //自定义加载图标
    @Alias('element-loading-spinner')
    spinner:string

    //背景遮罩的颜色
    @Alias('element-loading-background')
    bg:string
}

declare interface LoadingService{
    close():void
}

/** Options used in Loading service */
declare interface LoadingOptions {
  /** The DOM node Loading needs to cover. Accepts a DOM object or a string. If it's a string, it will be passed to `document.querySelector` to get the corresponding DOM node */
  target?: HTMLElement | string

  /** Whether to make the mask append to the body element */
  body?: boolean

  /** Whether to show the loading mask in fullscreen */
  fullscreen?: boolean

  /** Whether to disable scrolling on body */
  lock?: boolean

  /** Loading text that displays under the spinner */
  text?: string

  /** Class name of the custom spinner */
  spinner?: string

  /** Background color of the mask */
  background?: string

  /** Custom class name for Loading */
  customClass?: string
}

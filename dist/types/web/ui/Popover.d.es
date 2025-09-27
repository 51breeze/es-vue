package web.ui;

import web.components.Component
import Popover from 'element-plus/lib/components/popover'
import 'element-plus/lib/components/popover/style/css'

@Define( slot, 'default')
@Define( slot, 'reference')

@Define(
  emits, 
  //显示时触发
  show,
  //显示动画播放前触发
  beforeEnter,
  //显示动画播放完毕后触发
  afterEnter,
  //隐藏时触发
  hide,
  //隐藏动画播放前触发
  beforeLeave,
  //隐藏动画播放完毕后触发
  afterLeave,
)

/** Popover Component */
declare final class Popover extends Component {
  /** How the popover is triggered */
  trigger: 'click' | 'focus' | 'hover' | 'manual'

  /**
  * 当鼠标点击或者聚焦在触发元素上时， 可以定义一组键盘按键并且通过它们来控制 Popover 的显示
  */
  triggerKeys:string[] = ['Enter','Space']

  /** Popover title */
  title: string

  /** Popover content, can be replaced with a default slot */
  content: string

  /** Popover width */
  width: string | number

  /** Popover placement */
  placement: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end' | "auto" | "auto-start" | "auto-end";

  /** Whether Popover is disabled */
  disabled: boolean

  @Bindding('modelValue')
  visible:boolean

  showPopper:boolean

  /** Popover offset */
  offset: number

  /**
  * 是否显示 Tooltip 箭头， 欲了解更多信息，请参考 ElPopper
  */
  showArrow = true

  /** Popover transition animation */
  transition: string

  /** Parameters for popper.js */
  popperOptions: object

  /** Custom class name for popover */
  popperClass: string

  /**
  * 为 popper 自定义样式
  */
  popperStyle: string | Record

  /** Delay before appearing when trigger is hover, in milliseconds */
  @Deprecated
  openDelay: number

  /** Delay before disappearing when trigger is hover, in milliseconds */
  @Deprecated
  closeDelay: number

  /**
  * 在触发后多久显示内容，单位毫秒
  */
  showAfter = 0

  /**
  * 延迟关闭，单位毫秒
  */
  hideAfter = 200

  /**
  * tooltip 出现后自动隐藏延时，单位毫秒
  */
  autoClose = 0

  /** Popover tabindex */
  tabindex: number

  /*代表 tooltip 所要附加的参照元素*/
  virtualRef:HTMLElement

  /*是否启用虚拟触发器*/
  virtualTriggering?:boolean

  /**
  * 当 popover 组件长时间不触发且 persistent 属性设置为 false 时, popover 将会被删除
  */
  persistent = true

  /**
  * 指示 Tooltip 的内容将附加在哪一个网页元素上
  */
  appendTo?:string|HTMLElement

  /**
  * 是否将 popover 的下拉列表插入至 body 元素
  */
  teleported = true
}

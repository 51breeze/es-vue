package web.ui;

import web.components.Component
import Popover from 'element-plus/lib/components/popover'
import 'element-plus/lib/components/popover/style/css'

@Define( slot, 'default')
@Define( slot, 'reference')

@Define(
  emits, 
  show,
  beforeEnter,
  afterEnter,
  hide,
  beforeLeave,
  afterLeave,
)

/** Popover Component */
declare final class Popover extends Component {
  /** How the popover is triggered */
  trigger: 'click' | 'focus' | 'hover' | 'manual'

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

  showArrow = true

  /** Popover transition animation */
  transition: string

  /** Parameters for popper.js */
  popperOptions: object

  /** Custom class name for popover */
  popperClass: string

  popperStyle: string | Record

  /** Delay before appearing when trigger is hover, in milliseconds */
  @Deprecated
  openDelay: number

  /** Delay before disappearing when trigger is hover, in milliseconds */
  @Deprecated
  closeDelay: number

  showAfter = 0

  hideAfter = 200
  autoClose = 0

  /** Popover tabindex */
  tabindex: number

  virtualRef:HTMLElement

  virtualTriggering?:boolean
  persistent = true
  appendTo?:string|HTMLElement
  teleported = true
}

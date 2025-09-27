package web.ui;

import web.components.Component;
import Tooltip from 'element-plus/lib/components/tooltip'
import 'element-plus/lib/components/tooltip/style/css'

@Define(slot, content);

/** Tooltip Component */
declare final class Tooltip extends Component {
  /** Tooltip theme */
  effect: 'dark' | 'light'

  /** Display content, can be overridden by slot#content */
  content: String

  /** Position of Tooltip */
  placement: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'

  /** Visibility of Tooltip */
  value: boolean

  /** Whether Tooltip is disabled */
  disabled: boolean

  /** Offset of the Tooltip */
  offset: number

  /** Animation name */
  transition: string

  /** Whether an arrow is displayed. For more information, check Vue-popper page */
  showArrow: boolean

  /** Popper.js parameters */
  popperOptions: object

  /** Delay of appearance, in millisecond */
  openDelay: number

  /** Whether to control Tooltip manually. mouseenter and mouseleave won't have effects if set to true */
  manual: boolean

  /** Custom class name for Tooltip's popper */
  popperClass: string

  popperStyle: string|Record

  /** Whether the mouse can enter the tooltip	 */
  enterable: boolean

  /** Timeout in milliseconds to hide tooltip */
  hideAfter: number

  /** Tooltip tabindex */
  tabindex: number

  //在触发后多久显示内容，单位毫秒
  showAfter:number
}

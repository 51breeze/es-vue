package web.ui;

import web.components.Component;
import Dropdown from 'element-plus/lib/components/dropdown'
import 'element-plus/lib/components/dropdown/style/css'

@Define('slot', 'dropdown');
@Define('slot', 'default');

@Define(
    emits,
    //split-button 为 true 时，点击左侧按钮的回调
    click,	
    //当下拉项被点击时触发，参数是从下拉菜单中发送的命令	
    command,
    //当下拉菜单出现/消失时触发器, 当它出现时, 参数将是 true, 否则将是 false
    'visible-change',
)

/** Toggleable menu for displaying lists of links and actions */
declare final class Dropdown extends Component {
  /** Menu button type. only works when split-button is true */
  @Hook('polyfills:value', version=">= 3.0.0")
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'

  /** Whether a button group is displayed */
  splitButton: boolean

  /** menu size, also works on the split button */
  @Hook('polyfills:value')
  size: 'large' | 'medium' | 'small' | 'mini'

  /** Placement of the menu */
  placement: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'

  /** How to trigger */
  trigger: 'hover' | 'click'

  /** Whether to hide menu after clicking menu-item */
  hideOnClick: boolean

  /** Delay time before show a dropdown */
  showTimeout: number

  /** Delay time before hide a dropdown */
  hideTimeout: number

  /** Dropdown tabindex */
  tabindex: number

  /** Whether Dropdown is disabled */
  disabled: boolean
}

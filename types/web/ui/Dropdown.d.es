package web.ui;

import web.components.Component;

@Import(Dropdown = "element-ui/packages/dropdown")
@Embed('element-ui/lib/theme-chalk/dropdown.css')

/** Toggleable menu for displaying lists of links and actions */
declare final class Dropdown extends Component {
  /** Menu button type. only works when split-button is true */
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'

  /** Whether a button group is displayed */
  splitButton: boolean

  /** menu size, also works on the split button */
  size: 'medium' | 'small' | 'mini'

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

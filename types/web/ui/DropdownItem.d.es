package web.ui;

import web.components.Component;
import {ElDropdownItem as DropdownItem} from 'element-plus/lib/components/dropdown'
import 'element-plus/lib/components/dropdown-item/style/css'

/** Toggleable menu for displaying lists of links and actions. */
declare final class DropdownItem extends Component {
  /** A command to be dispatched to Dropdown's command callback */
  command: string | number | object

  /** Whether the item is disabled */
  disabled: boolean

  /** Whether a divider is displayed */
  divided: boolean

  /** Icon to show on left side of text */
  icon: string
}

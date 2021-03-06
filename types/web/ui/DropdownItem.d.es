package web.ui;

import web.components.Component;

@Import(DropdownItem = "element-ui/packages/dropdown-item")
@Embed('element-ui/lib/theme-chalk/dropdown-item.css')

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

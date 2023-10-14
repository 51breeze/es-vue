package web.ui

import web.components.Component

@Import(MenuItemGroup = "element-ui/packages/menu-item-group")
@Embed('element-ui/lib/theme-chalk/menu-item-group.css')

@Define('slot', 'title');

/** Menu Item Group Component */
declare final class MenuItemGroup extends Component {
  /** Group title */
  title: string
}
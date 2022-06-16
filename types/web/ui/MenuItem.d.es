package web.ui

import web.components.Component;

@Import(MenuItem = "element-ui/packages/menu-item")
@Embed('element-ui/lib/theme-chalk/menu-item.css')

@Define('slot', 'title');

/** Menu Item Component */
declare final class MenuItem extends Component {
  /** Unique identification */
  index: string

  /** Vue Router object */
  route: object
}

package web.ui

import web.components.Component
import {ElMenuItemGroup as MenuItemGroup} from 'element-plus/lib/components/menu'
import 'element-plus/lib/components/menu-item-group/style/css'

@Define('slot', 'title');

/** Menu Item Group Component */
declare final class MenuItemGroup extends Component {
  /** Group title */
  title: string
}
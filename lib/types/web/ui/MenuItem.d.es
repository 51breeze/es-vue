package web.ui

import web.components.Component;
import {ElMenuItem as MenuItem} from 'element-plus/lib/components/menu'
import 'element-plus/lib/components/menu-item/style/css'

@Define('slot', 'title');

@Define(
    emits,
    //点击菜单项时回调函数, 参数为菜单项实例
    click
)

/** Menu Item Component */
declare final class MenuItem extends Component {
  /** Unique identification */
  index: string

  /** Vue Router object */
  route: object
}

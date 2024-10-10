package web.ui;

import web.components.Component
import Popconfirm from 'element-plus/lib/components/popconfirm'
import 'element-plus/lib/components/popconfirm/style/css'

@Define('slot', 'reference');

@Define(
    emits,
    //点击确认按钮时触发
    confirm,	
    //点击取消按钮时触发
    cancel
)

/** Popconfirm Component */
declare final class Popconfirm extends Component {
  /** Popconfirm title */
  title: string

  /** Popconfirm ok text */
  confirmButtonText: string
  
  /** Popconfirm cancel text */
  cancelButtonText: string

  /** Popconfirm ok type */
  confirmButtonType: string

  /** Popconfirm cancal type */
  cancelButtonType: string

  /** Popconfirm icon */
  icon: string

  /** Popconfirm icon color */
  iconColor: string

  /** Popconfirm hide icon */
  hideIcon: boolean
}

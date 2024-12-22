package web.ui;

import web.components.Component;
import Badge from 'element-plus/lib/components/badge'
import 'element-plus/lib/components/badge/style/css'

/** Badge Component */
declare final class Badge extends Component {
  /** Display value */
  value: string | number

  /** Maximum value, shows '{max}+' when exceeded. Only works if `value` is a number */
  max: number

  /** If a little dot is displayed */
  isDot: boolean

  /** Hidden badge */
  hidden: boolean
}

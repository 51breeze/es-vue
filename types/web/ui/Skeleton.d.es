package web.ui;

import web.components.Component
import Skeleton from 'element-plus/lib/components/skeleton'
import 'element-plus/lib/components/skeleton/style/css'

@Define(slot, 'default')
@Define(slot, 'template')

/** When loading data, and you need a rich experience for visual and interactions for your end users */
declare final class Skeleton extends Component {
  /** whether showing the animation; default: false */
  animated: boolean

  /** how many fake items to render to the DOM; default: 1 */
  count: number

  /** whether showing the skeleton; default true */
  loading: boolean

  /** numbers of the row, only useful when no template slot were given; default: 4 */
  rows: boolean

  /** Rendering delay in millseconds; default: 0 */
  throttle: number
}
package web.ui

import web.components.Component
import Collapse from 'element-plus/lib/components/collapse'
import 'element-plus/lib/components/collapse/style/css'

/** Use Collapse to store contents. */
declare final class Collapse extends Component {
  /** Whether to activate accordion mode */
  accordion: boolean

  /** Currently active panel */
  @Alias('modelValue')
  value: string | number | (string | number)[]
}

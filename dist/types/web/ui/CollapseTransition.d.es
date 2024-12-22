package web.ui

import web.components.Component
import CollapseTransition from 'element-plus/lib/components/collapse-transition'
import 'element-plus/lib/components/collapse-transition/style/css'

@define(slot, 'default')

/** Collapse Item Component */
declare final class CollapseTransition extends Component {
  
  /** Unique identification of the panel */
  name: string | number
}

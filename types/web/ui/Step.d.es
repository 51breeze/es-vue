package web.ui

import web.components.Component
import {ElStep as Step} from 'element-plus/lib/components/steps'
import 'element-plus/lib/components/step/style/css'

@define(slot, 'icon')
@define(slot, 'title')
@define(slot, 'description')

/** Step Component */
declare final class Step extends Component {
  /** Step title */
  title: string

  /** Step description */
  description: string

  /** Step icon */
  icon: string

  /** Current status. It will be automatically set by Steps if not configured. */
  status: 'wait' | 'process' | 'finish' | 'error' | 'success'
}

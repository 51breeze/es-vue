package web.ui

import web.components.Component
import Steps from 'element-plus/lib/components/steps'
import 'element-plus/lib/components/steps/style/css'

/** Guide the user to complete tasks in accordance with the process. Its steps can be set according to the actual application scenario and the number of the steps can't be less than 2. */
declare final class Steps extends Component {
  /** The spacing of each step, will be responsive if omitted. Support percentage. */
  space: number | string

  /** Display direction */
  direction: 'vertical' | 'horizontal'

  /** Current activation step */
  active: number

  /** Status of current step */
  processStatus: 'wait' | 'process' | 'finish' | 'error' | 'success'

  /** Status of end step */
  finishStatus: 'wait' | 'process' | 'finish' | 'error' | 'success'

  /** Whether step description is centered */
  alignCenter: boolean

  /** Whether to apply simple theme */
  simple: boolean
}

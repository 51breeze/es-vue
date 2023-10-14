package web.ui

import web.components.Component

@Import(Step = "element-ui/packages/step")
@Embed('element-ui/lib/theme-chalk/step.css')

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

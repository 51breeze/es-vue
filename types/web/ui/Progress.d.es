package web.ui;

import web.components.Component

@Import(Progress = "element-ui/packages/progress")
@Embed('element-ui/lib/theme-chalk/progress.css')

/** Progress Component */
declare final class Progress extends Component {
  /** Percentage, required */
  percentage: number

  /** The type of progress bar */
  type: 'line' | 'circle'

  /** The width of progress bar */
  strokeWidth: number

  /** Circle progress bar stroke line cap */
  strokeLinecap: string

  /** Whether to place the percentage inside progress bar, only works when type is 'line' */
  textInside: boolean

  /** The current status of progress bar */
  status: 'success' | 'exception'

  /** Background color of progress bar. Overrides `status` prop */
  color: string | Function | Array<string | { color: string, percentage: number }>

  /** The canvas width of circle progress bar */
  width: number

  /** Whether to show percentage */
  showText: boolean

  /** Template function of the content	*/
  format(percentage: number): string
}

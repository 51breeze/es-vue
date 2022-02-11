package web.ui;

import web.components.Component;

@Import(Calendar = "element-ui/packages/calendar")
@Embed('element-ui/lib/theme-chalk/calendar.css')

/** Calendar Component */
declare final class Calendar extends Component {
  /** Binding value */
  value: Date | String | Number

  /** Specify the display range of the calendar */
  range: (Date | String | Number)[]

  /** First day of week */
  firstDayOfWeek: number
}

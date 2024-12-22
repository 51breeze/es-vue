package web.ui;

import web.components.Component;
import Calendar from 'element-plus/lib/components/calendar'
import 'element-plus/lib/components/calendar/style/css'

/** Calendar Component */
declare final class Calendar extends Component {
  /** Binding value */
  value: Date | String | Number

  /** Specify the display range of the calendar */
  range: (Date | String | Number)[]

  /** First day of week */
  firstDayOfWeek: number
}

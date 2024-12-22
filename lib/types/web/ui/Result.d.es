package web.ui;

import web.components.Component
import Result from 'element-plus/lib/components/result'
import 'element-plus/lib/components/result/style/css'

@define(slot, 'title')
@define(slot, 'icon')
@define(slot, 'subTitle')
@define(slot, 'extra')

/** Used to give feedback on the result of user's operation or access exception. **/
declare final class Result extends Component {

  /* title */
  title: string

  /* sub title */
  subTitle: string

  /* icon type */
  icon: 'success' | 'warning' | 'info' | 'error'
}

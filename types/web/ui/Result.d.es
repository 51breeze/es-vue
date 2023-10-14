package web.ui;

import web.components.Component

@Import(Result = "element-ui/packages/result")
@Embed('element-ui/lib/theme-chalk/result.css')

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

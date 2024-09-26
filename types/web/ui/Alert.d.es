package web.ui;

import web.components.Component;

@Import(Alert = "element-ui/packages/alert")
@Embed('element-ui/lib/theme-chalk/alert.css')

@Define(emits, close)
@Define(slot, 'default');
@Define(slot, 'title');

/** Alert Component */
declare final class Alert extends Component {
  /** Title */
  title: string

  /** Component type */
  type: 'success' | 'warning' | 'info' | 'error'

  /** Descriptive text. Can also be passed with the default slot */
  description: string

  /** If closable or not */
  closable: boolean

  /** whether to center the text */
  center: boolean

  /** Customized close button text */
  closeText: string

  /** If a type icon is displayed */
  showIcon: boolean

  /** Choose effect */
  effect: 'dark' | 'light'
}

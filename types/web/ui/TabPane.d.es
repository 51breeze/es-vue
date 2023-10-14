package web.ui;

import web.components.Component

@Import(TabPane = "element-ui/packages/tab-pane")
@Embed('element-ui/lib/theme-chalk/tab-pane.css')

@Define(slot, label);

/** Tab Pane Component */
declare final class TabPane extends Component {
  /** Title of the tab */
  label: string

  /** Whether Tab is disabled */
  disabled: boolean

  /** Identifier corresponding to the activeName of Tabs, representing the alias of the tab-pane */
  name: string

  /** Whether Tab is closable */
  closable: boolean

  /** Whether Tab is lazily rendered */
  lazy: boolean
}

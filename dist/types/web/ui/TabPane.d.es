package web.ui;

import web.components.Component
import {ElTabPane as TabPane} from 'element-plus/lib/components/tabs'
import 'element-plus/lib/components/tab-pane/style/css'

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

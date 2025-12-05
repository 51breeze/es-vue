package web.ui;

import web.components.Component;
import Tabs from 'element-plus/lib/components/tabs'
import 'element-plus/lib/components/tabs/style/css'

/** Divide data collections which are related yet belong to different types */
@Define(slot, 'add-icon')
declare final class Tabs extends Component {
  /** Type of Tab */
  type: 'card' | 'border-card'

  /** Whether Tab is closable */
  closable: boolean

  /** Whether Tab is addable */
  addable: boolean

  /** Whether Tab is addable and closable */
  editable: boolean

  /** Name of the selected tab */
  value: string

  /** Position of tabs */
  tabPosition: 'top' | 'right' | 'bottom' | 'left'

  /** Whether width of tab automatically fits its container */
  stretch: Boolean

  /** Hook function before switching tab. If false or a Promise is returned and then is rejected, switching will be prevented */
  beforeLeave:((activeName: string, oldActiveName: string) => boolean) | Promise<any>
}

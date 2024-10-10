package web.ui

import web.components.Component
import {ElCollapseItem as CollapseItem} from 'element-plus/lib/components/collapse'
import 'element-plus/lib/components/collapse-item/style/css'

@define(slot, 'default')
@define(slot, 'title')

/** Collapse Item Component */
declare final class CollapseItem extends Component {
  
  /** Unique identification of the panel */
  name: string | number

  /** Title of the panel */
  title: string

  /** Disable the collapse item */
  disabled: boolean
}

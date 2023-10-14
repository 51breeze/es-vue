package web.ui

import web.components.Component

@Import(CollapseItem = "element-ui/packages/collapse-item")
@Embed('element-ui/lib/theme-chalk/collapse-item.css')

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

package web.ui

import web.components.Component

@Import(Collapse = "element-ui/packages/collapse")
@Embed('element-ui/lib/theme-chalk/collapse.css')

/** Use Collapse to store contents. */
declare final class Collapse extends Component {
  /** Whether to activate accordion mode */
  accordion: boolean

  /** Currently active panel */
  value: string | number | string[] | number[]
}

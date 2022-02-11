package web.ui;

import web.components.Component;

@Import(Divider = "element-ui/packages/divider")
@Embed('element-ui/lib/theme-chalk/divider.css')

/** Divider Component */
declare final class Divider extends Component {
  /** enable vertical divider */
  vertical: boolean

  /** customize the content on the divider line */
  posiiton: 'left' | 'center' | 'right'
}

package web.ui;

import web.components.Component;

@Import(Divider = "element-ui/packages/divider")
@Embed('element-ui/lib/theme-chalk/divider.css')

/** Divider Component */
declare final class Divider extends Component {
  /** enable vertical divider */
  @Deprecated('use direction props')
  vertical: boolean

  direction:'horizontal' | 'vertical' = 'horizontal'

  borderStyle:"none" |'dotted' | 'dashed' | 'inset' | 'solid' | 'dashed solid' | 'dashed double none' | 'dashed groove none dotted' = 'solid'

  /** customize the content on the divider line */
  @Alias(contentPosition, version='vue >= 3.0.0')
  posiiton: 'left' | 'center' | 'right' = 'center';
}

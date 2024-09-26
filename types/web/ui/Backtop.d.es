package web.ui;

import web.components.Component;

@Import(Backtop = "element-ui/packages/backtop")
@Embed('element-ui/lib/theme-chalk/backtop.css')
@Define(emits, click)

/** Backtop Component */
declare final class Backtop extends Component {
  /** Backtop target */
  target: string
  
  /** Backtop visibility height */
  visibilityHeight: string | number

  /** Backtop right position */
  right: string | number

  /** Backtop bottom position */
  bottom: string | number
}

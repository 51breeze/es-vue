package web.ui;

import web.components.Component;
import Backtop from 'element-plus/lib/components/backtop'
import 'element-plus/lib/components/backtop/style/css'

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

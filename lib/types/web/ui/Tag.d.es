package web.ui;

import web.components.Component;
import Tag from 'element-plus/lib/components/tag'
import 'element-plus/lib/components/tag/style/css'

/** Tag Component */
declare final class Tag extends Component {
  /** Tag type */
  type: 'primary' | 'gray' | 'success' | 'warning' | 'danger' | 'info'

  /** Whether Tab can be removed */
  closable: boolean

  /** Whether the removal animation is disabled */
  disableTransitions: boolean

  /** Whether Tag has a highlighted border */
  hit: boolean

  /** Background color of the tag */
  color: string

  /** Tag size */
  @Hook('polyfills:value')
  size: 'large' | 'medium' | 'small' | 'mini'

  /** Tag theme */
  effect: 'dark' | 'light' | 'plain'
}

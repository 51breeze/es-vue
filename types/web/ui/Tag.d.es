package web.ui;

import web.components.Component;

@Import(Tag = "element-ui/packages/tag")
@Embed('element-ui/lib/theme-chalk/tag.css')

/** Tag Component */
declare final class Tag extends Component {
  /** Tag type */
  type: 'primary' | 'gray' | 'success' | 'warning' | 'danger'

  /** Whether Tab can be removed */
  closable: boolean

  /** Whether the removal animation is disabled */
  disableTransitions: boolean

  /** Whether Tag has a highlighted border */
  hit: boolean

  /** Background color of the tag */
  color: string

  /** Tag size */
  size: 'medium' | 'small' | 'mini'

  /** Tag theme */
  effect: 'dark' | 'light' | 'plain'
}

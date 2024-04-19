package web.ui;

import web.components.Component

@Import(PageHeader = "element-ui/packages/page-header")
@Embed('element-ui/lib/theme-chalk/page-header.css')

@Define('slot', 'title');
@Define('slot', 'content');
@Define('slot', 'breadcrumb');
/** PageHeader Component */
declare final class PageHeader extends Component {
  /** title */
  title: String

  /** content */
  content: String
}

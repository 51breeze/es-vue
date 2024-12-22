package web.ui;

import web.components.Component
import PageHeader from 'element-plus/lib/components/page-header'
import 'element-plus/lib/components/page-header/style/css'

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
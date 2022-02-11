package web.ui;

import web.components.Component;

@Import(BreadcrumbItem = "element-ui/packages/breadcrumb-item")
@Embed('element-ui/lib/theme-chalk/breadcrumb-item.css')


/** Breadcrumb Item Component */
declare final class BreadcrumbItem extends Component {
  /** Target route of the link, same as to of vue-router */
  to: string | object

  /** If true, the navigation will not leave a history record */
  replace: boolean
}

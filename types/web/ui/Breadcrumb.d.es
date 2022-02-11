package web.ui;

import web.components.Component;

@Import(Breadcrumb = "element-ui/packages/breadcrumb")
@Embed('element-ui/lib/theme-chalk/breadcrumb.css')

/** Displays the location of the current page, making it easier to browser back */
declare final class Breadcrumb extends Component {
  /** Separator character */
  separator: string

  /** Class name of the icon separator */
  separatorClass: string
}

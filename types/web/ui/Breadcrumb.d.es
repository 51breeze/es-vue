package web.ui;

import web.components.Component;

import Breadcrumb from 'element-plus/lib/components/breadcrumb'
import 'element-plus/lib/components/breadcrumb/style/css'

/** Displays the location of the current page, making it easier to browser back */
declare final class Breadcrumb extends Component {
  /** Separator character */
  separator: string

  /** Class name of the icon separator */
  separatorClass: string
}

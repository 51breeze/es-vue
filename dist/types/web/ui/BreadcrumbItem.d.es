package web.ui;

import web.components.Component;
import {ElBreadcrumbItem as BreadcrumbItem} from 'element-plus/lib/components/breadcrumb'
import 'element-plus/lib/components/breadcrumb-item/style/css'

/** Breadcrumb Item Component */
declare final class BreadcrumbItem extends Component {
  /** Target route of the link, same as to of vue-router */
  to: string | object

  /** If true, the navigation will not leave a history record */
  replace: boolean
}
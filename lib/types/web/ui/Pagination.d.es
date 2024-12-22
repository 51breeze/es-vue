package web.ui;

import web.components.Component
import Pagination from 'element-plus/lib/components/pagination'
import 'element-plus/lib/components/pagination/style/css'

@Define(slot, 'default');
@Define(emits, 'update:current-page', 'update:page-size', 'size-change', 'change', 'current-change', 'prev-click', 'next-click')

/** Pagination Component */
declare final class Pagination extends Component {
  /** Whether to use small pagination */
  @Deprecated
  small: boolean

  size:'large' | 'default' | 'small';

  background:boolean

  /** Item count of each page */
  @Bindding('update:page-size')
  pageSize: number

  /** Total item count */
  total: number

  /** Total page count. Set either total or page-count and pages will be displayed; if you need page-sizes, total is required */
  pageCount: number

  /** Number of pagers */
  pagerCount: number

  /** Current page number */
  @Bindding('update:current-page')
  currentPage: number

  /**
   * Layout of Pagination. Elements separated with a comma.
   * Accepted values: `sizes`, `prev`, `pager`, `next`, `jumper`, `->`, `total`, `slot`
   */
  layout: string

  /** Options of item count per page */
  pageSizes: number[]

  /** Custom class name for the page size Select's dropdown */
  popperClass: string

  /** Text for the prev button */
  prevText: string

  /** Text for the prev button */
  nextText: string

  /** Whether to hide when thers's only one page */ 
  hideOnSinglePage: boolean
}

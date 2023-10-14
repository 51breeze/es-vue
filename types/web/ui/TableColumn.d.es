package web.ui;

import web.components.Component;
import web.ui.Popover as PopoverPlacement;

@Import(TableColumn = "element-ui/packages/table-column")
@Embed('element-ui/lib/theme-chalk/table-column.css')
@Define(slot, header, scope:{$index:number, column:TableColumn});
@Define(slot, 'default', scope:{$index:number,row:{[key:string]:any}, column:TableColumn});

/** TableColumn Component */
declare final class TableColumn extends Component {
  /** Type of the column. If set to `selection`, the column will display checkbox. If set to `index`, the column will display index of the row (staring from 1). If set to `expand`, the column will display expand icon. */
  type: 'default' | 'selection' | 'index' | 'expand'

  /** Column label */
  label: string

  /** Column's key. If you need to use the filter-change event, you need this attribute to identify which column is being filtered */
  columnKey: string

  /** Field name. You can also use its alias: property */
  prop: string

  /** Column width */
  width: string

  /** Column minimum width. Columns with `width` has a fixed width, while columns with `min-width` has a width that is distributed in proportion */
  minWidth: string

  /** Whether column is fixed at left/right. Will be fixed at left if `true` */
  fixed: boolean | 'left' | 'right'

  /** Render function for table header of this column */
  renderHeader: (h: (tag:Component | string,data?:object,children?:[])=>any, data: TableRenderHeaderData) => VNode | Component | string

  /** Whether column can be sorted */
  sortable: boolean | 'custom'

  /** Sorting method. Works when `sortable` is `true` */
  sortMethod: (a: any, b: any) => number

  /** The order of the sorting strategies used when sorting the data. Works when `sortable` is `true`. */
  sortOrders: ('ascending' | 'descending' | null)[]

  /** Whether column width can be resized. Works when border of `el-table` is `true` */
  resizable: boolean

    /** Function that formats content */
  formatter: (row: object, column?: {
    /** Label of the column */
    label: string,
  
    /** Property name of the source data */
    property: string,
  
    /** Type of the column */
    type: string,
  
    /** Whether column is fixed at left/right */
    fixed: boolean | string
  },cellValue:any,index?:number) => any

  /** Whether to hide extra content and show them in a tooltip when hovering on the cell */
  showOverflowTooltip: boolean

  /** Alignment */
  align: 'left' | 'center' | 'right'

  /** Alignment of the table header. If omitted, the value of the `align` attribute will be applied */
  headerAlign: 'left' | 'center' | 'right'

  /** Class name of cells in the column */
  className: string

  /** Class name of the label of this column */
  labelClassName: string

  /** Function that determines if a certain row can be selected, works when `type` is `'selection'` */
  selectable: (row: object, index: number) => boolean

  /** Whether to reserve selection after data refreshing, works when `type` is `'selection'` */
  reserveSelection: boolean

  /** An array of data filtering options */
  filters: TableColumnFilter[]

  /** Placement for the filter dropdown */
  filterPlacement: PopoverPlacement

  /** Whether data filtering supports multiple options */
  filterMultiple: Boolean

  /** Data filtering method. If `filter-multiple` is on, this method will be called multiple times for each row, and a row will display if one of the calls returns `true` */
  filterMethod: (value: any, row: object) => boolean

  /** Filter value for selected data, might be useful when table header is rendered with `render-header` */
  filteredValue: TableColumnFilter[]
}

/** Data used in renderHeader function */
declare interface TableRenderHeaderData {
  /** The column that is current rendering */
  column: any,

  /** The index of the rendering column */
  $index: number
}

/** Filter Object */
declare interface TableColumnFilter {
  /** The text to show in the filter's panel */
  text: string,

  /** The value of the filter */
  value: any
}

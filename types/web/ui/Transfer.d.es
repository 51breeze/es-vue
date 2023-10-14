package web.ui;

import web.components.Component

@Import(Transfer = "element-ui/packages/transfer")
@Embed('element-ui/lib/theme-chalk/transfer.css')

@Define('slot', 'leftFooter');
@Define('slot', 'rightFooter');
@Define('slot', 'default');

/** Transfer Component */
declare final class Transfer extends Component{

  value:[];

  /** Data source */
  data: TransferData[]

  /** Whether Transfer is filterable */
  filterable: boolean

  /** Placeholder for the filter input */
  filterPlaceholder: string

  /** Custom filter method */
  filterMethod: (query: string, item: TransferData) => boolean

  /** Order strategy for elements in the target list */
  targetOrder: string

  /** Custom list titles */
  titles: string[]

  /** Custom button texts */
  buttonTexts: string[]

  /** Custom render function for data items */
  renderContent: (h:Function, option: TransferData)=>this

  /** Texts for checking status in list header */
  format: { 
    noChecked: string,
    hasChecked: string,
  }

  /** Prop aliases for data source */
  props: {
    key: string,
    label: string,
    disabled: string
  }

  /** Key array of initially checked data items of the left list */
  leftDefaultChecked: any[]

  /** Key array of initially checked data items of the right list */
  rightDefaultChecked: any[]

  /** Clear the query text in specified panel */
  clearQuery (which: 'left' | 'right' ): void
}


declare interface TransferData {
  key: string | number
  label: string
  disabled?: boolean
}
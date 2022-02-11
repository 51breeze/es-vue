package web.ui

import web.components.Component

@Import(DescriptionsItem = "element-ui/packages/descriptions-item")
@Embed('element-ui/lib/theme-chalk/descriptions-item.css')

@Define(slot, 'label')
@Define(slot, 'default')

/** description item. **/
declare final class DescriptionsItem extends Component {

  /* label text */
  label: string

  /*  the number of columns included */
  span: number 

  /* custom label class name */
  labelClassName: string

  /* custom content class name */
  contentClassName: string

  /* custom label style */
  labelStyle: object

  /* custom content style */
  contentStyle: object
}


package web.ui

import web.components.Component
import {ElDescriptionsItem as DescriptionsItem} from 'element-plus/lib/components/descriptions'
import 'element-plus/lib/components/descriptions-item/style/css'

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


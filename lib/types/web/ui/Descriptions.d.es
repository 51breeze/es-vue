package web.ui;

import web.components.Component
import Descriptions from 'element-plus/lib/components/descriptions'
import 'element-plus/lib/components/descriptions/style/css'

@Define(slot, title)
@Define(slot, extra)

/** Display multiple fields in list form. **/
declare final class Descriptions extends Component {

  /* with or without border */
  border: boolean
  
  /* numbers of Descriptions Item in one line */
  column: number

  /* direction of list */
  direction: 'vertical' | 'horizontal'

  /* size of list */
  @Hook('polyfills:value')
  size:'large' | 'medium' | 'small' | 'mini';

  /* title text, display on the top left */
  title: string

  /* extra text, display on the top right */
  extra: string

  /* change default props colon value of Descriptions Item */
  colon: boolean

  /* custom label class name */
  labelClassName: string

  /* custom content class name */
  contentClassName: string

  /* custom label style */
  labelStyle: object

  /* custom content style */
  contentStyle: object

}

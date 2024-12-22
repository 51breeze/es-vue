package web.ui

import web.components.Component
import Empty from 'element-plus/lib/components/empty'
import 'element-plus/lib/components/empty/style/css'

@Define(slot, 'default')
@Define(slot, image)
@Define(slot, description)

/** Placeholder hints for empty states. */
declare final class Empty extends Component {
  /* image URL */
  image: string
    
  /* image size (width) */
  imageSize: number
  
  /* description */
  description: string
}



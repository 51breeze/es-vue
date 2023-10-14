package web.ui

import web.components.Component

@Import(Empty = "element-ui/packages/empty")
@Embed('element-ui/lib/theme-chalk/empty.css')

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



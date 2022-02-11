package web.ui

import web.components.Component

@Import(Image = "element-ui/packages/image")
@Embed('element-ui/lib/theme-chalk/image.css')

@define(slot, 'placeholder')
@define(slot, 'error')

/** Image Component */
declare final class Image extends Component {
  /** Image source */
  src: string

  /** Indicate how the image should be resized to fit its container, same as native 'object-fit' */
  fit: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'

  /** Whether to use lazy load */
  lazy: boolean

  /** Scroll container that to add scroll listener when using lazy load */
  scrollContainer: string | HTMLElement

  /** Native 'alt' attribute */
  alt: string

  /** Native 'referrerPolicy' attribute */
  referrerPolicy: string

  previewSrcList: string[]

  zIndex: number
}

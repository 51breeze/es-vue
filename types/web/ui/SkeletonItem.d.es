package web.ui;

import web.components.Component

@Import(SkeletonItem = "element-ui/packages/skeleton-item")
@Embed('element-ui/lib/theme-chalk/skeleton-item.css')

/** Skeleton Item Component */
declare final class SkeletonItem extends Component {
  /** The current rendering skeleton type; default: text */ 
  variant: 'p' | 'text' |  'h1' | 'h3' |  'text' | 'caption' | 'button' | 'image' | 'circle' | 'rect'
}

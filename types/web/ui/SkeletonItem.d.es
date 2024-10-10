package web.ui;

import web.components.Component
import {ElSkeletonItem as SkeletonItem} from 'element-plus/lib/components/skeleton'
import 'element-plus/lib/components/skeleton-item/style/css'

/** Skeleton Item Component */
declare final class SkeletonItem extends Component {
  /** The current rendering skeleton type; default: text */ 
  variant: 'p' | 'text' |  'h1' | 'h3' |  'text' | 'caption' | 'button' | 'image' | 'circle' | 'rect'
}
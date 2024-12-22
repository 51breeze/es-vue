package web.ui;

import web.components.Component;
import {ElCarouselItem as CarouselItem} from 'element-plus/lib/components/carousel'
import 'element-plus/lib/components/carousel-item/style/css'

@Define(slot, default)
/** Carousel Item Component */
declare final class CarouselItem extends Component {
  /** Name of the item, can be used in setActiveItem */
  name: string

  /** Text content for the corresponding indicator */
  label: string
}
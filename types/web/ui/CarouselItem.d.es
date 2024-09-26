package web.ui;

import web.components.Component;

@Import(CarouselItem = "element-ui/packages/carousel-item")
@Embed('element-ui/lib/theme-chalk/carousel-item.css')
@Define(slot, default)
/** Carousel Item Component */
declare final class CarouselItem extends Component {
  /** Name of the item, can be used in setActiveItem */
  name: string

  /** Text content for the corresponding indicator */
  label: string
}

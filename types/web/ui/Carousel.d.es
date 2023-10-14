package web.ui;

import web.components.Component;

@Import(Carousel = "element-ui/packages/carousel")
@Embed('element-ui/lib/theme-chalk/carousel.css')

/** Loop a series of images or texts in a limited space */
declare final class Carousel extends Component {
  /** Height of the carousel */
  height: string

  /** Index of the initially active slide (starting from 0) */
  initialIndex: number

  /** How indicators are triggered */
  trigger: 'hover' | 'click'

  /** Whether automatically loop the slides */
  autoplay: boolean

  /** Interval of the auto loop, in milliseconds */
  interval: number

  /** Position of the indicators */
  indicatorPosition: 'outside' | 'none'

  /** When arrows are shown */
  arrow: 'always' | 'hover' | 'never'

  /** Type of the Carousel */
  type: 'card'

  /** Display direction */
  direction: 'horizontal' | 'vertical'

  /**
   * Manually switch slide by carousel item's name
   *
   * @param name The name of the corresponding `el-carousel-item`
   */
  setActiveItem (name: string|number): void

  /** Switch to the previous slide */
  prev (): void

  /** Switch to the next slide */
  next (): void
}

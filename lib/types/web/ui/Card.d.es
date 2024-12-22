package web.ui;

import web.components.Component;
import Card from 'element-plus/lib/components/card'
import 'element-plus/lib/components/card/style/css'

@define(slot, 'default')
@define(slot, 'header')

/** Integrate information in a card container */
declare final class Card extends Component {
  /** Title of the card */
  header: string

  /** CSS style of body */
  bodyStyle: object

  /** When to show card shadows */
  shadow: string
}

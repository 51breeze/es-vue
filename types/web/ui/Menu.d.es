package web.ui

import web.components.Component

@Import(Menu = "element-ui/packages/menu")
@Embed('element-ui/lib/theme-chalk/menu.css')
@Embed('element-ui/lib/theme-chalk/icon.css')

/** Menu that provides navigation for your website */
declare final class Menu extends Component {
  /** Menu display mode */
  mode: 'horizontal' | 'vertical'

  /** Whether the menu is collapsed (available only in vertical mode) */
  collapse: boolean

  /** Background color of Menu (hex format) */
  backgroundColor: string

  /** Text color of Menu (hex format) */
  textColor: string

  /** Text color of currently active menu item (hex format) */
  activeTextColor: string

  /** Index of currently active menu */
  defaultActive: string

  /** Array that contains keys of currently active sub-menus */
  defaultOpeneds: string[]

  /** Whether only one sub-menu can be active */
  uniqueOpened: boolean

  /** How sub-menus are triggered, only works when mode is 'horizontal' */
  menuTrigger: string

  /** Whether vue-router mode is activated. If true, index will be used as 'path' to activate the route action */
  router: boolean

  /** Whether the menu collapse transition is active */
  collapseTransition: boolean
  
  /** Open the specified sub-menu */
  open (index: string): void

  /** Close the specified sub-menu */
  close (index: string): void
}

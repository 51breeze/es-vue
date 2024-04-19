package web.ui

import web.components.Component

@Import(Message = "element-ui/packages/message")
@Embed('element-ui/lib/theme-chalk/message.css')

// @Embed('element-plus/theme-chalk/el-badge.css')

/** Message Component */
declare final class Message extends Component {

  @Callable
  constructor(options: string | MessageOptions)

  /** Close the Loading instance */
  close (): void

  /** Show a success message */
  static success (options: string | MessageOptions): Message
  
  /** Show a warning message */
  static warning (options: string | MessageOptions): Message
  
  /** Show an info message */
  static info (options: string | MessageOptions): Message
  
  /** Show an error message */
  static error(options: string | MessageOptions): Message
}

/** Options used in Message */
declare interface MessageOptions {
  
  /** Message text */
  message: string | VNode | Component

  /** Message type */
  type?: 'success' | 'warning' | 'info' | 'error'

  /** Custom icon's class, overrides type */
  iconClass?: string

  /** Custom class name for Message */
  customClass?: string

  /** Display duration, millisecond. If set to 0, it will not turn off automatically */
  duration?: number

  /** Whether to show a close button */
  showClose?: boolean

  /** Whether to center the text */
  center?: boolean

  /** Whether message is treated as HTML string */
  dangerouslyUseHTMLString?: boolean

  /** Callback function when closed with the message instance as the parameter */
  onClose?: (instance: Message)=> void
  
  /** Set the distance to the top of viewport. Default is 20 px. */
  offset?: number
}
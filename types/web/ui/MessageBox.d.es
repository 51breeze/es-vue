package web.ui

import web.components.Component

@Import(MessageBox = "element-ui/packages/message-box")
@Embed('element-ui/lib/theme-chalk/message-box.css')
@Embed('element-plus/theme-chalk/el-overlay.css')
@Embed('element-plus/theme-chalk/el-button.css')
@Embed('element-plus/theme-chalk/el-input.css')

declare final class MessageBox extends Component {

  title: string
  message: string
  type: 'success' | 'warning' | 'info' | 'error'
  iconClass: string
  customClass: string
  showInput: boolean
  showClose: boolean
  inputValue: string
  inputPlaceholder: string
  inputType: string
  inputPattern: RegExp
  inputValidator: (value: string)=> boolean | string
  inputErrorMessage: string
  showConfirmButton: boolean
  showCancelButton: boolean
  action: 'confirm' | 'cancel' | 'close'
  dangerouslyUseHTMLString: boolean
  confirmButtonText: string
  cancelButtonText: string
  confirmButtonLoading: boolean
  cancelButtonLoading: boolean
  confirmButtonClass: string
  confirmButtonDisabled: boolean
  cancelButtonClass: string
  editorErrorMessage: string

   /** Show an alert message box */
  static alert: MessageBoxShortcutMethod

  /** Show a confirm message box */
  static confirm: MessageBoxShortcutMethod

  /** Show a prompt message box */
  static prompt: MessageBoxShortcutMethod

  /** Set default options of message boxes */
  static setDefaults(defaults: MessageBoxOptions): void
 
  /** Close current message box */
  close (): void

}

declare type MessageBoxCloseAction = 'confirm' | 'cancel' | 'close'

declare type MessageBoxData = MessageBoxInputData | MessageBoxCloseAction

declare interface MessageBoxInputData {
  value: string,
  action: 'confirm' | 'cancel' | 'close'
}

/** Options used in MessageBox */
declare interface MessageBoxOptions {

  /** Title of the MessageBox */
  title?: string

  /** Content of the MessageBox */
  message?: string | VNode | Component

  /** Message type, used for icon display */
  type?: 'success' | 'warning' | 'info' | 'error'

  /** Custom icon's class */
  iconClass?: string

  /** Custom class name for MessageBox */
  customClass?: string

  /** MessageBox closing callback if you don't prefer Promise */
  callback?: (action: 'confirm' | 'cancel' | 'close', instance: MessageBox) => void

  /** Callback before MessageBox closes, and it will prevent MessageBox from closing */
  beforeClose?: (action: 'confirm' | 'cancel' | 'close', instance: MessageBox, done: () => void) => void

  /** Whether to lock body scroll when MessageBox prompts */
  lockScroll?: boolean

  /** Whether to show a cancel button */
  showCancelButton?: boolean

  /** Whether to show a confirm button */
  showConfirmButton?: boolean

  /** Whether to show a close button */
  showClose?: boolean

  /** Text content of cancel button */
  cancelButtonText?: string

  /** Text content of confirm button */
  confirmButtonText?: string

  /** Custom class name of cancel button */
  cancelButtonClass?: string

  /** Custom class name of confirm button */
  confirmButtonClass?: string

  /** Whether to align the content in center */
  center?: boolean

  /** Whether message is treated as HTML string */
  dangerouslyUseHTMLString?: boolean

  /** Whether to use round button */
  roundButton?: boolean

  /** Whether MessageBox can be closed by clicking the mask */
  closeOnClickModal?: boolean

  /** Whether MessageBox can be closed by pressing the ESC */
  closeOnPressEscape?: boolean

  /** Whether to close MessageBox when hash changes */
  closeOnHashChange?: boolean

  /** Whether to show an input */
  showInput?: boolean

  /** Placeholder of input */
  inputPlaceholder?: string

  /** Initial value of input */
  inputValue?: string

  /** Regexp for the input */
  inputPattern?: RegExp

  /** Input Type: text, textArea, password or number */
  inputType?: string

  /** Validation function for the input. Should returns a boolean or string. If a string is returned, it will be assigned to inputErrorMessage */
  inputValidator?: (value: string)=> boolean | string

  /** Error message when validation fails */
  inputErrorMessage?: string

  /** Whether to distinguish canceling and closing */
  distinguishCancelAndClose?: boolean
}

declare type MessageBoxShortcutMethod = (message: string, title?: string | MessageBoxOptions, options?: MessageBoxOptions)=> Promise<MessageBoxData>
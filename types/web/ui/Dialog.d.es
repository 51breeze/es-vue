package web.ui;

import web.components.Component;

import Dialog from 'element-ui/packages/dialog'
import 'element-ui/lib/theme-chalk/dialog.css';

// import 'element-plus/theme-chalk/el-dialog.css';
// import 'element-plus/theme-chalk/el-overlay.css';

@define(slot, 'default')
@define(slot, 'title')
@define(slot, 'footer')
@define(slot, 'header')

@Define(
    emits,
    //Dialog 打开的回调
    open,	
    //Dialog 打开动画结束时的回调
    opened,
    //Dialog 关闭的回调
    close,
    //Dialog 关闭动画结束时的回调
    closed,
    //输入焦点聚焦在 Dialog 内容时的回调
    'open-auto-focus',
    //输入焦点从 Dialog 内容失焦时的回调
    'close-auto-focus'

)

/** Informs users while preserving the current page state */
declare final class Dialog extends Component {

  //是否显示 Dialog
  @Alias('modelValue')
  value:boolean;

  /** Title of Dialog */
  title: string

  /** Width of Dialog */
  width: string

  /** Whether the Dialog takes up full screen */
  fullscreen: boolean

  /** Value for margin-top of Dialog CSS */
  top: string

  /** Whether a mask is displayed */
  modal: boolean

  /** Whether to append modal to body element. If false, the modal will be appended to Dialog's parent element */
  modalAppendToBody: boolean

  /** Whether scroll of body is disabled while Dialog is displayed */
  lockScroll: boolean

  /** Custom class names for Dialog */
  customClass: string

  /** Whether the Dialog can be closed by clicking the mask */
  closeOnClickModal: boolean

  /** Whether the Dialog can be closed by pressing ESC */
  closeOnPressEscape: boolean

  /** Whether to show a close button */
  showClose: boolean

  /** Callback before Dialog closes, and it will prevent Dialog from closing */
  beforeClose: (done: Function) => void

  /** Whether to align the header and footer in center */
  center: boolean

  /** Whether to destroy elements in Dialog when closed */
  destroyOnClose: boolean
}

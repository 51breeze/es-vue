package web.ui

import web.components.Component
import {ElFormItem as FormItem} from 'element-plus/lib/components/form'
import 'element-plus/lib/components/form-item/style/css'

@Define('slot', 'label');
@Define('slot', 'default');

/** FormItem Component */
declare final class FormItem extends Component {

  /** A key of `model` of the enclosing `el-form` component */
  prop: string

  /** Label */
  label: string

  /** Width of label, e.g. '50px' */
  labelWidth: string

  /** Whether the field is required or not, will be determined by validation rules if omitted */
  required: boolean

  /** Validation rules of form */
  rules: object

  /** Field error message, set its value and the field will validate error and show this message immediately */
  error: string

  /** Whether to show the error message */
  showMessage: boolean

  /** Whether to display the error message inline with the form item */
  inlineMessage: boolean

  /** Controls the size of components in this form */
  @Hook('polyfills:value')
  size:'large' | 'medium' | 'small' | 'mini'

  /** Reset current field and remove validation result */
  resetField (): void

  /** Remove validation status of the field */
  clearValidate (): void
}



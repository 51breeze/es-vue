package web.ui

import web.components.Component

@Import(Form = "element-ui/packages/form")
@Embed('element-ui/lib/theme-chalk/form.css')

/** Form Component */
declare final class Form extends Component {
  /** Data of form component */
  model: object

  /** Validation rules of form */
  rules: object

  /** Whether the form is inline */
  inline: boolean

  /** Whether the form is disabled */
  disabled: boolean

  /** Position of label */
  labelPosition: 'left' | 'right' | 'top'

  /** Width of label, and all form items will inherit from Form */
  labelWidth: string

  /** Suffix of the label */
  labelSuffix: string

  /** Whether to show the error message */
  showMessage: boolean

  /** Whether to display the error message inline with the form item */
  inlineMessage: boolean

  /** Whether to display an icon indicating the validation result */
  statusIcon: boolean

  /** Whether to trigger validation when the `rules` prop is changed */
  validateOnRuleChange: boolean

  /** Controls the size of components in this form */
  @Hook('polyfills:value')
  size: 'large' | 'medium' | 'small' | 'mini'

  /**
  * Validate the whole form
  *
  * @param callback A callback to tell the validation result
  */
  validate (callback?: (isValid: boolean, invalidFields: object)=>void): void | Promise<boolean>

  /**
  * Validate certain form items
  *
  * @param props The property of `model` or array of prop which is going to validate
  * @param callback A callback to tell the field validation result
  */
  validateField (props: string | string[], callback?: (isValid: boolean, invalidFields: object)=>void ): void

  /** reset all the fields and remove validation result */
  resetFields (): void

  /** clear validation message for certain fields */
  clearValidate (props?: string | string[]): void
}



package web.ui;

import web.components.Component

@Import(ColorPicker = "element-ui/packages/color-picker")
@Embed('element-ui/lib/theme-chalk/color-picker.css')

/** ColorPicker Component */
declare final class ColorPicker  extends Component{
  /** 绑定值 */
  value:string
  /** Whether to display the alpha slider */
  showAlpha: boolean

  /** Whether to disable the ColorPicker */
  disabled: boolean

  /** Size of ColorPicker */
  @Hook('polyfills:value')
  size:'large' | 'medium' | 'small' | 'mini';

  /** Whether to display the alpha slider */
  popperClass: string

  /** Custom class name for ColorPicker's dropdown */
  colorFormat: 'hsl' | 'hsv' | 'hex' | 'rgb'
  
  /** 预定义颜色 */
  predefine:array	
}

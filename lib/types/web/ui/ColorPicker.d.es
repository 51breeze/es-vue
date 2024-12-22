package web.ui;

import web.components.Component
import ColorPicker from 'element-plus/lib/components/color-picker'
import 'element-plus/lib/components/color-picker/style/css'

@Define(
    emits, 
    //当绑定值变化时触发的事件
    change,
    //面板中当前显示的颜色发生改变时触发
    'active-change',
    //当获得焦点时触发
    focus,
    //当失去焦点时触发
    blur
)

/** ColorPicker Component */
declare final class ColorPicker  extends Component{
  /** 绑定值 */
  @Alias('modelValue')
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

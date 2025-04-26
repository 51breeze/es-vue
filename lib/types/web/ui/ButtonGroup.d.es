package web.ui;
import web.components.Component
import {ElButtonGroup as ButtonGroup} from 'element-plus/lib/components/button'
import 'element-plus/lib/components/button-group/style/css'

declare final class ButtonGroup extends Component{
  
    //尺寸 
    @Hook('polyfills:value')
    size:'large' | 'medium' | 'small' | 'mini';

    //类型
    type:'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
}
package web.ui

import web.components.Component;
import Affix from 'element-plus/es/components/affix'
import 'element-plus/theme-chalk/el-affix.css'

declare final class Affix extends Component{
   offset:number = 0
   position:'top'|'bottom' = 'top'
   //指定容器 (CSS 选择器)
   target:string = null;
   zIndex:number = 100
}
package web.ui

import web.components.Component;
import Affix from 'element-plus/lib/components/affix'
import 'element-plus/lib/components/affix/style/css'

declare final class Affix extends Component{
   offset:number = 0
   position:'top'|'bottom' = 'top'
   //指定容器 (CSS 选择器)
   target:string = null;
   zIndex:number = 100
}
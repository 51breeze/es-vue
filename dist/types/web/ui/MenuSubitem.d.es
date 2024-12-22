package web.ui

import web.components.Component;
import {ElSubMenu as MenuSubitem} from 'element-plus/lib/components/menu'
import 'element-plus/lib/components/sub-menu/style/css'


@Define('slot', 'title');

/** Sub Menu Item Component */
declare final class MenuSubitem extends Component {
  
  /** 
  * 唯一标志 
  */
  index: string

  /** 
  * 弹出菜单的自定义类名 
  */
  popperClass:string

   /**
  * 展开 sub-menu 的延时
  */
  showTimeout:number = 300

  /**
  * 收起 sub-menu 的延时
  */
  hideTimeout:number = 300

  /**
  * 是否禁用
  */
  disabled:boolean = false;

  /**
  * 是否将弹出菜单插入至 body 元素。在菜单的定位出现问题时，可尝试修改该属性
  */
  popperAppendToBody:boolean

}
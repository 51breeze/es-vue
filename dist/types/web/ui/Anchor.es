package web.ui;

import web.components.Component;
import Anchor from 'element-plus/lib/components/anchor'
import 'element-plus/lib/components/anchor/style/css'

@Define(emits, change, click)
@Define(slot, 'default');

declare final class Anchor extends Component {
  //滚动的容器
  container: string | HTMLElement | Window
  //设置锚点类型
  type: 'default' | 'underline' = 'default'
  //设置锚点滚动的偏移量
  offset:number = 0
  //触发锚点的元素的位置偏移量
  bound:number = 15
  //设置容器滚动持续时间，单位为毫秒。
  duration:number = 300
  //是否显示标记
  marker:boolean = true
  //设置锚点方向
  direction:'vertical'|'horizontal' = 'vertical'
}

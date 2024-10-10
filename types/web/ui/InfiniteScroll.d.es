package web.ui

import web.components.Component
import InfiniteScroll from 'element-plus/lib/components/infinite-scroll'
import 'element-plus/lib/components/infinite-scroll/style/css'

@Define(directives,'infinite-scroll')
declare final class InfiniteScroll extends Component {
  //是否应用指令
  value:Function;
  
  //是否禁用	boolean	-	false
  @Alias("infinite-scroll-disabled")
  disabled:boolean = false;
   
  //节流时延，单位为ms	number	-	200
  @Alias('infinite-scroll-delay')
  delay:number = 200

  //触发加载的距离阈值，单位为px	number	-	0
  @Alias('infinite-scroll-distance')
  distance:number= 0

  //是否立即执行加载方法，以防初始状态下内容无法撑满容器。
  @Alias('infinite-scroll-immediate')
  immediate:boolean = true
}
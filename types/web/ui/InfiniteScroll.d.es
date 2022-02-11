package web.ui

import web.components.Component

@Import(ElInfiniteScroll = "element-ui/packages/infinite-scroll")
@Embed('element-ui/lib/theme-chalk//infinite-scroll.css')

class InfiniteScroll extends Component {
  //是否禁用	boolean	-	false
  disabled:boolean = false;
  //节流时延，单位为ms	number	-	200
  delay:number = 200
  //触发加载的距离阈值，单位为px	number	-	0
  distance:number= 0 
  //是否立即执行加载方法，以防初始状态下内容无法撑满容器。
  immediate:boolean = true

  @override
  render(){
    var {...config} = this.getConfig();
    // var directives = config.directives || (config.directives=[]);
    // directives.push({
    //     name:''
    // });
    var children = this.slot('default') || [];
    return children as any
  }
}
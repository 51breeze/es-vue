package web.ui;

import web.components.Component

@Import(Container = "element-ui/packages/container")
@Embed('element-ui/lib/theme-chalk/container.css')

declare final class Container extends Component{
    /**
    * 子元素的排列方向
    * 默认值:子元素中有 el-header 或 el-footer 时为 vertical，否则为 horizontal
    */
   direction:'horizontal'|'vertical'
}
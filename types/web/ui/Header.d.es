package web.ui

import web.components.Component

@Import(Header = "element-ui/packages/header")
@Embed('element-ui/lib/theme-chalk/header.css')

declare  final class Header extends Component{
    /**
    * 顶栏高度
    */
   height:string = '60px'
}
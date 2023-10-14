package web.ui

import web.components.Component

@Import(Footer = "element-ui/packages/footer")
@Embed('element-ui/lib/theme-chalk/footer.css')

declare final class Footer extends Component{
    /**
    * 底栏高度
    */
   height:string = '60px'
}
package web.ui

import web.components.Component

@import(Footer = "element-ui/packages/footer")

@Embed('element-ui/lib/theme-chalk/footer.css')
declare class Footer extends Component{
    /**
    * 底栏高度
    */
   height:string = '60px'
}
package web.ui

import web.components.Component;

@Import(Aside = "element-ui/packages/Aside")
@Embed('element-ui/lib/theme-chalk/footer.css')

declare final class Aside extends Component{
    /**
    * 侧边栏宽度
    */
   width:string = '300px'
}
package web.ui{

    import web.components.Component;
    
    @Import(Scrollbar = "element-ui/packages/scrollbar")
    @Embed('element-ui/lib/theme-chalk/scrollbar.css')

    declare final class Scrollbar extends Component{
        native: boolean;
        wrapStyle:string | ({[key:string]:string})[];
        wrapClass:string;
        viewClass:string;
        viewStyle:string | {[key:string]:string};
        // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
        noresize: boolean;
        tag:string = 'div';
    }
}
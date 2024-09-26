package web.ui{

    import web.components.Component;
    
    @Import(Scrollbar = "element-ui/packages/scrollbar")
    @Embed('element-ui/lib/theme-chalk/scrollbar.css')

    @Define(
        emits,
        //当触发滚动事件时，返回滚动的距离
        scroll,
    )

    declare final class Scrollbar extends Component{
        native: boolean;
        wrapStyle:string | ({[key:string]:string})[];
        wrapClass:string;
        viewClass:string;
        viewStyle:string | {[key:string]:string};
        // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
        noresize: boolean;
        tag:string = 'div';
        //滚动条高度
        height:string|number
        //滚动条最大高度
        maxHeight:string|number
        constructor():ScrollbarExposes
    }

    declare interface ScrollbarExposes{
        //触发滚动事件
        handleScroll:Function
        //滚动到一组特定坐标	
        scrollTo:(options:{scrollTop:number,scrollLeft:number})=>void
        //设置滚动条到顶部的距离
        setScrollTop:(top:number)=>void
        //设置滚动条到左边的距离
        setScrollLeft:(left:number)=>void
        //手动更新滚动条状态 	
        update:Function
        //滚动条包裹的ref对象
        wrapRef:object 	
    }
}
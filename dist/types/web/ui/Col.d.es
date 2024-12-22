package web.ui;

import web.components.Component
import Col from 'element-plus/lib/components/col'
import 'element-plus/lib/components/col/style/css'

declare final class Col extends Component{

    //栅格占据的列数
    span:number=24

    //栅格左侧的间隔格数
    offset:number=0

    //栅格向右移动格数
    push:number	=0

    //栅格向左移动格数
    pull:number=0

    //<768px 响应式栅格数或者栅格属性对象
    xs:number|{span:number, offset: number}

    //	≥768px 响应式栅格数或者栅格属性对象
    sm:number|{span:number, offset: number}

    //≥992px 响应式栅格数或者栅格属性对象
    md:number|{span:number, offset: number}

    //≥1200px 响应式栅格数或者栅格属性对象
    lg:number|{span:number, offset: number}

    //	≥1920px 响应式栅格数或者栅格属性对象
    xl:number|{span:number, offset: number}

    //自定义元素标签
    tag:string | VNode | Component=	'div'
}
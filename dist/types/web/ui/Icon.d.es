package web.ui;

import web.components.Component
import 'element-plus/lib/components/icon/style/css'
declare final class Icon extends Component{

    //SVG 图标的大小，size x size
    size:string|number;

    /**
    * svg 的 fill 颜色
    */
    color:string;

    //图标名称
    name:string;

    //图标文件源，指定此属性时将会忽略name属性
    @Hook('compiling:resolve-import-assets')
    src:string;
}


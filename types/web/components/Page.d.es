package web.components;

import web.components.Component;

/**
* 表示一个页面组件，继承Page组件后会自动生成路由配置，并在 IApplication.routes 中可以访问到。
* 生成路由规则按照父级（文件名）-> 子级（目录）的规则生成。如果文件名与目录名一致（不区分大小写）则认为文件名是目录名的父级，所以两者会形成关联。
* 如果继承Page组件后又不想自动生成路由可以在组件上声明注解符： @DisablePageRoute 来禁用。
*/
declare class Page extends Component{

}
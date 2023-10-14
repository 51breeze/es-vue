package web.ui;

import web.components.Component;

@Import(Drawer = "element-ui/packages/drawer")
@Embed('element-ui/lib/theme-chalk/drawer.css')

@define(slot, 'default')
@define(slot, 'title')

/** Drawer Component */
declare final class Drawer extends Component {

    //是否显示 Drawer
    value:boolean;

    /* Equivalent to `Dialog`'s append to body attribute, when applying nested drawer, make sure this one is set to true */
    appendToBody: boolean

    /* Hook method called before close drawer, the first parameter is a function which should determine if the drawer should be closed */
    beforeClose: (done: (shouldCancel: boolean) => void ) => void

    /** Whether the Drawer can be closed by pressing ESC */
    closeOnPressEscape: boolean

    /** Custom class names for Dialog */
    customClass: string

    /* Determine whether the wrapped children should be destroyed, if true, children's destroyed life cycle method will be called all local state will be destroyed */
    destroyOnClose: boolean

    /* Equivalent to `Dialog`'s modal attribute, determines whether the dark shadowing background should show */
    modal: boolean

    /* Equivalent to `Dialog`'s modal-append-to-body attribute, determines whether the shadowing background should be inserted direct to DocumentBody element */
    modalAppendToBody: boolean

    /* Attributes that controls the drawer's direction of display*/
    direction: 'rtl' | 'ltr' | 'ttb' | 'btt'

    /* Whether the close button should be rendered to control the drawer's visible state */
    showClose: boolean

    /* The size of the drawer component, supporting number with unit of pixel, string by percentage e.g. 30% */
    size: number | string

    /* The Drawer's title, also can be replaced by named slot `title` */
    title: string

    /* Whether the drawer component should show, also can be decorated by `.sync` */
    visible: boolean

    /* Flag attribute whi */
    wrapperClosable: boolean

    //用于关闭 Drawer, 该方法会调用传入的 before-close 方法
    closeDrawer():void;

}
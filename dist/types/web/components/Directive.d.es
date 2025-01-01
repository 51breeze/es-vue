package web.components{

    @Define(Directives)
    declare interface Directive {

        // 在绑定元素的 attribute 前
        // 或事件监听器应用前调用
        @Alias(bind, version = 'vue < 3.0.0')
        created?(el?:HTMLElement, binding?:{[key:string]:any}, vnode?:VNode):void

        //在元素被插入到 DOM 前调用
        @Alias(inserted, version = 'vue < 3.0.0')
        beforeMount?(el?:HTMLElement, binding?:{[key:string]:any}, vnode?:VNode):void

        // 在绑定元素的父组件
        // 及他自己的所有子节点都挂载完成后调用
        //vue 2 不会调用
        mounted?(el?:HTMLElement, binding?:{[key:string]:any}, vnode?:VNode):void

        // 绑定元素的父组件更新前调用
        @Alias(update, version = 'vue < 3.0.0')
        beforeUpdate?(el?:HTMLElement, binding?:{[key:string]:any}, vnode?:VNode, prevVnode):void

        // 在绑定元素的父组件
        // 及他自己的所有子节点都更新后调用
        @Alias(componentUpdated, version = 'vue < 3.0.0')
        updated?(el?:HTMLElement, binding?:{[key:string]:any}, vnode?:VNode, prevVnode):void

        // 绑定元素的父组件卸载前调用
        @Alias(unbind, version = 'vue < 3.0.0')
        beforeUnmount?(el?:HTMLElement, binding?:{[key:string]:any}, vnode?:VNode):void

        //绑定元素的父组件卸载后调用
        //vue 2 不会调用
        unmounted?(el?:HTMLElement, binding?:{[key:string]:any}, vnode?:VNode):void

    }

}
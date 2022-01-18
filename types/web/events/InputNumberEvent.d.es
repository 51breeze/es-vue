package web.events;

class SelectEvent extends Event{
    /**
    * 绑定值被改变时触发 currentValue, oldValue
    */
    static const CHANGE:string = 'change';

    /**
    * 在组件 Input 失去焦点时触发 (event: Event)
    */
    static const BLUR:string = 'blur';

    /**
    * 在组件 Input 获得焦点时触发 (event: Event)
    */
    static const FOCUS:string = 'focus';
}
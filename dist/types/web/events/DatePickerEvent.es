package web.events;

class DatePickerEvent extends Event{
    /**
    * 选中值发生变化时触发
    */
    static const CHANGE:string = 'change';

    /**
    * 当 input 失去焦点时触发
    */
    static const BLUR:string = 'blur';

    /**
    * 当 input 获得焦点时触发
    */
    static const FOCUS:string = 'focus';
}
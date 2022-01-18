package web.events;

class SelectEvent extends Event{
    /**
    * 选中值发生变化时触发
    */
    static const CHANGE:string = 'change';

    /**
    * 下拉框出现/隐藏时触发
    */
    static const VISIBLE_CHANGE:string = 'visible-change';

    /**
    * 多选模式下移除tag时触发
    */
    static const REMOVE_TAG:string = 'remove-tag';
    /**
    * 可清空的单选模式下用户点击清空按钮时触发
    */
    static const CLEAR:string = 'clear';

    /**
    * 当 input 失去焦点时触发
    */
    static const BLUR:string = 'blur';

    /**
    * 当 input 获得焦点时触发
    */
    static const FOCUS:string = 'focus';
}
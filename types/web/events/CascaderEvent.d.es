package web.events;

class CascaderEvent extends Event{
    /**
    * 选中值发生变化时触发
    */
    static const CHANGE:string = 'change';
    /**
    * 当展开节点发生变化时触发
    */
    static const EXPAND_CHANGE:string = 'expand-change';
    /**
    * 下拉框出现/隐藏时触发
    */
    static const VISIBLE_CHANGE:string = 'visible-change';

    /**
    * 多选模式下移除tag时触发
    */
    static const REMOVE_TAG:string = 'remove-tag';

    /**
    * 当 input 失去焦点时触发
    */
    static const BLUR:string = 'blur';

    /**
    * 当 input 获得焦点时触发
    */
    static const FOCUS:string = 'focus';
}
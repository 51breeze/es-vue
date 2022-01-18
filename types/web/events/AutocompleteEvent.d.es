package web.events;

class AutocompleteEvent extends Event{
    //在 Input 值改变时触发 (value: string | number)
    static const CHANGE = 'change'	
    //点击选中建议项时触发
    static const SELECT = 'select'	
}
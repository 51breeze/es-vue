package web.events;

class InputEvent extends Event{
    //在 Input 失去焦点时触发	(event: Event)
    static const BLUR =  'blur'	
    //在 Input 获得焦点时触发	(event: Event)
    static const FOCUS = 'focus'	
    //仅在输入框失去焦点或用户按下回车时触发	(value: string | number)
    static const CHANGE = 'change'	
    //在 Input 值改变时触发	(value: string | number)
    static const INPUT = 'input'	
    //在点击由 clearable 属性生成的清空按钮时触发	—
    static const CLEAR = 'clear'	
}
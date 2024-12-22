/*
 * EaseScript
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */

///<references from='Class' />
///<references from='Event' />

function KeyboardEvent( type, bubbles,cancelable  )
{
    if( !(this instanceof KeyboardEvent) )return new KeyboardEvent(type, bubbles,cancelable);
    Event.call(this, type, bubbles,cancelable );
    return this;
};

KeyboardEvent.prototype=Object.create( Event.prototype,{
    "constructor":{value:KeyboardEvent}
});
KeyboardEvent.prototype.keycode=null;

KeyboardEvent.KEY_PRESS='keypress';
KeyboardEvent.KEY_UP='keyup';
KeyboardEvent.KEY_DOWN='keydown';

//键盘事件
Event.registerEvent(function (type, target, originalEvent ){
    switch ( type ){
        case KeyboardEvent.KEY_PRESS :
        case KeyboardEvent.KEY_UP :
        case KeyboardEvent.KEY_DOWN :
            var event =new KeyboardEvent( type );
            event.originalEvent = originalEvent;
            event.keycode = originalEvent.keyCode || originalEvent.keycode;
            return event;
    }
});
import Class from "./../../core/Class.js";
var _private=Symbol("private");
function TransitionEvent(){
}
var methods = {};
methods.BEFORE_ENTER={m:3,d:2,enumerable:true,value:'before-enter'};
methods.BEFORE_LEAVE={m:3,d:2,enumerable:true,value:'before-leave'};
methods.BEFORE_APPEAR={m:3,d:2,enumerable:true,value:'before-appear'};
methods.ENTER={m:3,d:2,enumerable:true,value:'enter'};
methods.LEAVE={m:3,d:2,enumerable:true,value:'leave'};
methods.APPEAR={m:3,d:2,enumerable:true,value:'appear'};
methods.AFTER_ENTER={m:3,d:2,enumerable:true,value:'after-enter'};
methods.AFTER_LEAVE={m:3,d:2,enumerable:true,value:'after-leave'};
methods.AFTER_APPEAR={m:3,d:2,enumerable:true,value:'after-appear'};
methods.ENTER_CANELLED={m:3,d:2,enumerable:true,value:'enter-cancelled'};
methods.LEAVE_CANELLED={m:3,d:2,enumerable:true,value:'leave-cancelled'};
methods.APPEAR_CANCELLED={m:3,d:2,enumerable:true,value:'appear-cancelled'};
Class.creator(20,TransitionEvent,{
	'id':1,
	'ns':'web.ui',
	'name':'TransitionEvent',
	'private':_private,
	'methods':methods
}, false);
export default TransitionEvent;
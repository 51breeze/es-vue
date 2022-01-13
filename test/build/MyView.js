import View from "./web/View.js";
import Component from "./web/components/Component.js";
import Class from "./core/Class.js";
var members = {};
members.test={m:3,d:3,value:function test(){
	var b = this.skin.hostComponent;
}};
members.name={m:3,d:4,enumerable:true,get:function name(){
	return '=========MyView of MySkin=============';
}};
members.nameMyView={m:3,d:4,enumerable:true,get:function nameMyView(){
	return 'name';
}};
var MyView = Component.createComponent({
	name:'es-MyView',
	extends:View
});
Class.creator(1,MyView,{
	'id':1,
	'ns':'',
	'name':'MyView',
	'inherit':View,
	'members':members
}, false);
export default MyView;
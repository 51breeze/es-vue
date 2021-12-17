var _private=Symbol("private");
import Vue from "vue";
import Component from "./web/components/Component.js";
import Notification from "element-ui/packages/notification";
import MySkin from "./MySkin.js";
import Select from "./web/ui/Select.js";
import ComponentEvent from "./web/components/ComponentEvent.js";
import Class from "./core/Class.js";
var Test = Component.createComponent({
	name:'Test',
	extends:Component,
	props:{
		address:{type:String,default:null},
		name:{type:String},
		value:{type:String}
	}
});
var members = {};
members.beforeCreate={m:3,d:3,value:function beforeCreate(){
	this.addEventListener(ComponentEvent.BEFORE_MOUNT,function(e){
		console.log(e,"=====sssss======");
	});
}};
members.address={m:3,d:1,configurable:true,writable:true,enumerable:true,value:null};
members.beforeMount={m:3,d:3,value:function beforeMount(){
	console.log("=========beforeMount========");
}};
members.name={m:3,d:4,configurable:true,enumerable:true,get:function name(){
	return this.data('name');
},set:function name(value){
	this.data('name',value);
}};
members.value={m:3,d:4,configurable:true,enumerable:true,get:function value(){
	return this.data('value') || this.data('name');
},set:function value(val){
	this.data('value',val);
}};
members.tips={m:3,d:3,value:function tips(){
	Notification({"title":'提示成功',"message":'这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案'});
}};
members.skin={m:3,d:4,configurable:true,enumerable:true,get:function skin(){
	return new MySkin(this);
}};
members.render={m:3,d:3,value:function render(){
		var createElement = this.createElement.bind(this);
	return createElement('div',null, [
			createElement('p',null, [
				createElement('h5',{
					"on":{
					"click":this.tips.bind(this)
					}
					}, ['点击这里提示']),
				createElement(Select,{
					"attrs":{
					"value":this.value
					},
					"on":{
					"input":(function(event){this.value=event && event.target && event.target.nodeType===1 ? event.target.value : event;}).bind(this)
					},
					"domProps":{
					"value":this.value
					}
					}, [
					createElement('MyOption',{
						"attrs":{
						"value":"深圳"
						},
						"domProps":{
						"value":"深圳"
						}
						}),
					createElement('MyOption',{
						"attrs":{
						"value":"长沙"
						},
						"domProps":{
						"value":"长沙"
						}
						})
				])
			]),
			createElement(Link,{
				"attrs":{
				"to":'/test'
				}
				}, ['测试页面']),
			createElement('br'),
			createElement(Link,{
				"attrs":{
				"to":'/index'
				}
				}, ['首页面']),
			createElement('div',null, [
				createElement(Viewport)
			])
		]);
}};
members._init={value:function _init(options){
(function Test(options){
	Object.defineProperty(this,_private,{value:{}});
	Component.prototype._init.call(this,options);
}).call(this,options);
}}
Class.creator(2,Test,{
	'id':1,
	'ns':'',
	'name':'Test',
	'private':_private,
	'inherit':Component,
	'members':members
});
export default Test;
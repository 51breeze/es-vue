import "./assets/test.css";
import Component from "./web/components/Component.js";
import "element-ui/lib/theme-chalk/notification.css";
import "element-ui/lib/theme-chalk/icon.css";
import Notification from "element-ui/packages/notification";
import Select from "./web/ui/Select.js";
import MyOption from "./MyOption.js";
import Link from "./web/components/Link.js";
import KeepAlive from "./web/components/KeepAlive.js";
import Viewport from "./web/components/Viewport.js";
import Class from "./core/Class.js";
var members = {};
members.onInitialized={m:3,d:3,value:function onInitialized(){
	console.log('====onInitialized========');
	Component.prototype.onInitialized.call(this);
}};
members.address={m:3,d:4,enumerable:true,required:true,get:function address(){return this.reactive('address', void 0, function(){return null})},set:function address(value){this.reactive('address',value)}};
members.onBeforeMount={m:3,d:3,value:function onBeforeMount(){
	console.log('=====beforeMount======');
}};
members.name={m:3,d:4,enumerable:true,get:function name(){
	return this.reactive('name');
},set:function name(value){
	this.reactive('name',value);
}};
members.value={m:3,d:4,enumerable:true,get:function value(){
	return this.reactive('value');
},set:function value(val){
	console.log('=====ssssssssss======');
	this.reactive('value',val);
}};
members.tips={m:3,d:3,value:function tips(){
	Notification({"title":'提示成功',"message":'这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案'});
}};
members.skin={m:3,d:4,enumerable:true,get:function skin(){
	return null;
}};
members.childElements={m:3,d:4,enumerable:true,get:function childElements(){
	return this.reactive('children');
},set:function childElements(value){
	this.reactive('children',value);
}};
members.render={m:3,d:3,value:function render(){
		var createElement = this.createElement.bind(this);
	return createElement('div',null, [
			createElement('p',null, [
				createElement('h5',{
					"on":{
						"click":this.tips.bind(this)
						}
					}, ['点击这里提示 '].concat(this.name)),
				createElement(Select,{
					"props":{
						"value":this.value,
						"name":"name",
						"size":"mini"
						},
					"on":{
						"input":(function(event){this.value=event && event.target && event.target.nodeType===1 ? event.target.value : event;}).bind(this)
						},
					"directives":[
						{
						"name":'model',
						"value":this.value
						}
						]
					}, [
					createElement(MyOption,{
						"attrs":{
							"value":"深圳"
							}
						}),
					createElement(MyOption,{
						"attrs":{
							"value":"长沙"
							}
						})
				].concat((this.slot('prefix') || [
						createElement('div',{
							"slot":'prefix'
							}, ['6666'])
					])))
			]),
			createElement(Link,{
				"props":{
					"to":'/test'
					}
				}, ['测试页面']),
			createElement('br'),
			createElement(Link,{
				"props":{
					"to":'/index'
					}
				}, ['首页面']),
			createElement('div',null, [
				createElement(KeepAlive,null, [
					createElement(Viewport)
				])
			])
		]);
}};
members.beforeEnter={m:3,d:3,value:function beforeEnter(){
	var args = Array.prototype.slice.call(arguments,0);
	console.log(args);
}};
members.isShow={m:3,d:4,enumerable:true,get:function isShow(){return this.reactive('isShow', void 0, function(){return true})},set:function isShow(value){this.reactive('isShow',value)}};
members.toggle={m:3,d:3,value:function toggle(){
	this.isShow=! this.isShow;
	console.log('--------',this.isShow);
}};
members._init={value:function _init(options){
(function Test(options){
	Component.prototype._init.call(this,options);
}).call(this,options);
}}
var Test = Component.createComponent({
	name:'es-Test'
});
Class.creator(7,Test,{
	'id':1,
	'ns':'',
	'name':'Test',
	'inherit':Component,
	'members':members
}, false);
export default Test;
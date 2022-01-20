import Component from "./web/components/Component.js";
import PersonSkin from "./PersonSkin.js";
import Button from "./web/ui/Button.js";
import web_ui_TextLink from "./web/ui/TextLink.js";
import web_ui_Upload from "./web/ui/Upload.js";
import Class from "./core/Class.js";
var members = {};
members.name={m:3,d:4,enumerable:true,get:function name(){
	return this.data('name');
},set:function name(value){
	this.data('name',value);
}};
members.onMounted={m:3,d:3,value:function onMounted(){
	var _this = this;
	setTimeout(function(){
		_this.data('name','=====手动设置不再接收上级的值 66666=====');
	},1000);
}};
members.render={m:3,d:3,value:function render(){
		var createElement = this.createElement.bind(this);
	return createElement('div',null, [
			createElement(PersonSkin,{
				"props":{
					"name":this.name
					},
				"scopedSlots":{
					"foot":(this.slot('foot',true) || (function(props){return [
					createElement('div',{
						"slot":'foot'
						}, ['====the is PersonSkin child====']),
					createElement('div',{
						"slot":'foot'
						}, ['the scope value:',props.props
					])
				]}).bind(this))
					}
				}, (this.slot('default') || ['=================='])),
			createElement('div',{
				"attrs":{
					"id":"person-root-child"
					}
				}, ['Person page']),
			createElement(Button,null, ['button']),
			createElement(web_ui_TextLink,{
				"props":{
					"type":'primary'
					}
				}, ['text link']),
			createElement(web_ui_Upload,{
				"props":{
					"action":'http://sss.com/upload',
					"data":{"name":'yejun'},
					"drag":true
					}
				}, (this.slot('trigger') || [
					createElement('div',{
						"slot":'trigger'
						}, ['==========='])
				]).concat(['Upload'
			]))
		]);
}};
members._init={value:function _init(options){
(function Person(options){
	Component.prototype._init.call(this,options);
}).call(this,options);
}}
var Person = Component.createComponent({
	name:'es-Person'
});
Class.creator(13,Person,{
	'id':1,
	'ns':'',
	'name':'Person',
	'inherit':Component,
	'members':members
}, false);
export default Person;
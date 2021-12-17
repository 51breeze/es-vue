var _private=Symbol("private");
import Component from "./web/components/Component.js";
import PersonSkin from "./PersonSkin.js";
import Class from "./core/Class.js";
var Person = Component.createComponent({
	name:'Person',
	extends:Component,
	props:{
		name:{type:String}
	}
});
var members = {};
members.name={m:3,d:4,configurable:true,enumerable:true,get:function name(){
	return this.data('name');
},set:function name(value){
	this.data('name',value);
}};
members.mounted={m:3,d:3,value:function mounted(){
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
				"foot":this.slot('foot',true) || (function(props){return [
					createElement('div',{
						"slot":'foot'
						}, ['the is PersonSkin child==========foot',props.props
					])
				]}).bind(this)
				}
				})
		].concat((this.slot('default') || [])));
}};
members._init={value:function _init(options){
(function Person(options){
	Object.defineProperty(this,_private,{value:{}});
	Component.prototype._init.call(this,options);
}).call(this,options);
}}
Class.creator(9,Person,{
	'id':1,
	'ns':'',
	'name':'Person',
	'private':_private,
	'inherit':Component,
	'members':members
});
export default Person;
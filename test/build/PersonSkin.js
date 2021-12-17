var _private=Symbol("private");
import web_components_Component from "./web/components/Component.js";
import Class from "./core/Class.js";
var PersonSkin = web_components_Component.createComponent({
	name:'PersonSkin',
	extends:web_components_Component,
	props:{
		name:{type:String},
		value:{type:String}
	}
});
var members = {};
members.render={m:3,d:3,value:function render(){
	var createElement = this.createElement.bind(this);
	return createElement('div', null, [
		this.name ? createElement('div',{
			"class":'bg'
			}, ['1']) : 
		!(this.name) ? createElement('div',null, ['2']) : 
		createElement('div',null, ['399999']),
		['china'].concat(this.list).map((function(item){
			return createElement('div',null, [
					createElement('div',null, [item]),
					createElement('div',{
						"class":"ssss"
						}, [
						createElement('div',null, [
							createElement('span',null, (this.slot('default') || []))
						])
					])
				]);
		}).bind(this)),
		createElement('div',{
			"ref":'iss',
			"class":""
			}, [
			createElement('div',null, ['item =====PersonSkin====',this.name,'====='
			])
		]),
		createElement('input',{
			"attrs":{
			"value":this.value
			},
			"on":{
			"input":(function(event){this.value=event && event.target && event.target.nodeType===1 ? event.target.value : event;}).bind(this),
			"change":this.onChange.bind(this)
			},
			"domProps":{
			"value":this.value
			}
			}),
		createElement('input',{
			"attrs":{
			"value":this.value
			},
			"domProps":{
			"value":this.value
			}
			})
	].concat((this.slot('foot',true,true,{props:this.list}) || [
			createElement('div',{
				"slot":'foot'
				}, ['===============the is foot slot =============='])
		])));
}};
members.name={m:3,d:4,configurable:true,enumerable:true,get:function name(){
	return this.data('name');
},set:function name(value){
	this.data('name',value);
}};
members.list={m:3,d:4,configurable:true,enumerable:true,get:function list(){
	return ['one','two','three','four','five'];
}};
members.onChange={m:3,d:3,value:function onChange(){
	console.log('======onChange=======',this.getElementByRefName('iss'),this);
}};
members.value={m:3,d:4,configurable:true,enumerable:true,get:function value(){
	return this.data('value') || '9999';
},set:function value(val){
	console.log("===value======",val);
	this.data('value',val);
}};
members._init={value:function _init(options){
(function (options){
web_components_Component.prototype._init.call(this,options);
}).call(this,options);
}}
Class.creator(10,PersonSkin,{
	'id':1,
	'ns':'',
	'name':'PersonSkin',
	'private':_private,
	'inherit':web_components_Component,
	'members':members
});
export default PersonSkin;
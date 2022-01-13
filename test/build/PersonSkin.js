import web_components_Component from "./web/components/Component.js";
import web_ui_TransitionGroup from "./web/ui/TransitionGroup.js";
import web_ui_TransitionEvent from "./web/ui/TransitionEvent.js";
import Reflect from "./core/Reflect.js";
import Class from "./core/Class.js";
var members = {};
members.render={m:3,d:3,value:function render(){
	var _c;
	var createElement = this.createElement.bind(this);
	return createElement('div', {
		"scopedSlots":{
			"foot":(this.slot('foot',true,true,{props:this.list}) || [
			createElement('div',{
				"slot":'foot'
				}, ['===============the is foot slot =============='])
		])
			}
		}, [
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
			"directives":[
				{
				"name":'model',
				"value":this.value
				}
				]
			}),
		createElement('input',{
			"attrs":{
				"value":this.value
				}
			}),
		createElement('div',{
			"directives":[
				{
				"name":'show',
				"value":this.isShow
				}
				]
			}, ['the is property',this.address
		]),
		createElement('button',{
			"on":{
				"click":(function(){this.isShow=!this.isShow}).bind(this)
				}
			}, ['Toggle']),
		createElement(web_ui_TransitionGroup,{
			"props":{
				"name":"fade",
				"duration":{"enter":5000,"leave":5000}
				},
			"on":(_c={},_c[web_ui_TransitionEvent.BEFORE_ENTER]=this.beforeEnter.bind(this),_c)
			}, [
			this.isShow ? createElement('p',{
				"key":"1"
				}, ['hello']) : null,
			this.isShow ? createElement('p',{
				"key":"2"
				}, ['hello']) : null,
			this.isShow ? createElement('p',{
				"key":"3"
				}, ['hello']) : null
		])
	].concat(this.isShow ? [
			createElement('div',null, ['the is a group condition']),
			createElement('div',null, ['the is a group condition']),
			createElement('div',null, ['the is a group condition']),
			createElement('div',null, ['the is a group condition']),
			createElement('div',null, ['the is a group condition']),
			createElement('div',null, ['the is a group condition'])
		]  : [
			createElement('div',null, ['the is a group elseif'])
		]));
}};
members.address={m:3,d:4,enumerable:true,get:function address(){var res=this.data('address');return res === void 0 ? 'address' : res;},set:function address(value){this.data('address',value)}};
members.name={m:3,d:4,enumerable:true,get:function name(){
	return this.data('name');
},set:function name(value){
	this.data('name',value);
}};
members.list={m:3,d:4,enumerable:true,get:function list(){
	return ['one','two','three','four','five'];
}};
members.onChange={m:3,d:3,value:function onChange(e){
	this.address=Reflect.get(PersonSkin,Reflect.get(PersonSkin,e,"target"),"value") + '---';
}};
members.value={m:3,d:4,enumerable:true,get:function value(){
	return this.data('value') || '9999';
},set:function value(val){
	this.data('value',val);
}};
members.beforeEnter={m:3,d:3,value:function beforeEnter(){
	console.log('=========PersonSkin=====enter');
}};
members.isShow={m:3,d:4,enumerable:true,get:function isShow(){var res=this.data('isShow');return res === void 0 ? true : res;},set:function isShow(value){this.data('isShow',value)}};
var PersonSkin = web_components_Component.createComponent({
	name:'es-PersonSkin'
});
Class.creator(17,PersonSkin,{
	'id':1,
	'ns':'',
	'name':'PersonSkin',
	'inherit':web_components_Component,
	'members':members
}, false);
export default PersonSkin;
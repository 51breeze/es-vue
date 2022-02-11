import "./assets/index.css";
import web_components_Component from "./web/components/Component.js";
import web_animation_TransitionGroup from "./web/animation/TransitionGroup.js";
import web_events_TransitionEvent from "./web/events/TransitionEvent.js";
import Reflect from "./core/Reflect.js";
import Class from "./core/Class.js";
var members = {};
members.render={m:3,d:3,value:function render(){
	var _c;
	var createElement = this.createElement.bind(this);
	return createElement('div', null, [
		this.name ? createElement('div',{
			"class":'bg'
			}, ['1']) : 
		! (this.name) ? createElement('div',null, ['2']) : 
		createElement('div',null, ['399999'])
	].concat(
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
		}).bind(this))).concat(
		[
		createElement('div',{
			"ref":'iss',
			"class":""
			}, [
			createElement('div',null, ['item =====PersonSkin====  ',this.name,'====='
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
			})
	]).concat(
		(this.slot('foot',true,true,{props:this.list}) || [
			createElement('div',{
				"slot":'foot'
				}, ['===============the is foot slot =============='])
		])).concat(
		[
		createElement('div',{
			"directives":[
				{
				"name":'show',
				"value":this.isShow
				}
				]
			}, ['the is property   ',this.address
		]),
		createElement('button',{
			"on":{
				"click":(function(){this.isShow=! this.isShow}).bind(this)
				}
			}, ['Toggle    ']),
		createElement(web_animation_TransitionGroup,{
			"props":{
				"name":"fade"
				},
			"on":(_c={},_c[web_events_TransitionEvent.BEFORE_ENTER]=this.beforeEnter.bind(this),_c)
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
	]).concat(
		this.isShow ? [
			createElement('div',null, ['the is a group condition']),
			createElement('div',null, ['the is a group condition']),
			createElement('div',null, ['the is a group condition']),
			createElement('div',null, ['the is a group condition']),
			createElement('div',null, ['the is a group condition']),
			createElement('div',null, ['the is a group condition'])
		]  : [
			createElement('div',null, ['the is a group elseif'])
		],
		this.list.map((function(item,index){
				return [
					createElement('div',null, ['====each==',item,'=',index
					]),
					createElement('div',null, ['===22=each==',item,'='
					])
				];
			}).bind(this)).reduce(function(acc, val){return acc.concat(val)}, []),
		(function(_refs2){
				var __refs2 = [];
				if( typeof _refs2 ==='number' ){
					_refs2 = Array.from({length:_refs2}, function(v,i){return i;});
				}
				for(var keyName in _refs2){
					var item = _refs2[keyName];
					__refs2.push([
					createElement('div',null, ['====for===',item,',',keyName
					]),
					createElement('div',null, ['===222=for===',item,',',keyName
					])
				]);
				}
				return __refs2;
			}).call(this,this.list).reduce(function(acc, val){return acc.concat(val)}, []),
		[
			createElement('div',{
				"directives":[
					{
					"name":'show',
					"value":this.isShow
					}
					]
				}, ['====show==']),
			createElement('div',{
				"directives":[
					{
					"name":'show',
					"value":this.isShow
					}
					]
				}, ['===222=show==='])
		]));
}};
members.address={m:3,d:4,enumerable:true,get:function address(){var res=this.reactive('address');return res === void 0 ? 'address' : res;},set:function address(value){this.reactive('address',value)}};
members.name={m:3,d:4,enumerable:true,get:function name(){
	return this.reactive('name');
},set:function name(value){
	this.reactive('name',value);
}};
members.list={m:3,d:4,enumerable:true,get:function list(){
	return ['one','two','three','four','five'];
}};
members.onChange={m:3,d:3,value:function onChange(e){
	this.address=Reflect.get(PersonSkin,Reflect.get(PersonSkin,e,'target'),'value') + '---';
}};
members.value={m:3,d:4,enumerable:true,get:function value(){
	return this.reactive('value') || '9999';
},set:function value(val){
	this.reactive('value',val);
}};
members.beforeEnter={m:3,d:3,value:function beforeEnter(){
	console.log('=========PersonSkin=====enter');
}};
members.isShow={m:3,d:4,enumerable:true,get:function isShow(){var res=this.reactive('isShow');return res === void 0 ? true : res;},set:function isShow(value){this.reactive('isShow',value)}};
var PersonSkin = web_components_Component.createComponent({
	name:'es-PersonSkin'
});
Class.creator(12,PersonSkin,{
	'id':1,
	'ns':'',
	'name':'PersonSkin',
	'inherit':web_components_Component,
	'members':members
}, false);
export default PersonSkin;
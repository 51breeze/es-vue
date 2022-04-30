import "./assets/index.css";
import "D:/workspace/es-vue/test/src/PersonSkin.es?id=PersonSkin&type=style&file=611.css";
import web_components_Component from "./web/components/Component.js";
import Tag from "./web/ui/Tag.js";
import web_ui_Input from "./web/ui/Input.js";
import web_animation_TransitionGroup from "./web/animation/TransitionGroup.js";
import web_events_TransitionEvent from "./web/events/TransitionEvent.js";
import web_ui_CheckboxGroup from "./web/ui/CheckboxGroup.js";
import web_ui_Checkbox from "./web/ui/Checkbox.js";
import web_ui_Select from "./web/ui/Select.js";
import web_ui_Option from "./web/ui/Option.js";
import PersonChildSkin from "./PersonChildSkin.js";
import Reflect from "./core/Reflect.js";
import Class from "./core/Class.js";
var members = {};
members.render={m:3,d:3,value:function render(){
		var _this = this;
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
		])
	]).concat(
		
(function(_refs1){
			var __refs1 = [];
			if( typeof _refs1 ==='number' ){
				_refs1 = Array.from({length:_refs1}, function(v,i){return i;});
			}
			for(var index in _refs1){
				var item = _refs1[index];
				__refs1.push(createElement('div',null, [item,'----for---',index
					]));
			}
			return __refs1;
		}).call(this,this.list)).concat(
		this.list.map(function(item){
	return createElement('div',null, ['--------',item,'--internal----'
		]);
})).concat(
		[
		createElement('input',{
			"attrs":{
				"value":this.formValue.name
				},
			"on":{
				"input":(function(event){this.formValue.name=event && event.target && event.target.nodeType===1 ? event.target.value : event;}).bind(this),
				"change":function(e){
return _this.onChange(e);
}
				},
			"directives":[
				{
				"name":'model',
				"value":this.formValue.name
				}
				]
			}),
		createElement('input',{
			"attrs":{
				"value":this.formValue.name
				}
			}),
		createElement(web_ui_Input,{
			"props":{
				"disabled":true,
				"type":"text",
				"value":this.formValue.hhh
				},
			"attrs":{
				"placeholder":"请输入内容",
				"maxLength":20,
				"readonly":false
				},
			"on":{
				"input":(function(event){this.formValue.hhh=event && event.target && event.target.nodeType===1 ? event.target.value : event;}).bind(this)
				},
			"directives":[
				{
				"name":'model',
				"value":this.formValue.hhh
				}
				]
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
			}, ['the is property   '].concat(this.address)),
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
		(function(_refs3){
				var __refs3 = [];
				if( typeof _refs3 ==='number' ){
					_refs3 = Array.from({length:_refs3}, function(v,i){return i;});
				}
				for(var keyName in _refs3){
					var item = _refs3[keyName];
					__refs3.push([
					createElement('div',null, ['====for===',item,',',keyName
					]),
					createElement('div',null, ['===222=for===',item,',',keyName
					])
				]);
				}
				return __refs3;
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
		]).concat(
		[
		createElement(web_ui_CheckboxGroup,{
			"props":{
				"value":this.formValue.ids
				},
			"on":{
				"input":(function(event){this.formValue.ids=event && event.target && event.target.nodeType===1 ? event.target.value : event;}).bind(this)
				},
			"directives":[
				{
				"name":'model',
				"value":this.formValue.ids
				}
				]
			}, [
			createElement(web_ui_Checkbox,{
				"props":{
					"label":1
					}
				}, ['A        ']),
			createElement(web_ui_Checkbox,{
				"props":{
					"label":2
					}
				}, ['B        '])
		]),
		createElement(web_ui_Select,{
			"props":{
				"placeholder":"请选择",
				"value":this.formValue.select,
				"disabled":true
				},
			"on":{
				"input":(function(event){this.formValue.select=event && event.target && event.target.nodeType===1 ? event.target.value : event;}).bind(this)
				},
			"directives":[
				{
				"name":'model',
				"value":this.formValue.select
				}
				]
			}, [
			createElement(web_ui_Option,{
				"props":{
					"value":"1"
					}
				}, ['1']),
			createElement(web_ui_Option,{
				"props":{
					"value":"2"
					}
				}, ['2'])
		])
	]).concat(
		this.getTag()).concat(
		[
		createElement(PersonChildSkin)
	]));
}};
members.address={m:3,d:4,enumerable:true,get:function address(){return this.reactive('address', void 0, function(){return 'addresssss--------999'})},set:function address(value){this.reactive('address',value)}};
members.provide={m:3,d:3,value:function provide(){
	return {"foot":this.formValue};
}};
members.formValue={m:3,d:4,enumerable:true,get:function formValue(){return this.reactive('formValue', void 0, function(){return {"name":'99999',"ids":[],"hhh":'',"select":''}})},set:function formValue(value){this.reactive('formValue',value)}};
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
members.isShow={m:3,d:4,enumerable:true,get:function isShow(){return this.reactive('isShow', void 0, function(){return true})},set:function isShow(value){this.reactive('isShow',value)}};
members.getTag={m:3,d:3,value:function getTag(){
		var createElement1 = this.createElement.bind(this);
	return createElement1(Tag,null, ['ssssssss']);
}};
members._init={value:function _init(options){
this.addEventListener('onBeforeCreate',(function(e){this.addProvider( this.provide.bind(this) );}).bind(this));
(function (options){
web_components_Component.prototype._init.call(this,options);
}).call(this,options);
}}
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
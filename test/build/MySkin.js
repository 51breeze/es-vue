import web_Skin from "./web/Skin.js";
import MyView from "./MyView.js";
import Class from "./core/Class.js";
var _private=Symbol("private");
function MySkin(context){
web_Skin.call(this, context);
}
var members = {};
members.render={m:3,d:3,value:function render(){
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
			createElement('div',null, ['item =====MySkin====',this.name,'====='
			])
		]),
		createElement('input',{
			"on":{
				"input":(function(event){this.value=event && event.target && event.target.nodeType===1 ? event.target.value : event;}).bind(this),
				"change":this.onChange.bind(this)
				}
			}),
		createElement('input',{
			"attrs":{
				"value":this.value
				}
			})
	]);
}};
members.name={m:3,d:4,enumerable:true,get:function name(){
	return this.hostComponent.name;
},set:function name(value){
	this.data('name',value);
}};
members.list={m:3,d:4,enumerable:true,get:function list(){
	return ['one','two','three','four','five'];
}};
members.onChange={m:3,d:3,value:function onChange(){

}};
members.value={m:3,d:4,enumerable:true,get:function value(){
	return this.data('value') || '9999';
},set:function value(val){
	this.data('value',val);
}};
Class.creator(14,MySkin,{
	'id':1,
	'ns':'',
	'name':'MySkin',
	'private':_private,
	'inherit':web_Skin,
	'members':members
}, false);
export default MySkin;
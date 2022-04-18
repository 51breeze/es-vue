import web_components_Component from "./web/components/Component.js";
import web_ui_Input from "./web/ui/Input.js";
import Class from "./core/Class.js";
var members = {};
members.render={m:3,d:3,value:function render(){
	var createElement = this.createElement.bind(this);
	return [
		createElement('div',null, ['the is Injector foot-----        '].concat(this.footValue.name).concat(
			[
			createElement(web_ui_Input,{
				"props":{
					"value":this.footValue.name
					},
				"on":{
					"input":(function(event){this.footValue.name=event && event.target && event.target.nodeType===1 ? event.target.value : event;}).bind(this)
					},
				"directives":[
					{
					"name":'model',
					"value":this.footValue.name
					}
					]
				})]))
	];
}};
members.footValue={m:3,d:4,enumerable:true,get:function footValue(){return this.reactive('footValue', void 0, function(){return {"name":'default value'}})},set:function footValue(value){this.reactive('footValue',value)}};
members._init={value:function _init(options){
this.addEventListener('onBeforeCreate',(function(e){this.injectProperty("footValue", "foot", {"name":'default value'});}).bind(this));
(function (options){
web_components_Component.prototype._init.call(this,options);
}).call(this,options);
}}
var PersonChildSkin = web_components_Component.createComponent({
	name:'es-PersonChildSkin'
});
Class.creator(14,PersonChildSkin,{
	'id':1,
	'ns':'',
	'name':'PersonChildSkin',
	'inherit':web_components_Component,
	'members':members
}, false);
export default PersonChildSkin;
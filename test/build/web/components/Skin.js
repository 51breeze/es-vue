import Component from "./Component.js";
import Event from "./../../core/Event.js";
import Class from "./../../core/Class.js";
var _private=Symbol("private");
function Skin(hostComponent){
	Object.defineProperty(this,_private,{value:{'_hostComponent':null}});
	this[_private]._hostComponent=hostComponent;
}
var members = {};
members._hostComponent={m:1,d:1,writable:true,value:null};
members.hostComponent={m:3,d:4,enumerable:true,get:function hostComponent(){
	return this[_private]._hostComponent;
}};
members.reactive={m:3,d:3,value:function reactive(name,value){
	return this.hostComponent.reactive(name,value);
}};
members.forceUpdate={m:3,d:3,value:function forceUpdate(){
	return this.hostComponent.forceUpdate();
}};
members.getElementByName={m:3,d:3,value:function getElementByName(name){
	return this.hostComponent.getElementByName(name);
}};
members.slot={m:3,d:3,value:function slot(name,scope,called,params){
	return this.hostComponent.slot(name,scope,called,params);
}};
members.createElement={m:3,d:3,value:function createElement(name,data,children){
	return this.hostComponent.createElement(name,data,children);
}};
members.watch={m:3,d:3,value:function watch(name,callback){
	this.hostComponent.watch(name,callback);
}};
members.observable={m:3,d:3,value:function observable(target){
	return this.hostComponent.observable(target);
}};
members.nextTick={m:3,d:3,value:function nextTick(callback){
	this.hostComponent.nextTick(callback);
}};
members.on={m:3,d:3,value:function on(type,listener){
	this.hostComponent.on(type,listener);
}};
members.off={m:3,d:3,value:function off(type,listener){
	this.hostComponent.off(type,listener);
}};
members.emit={m:3,d:3,value:function emit(type){
	var args = Array.prototype.slice.call(arguments,1);
	this.hostComponent.emit(type,args);
}};
members.addEventListener={m:3,d:3,value:function addEventListener(type,listener){
	return this.hostComponent.addEventListener(type,listener);
}};
members.dispatchEvent={m:3,d:3,value:function dispatchEvent(event){
	return this.hostComponent.dispatchEvent(event);
}};
members.removeEventListener={m:3,d:3,value:function removeEventListener(type,listener){
	return this.hostComponent.removeEventListener(type,listener);
}};
members.hasEventListener={m:3,d:3,value:function hasEventListener(type,listener){
	return this.hostComponent.removeEventListener(type,listener);
}};
members.render={m:3,d:3,value:function render(){
	return null;
}};
Class.creator(8,Skin,{
	'id':1,
	'ns':'web.components',
	'name':'Skin',
	'private':_private,
	'members':members
}, false);
export default Skin;
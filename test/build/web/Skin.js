import EventDispatcher from "./../core/EventDispatcher.js";
import Component from "./components/Component.js";
import Class from "./../core/Class.js";
var _private=Symbol("private");
function Skin(hostComponent){
	Object.defineProperty(this,_private,{value:{'_hostComponent':null,'_event':null}});
	EventDispatcher.call(this);
	this[_private]._hostComponent=hostComponent;
}
var members = {};
members._hostComponent={m:1,d:1,writable:true,value:null};
members._event={m:1,d:1,writable:true,value:null};
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
members.render={m:3,d:3,value:function render(){
	return this.hostComponent.createElement('div');
}};
Class.creator(10,Skin,{
	'id':1,
	'ns':'web',
	'name':'Skin',
	'private':_private,
	'inherit':EventDispatcher,
	'members':members
}, false);
export default Skin;
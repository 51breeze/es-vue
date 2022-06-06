import Component from "./Component.js";
import Class from "./../../core/Class.js";
var _private=Symbol("private");
var members = {};
members.skinInstance={m:1,d:1,writable:true,value:null};
members._skinClass={m:1,d:1,writable:true,value:null};
members.skin={m:3,d:4,enumerable:true,get:function skin(){
	const instance = this[_private].skinInstance;
	if(instance){
	return instance;
	}
	return this[_private].skinInstance=new this.skinClass(this);
}};
members.skinClass={m:3,d:4,enumerable:true,get:function skinClass(){
	return this[_private]._skinClass;
},set:function skinClass(value){
	if(this[_private]._skinClass !== value){
		this[_private]._skinClass=value;
		this[_private].skinInstance=null;
	}
}};
members.render={m:3,d:3,value:function render(){
	return this.skin.render();
}};
members._init={value:function _init(options){
(function SkinComponent(){
	Object.defineProperty(this,_private,{value:{'skinInstance':null,'_skinClass':null}});
	Component.prototype._init.call(this);
}).call(this,options);
}}
var SkinComponent = Component.createComponent({
	name:'es-SkinComponent'
});
Class.creator(2,SkinComponent,{
	'id':1,
	'ns':'web.components',
	'name':'SkinComponent',
	'private':_private,
	'inherit':Component,
	'members':members
}, false);
export default SkinComponent;
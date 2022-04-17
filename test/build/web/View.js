import Component from "./components/Component.js";
import Class from "./../core/Class.js";
var _private=Symbol("private");
var members = {};
members.enter={m:3,d:3,value:function enter(to,from){

}};
members.leave={m:3,d:3,value:function leave(){

}};
members.skin={m:3,d:4,enumerable:true,get:function skin(){
	return new this.skinClass(this);
}};
members._skinClass={m:1,d:1,writable:true,value:null};
members.skinClass={m:3,d:4,enumerable:true,get:function skinClass(){
	return this[_private]._skinClass;
},set:function skinClass(value){
	this[_private]._skinClass=value;
}};
members.render={m:3,d:3,value:function render(){
	return this.skin.render();
}};
members._init={value:function _init(options){
(function (options){
	Object.defineProperty(this,_private,{value:{'_skinClass':null}});
Component.prototype._init.call(this,options);
}).call(this,options);
}}
var View = Component.createComponent({
	name:'View'
});
Class.creator(2,View,{
	'id':1,
	'ns':'web',
	'name':'View',
	'private':_private,
	'inherit':Component,
	'members':members
}, false);
export default View;
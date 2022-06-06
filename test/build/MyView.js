import SkinComponent from "./web/components/SkinComponent.js";
import web_components_Component from "./web/components/Component.js";
import Class from "./core/Class.js";
import MySkin from "./MySkin.js";
var members = {};
members.name={m:3,d:4,enumerable:true,get:function name(){
	return '=========MyView of MySkin=============';
}};
members.nameMyView={m:3,d:4,enumerable:true,get:function nameMyView(){
	return 'name';
}};
members._init={value:function _init(options){
(function MyView(){
	SkinComponent.prototype._init.call(this);
	this.skinClass=MySkin;
	this.skinClass;
	this.skin;
}).call(this,options);
}}
var MyView = web_components_Component.createComponent({
	name:'es-MyView',
	extends:SkinComponent
});
Class.creator(1,MyView,{
	'id':1,
	'ns':'',
	'name':'MyView',
	'inherit':SkinComponent,
	'members':members
}, false);
export default MyView;
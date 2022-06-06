import Component from "./web/components/Component.js";
import Option from "./web/ui/Option.js";
import Class from "./core/Class.js";
var members = {};
members.render={m:3,d:3,value:function render(){
	return this.createElement(Option,this.getConfig(),this.slot('default'));
}};
var MyOption = Component.createComponent({
	name:'es-MyOption'
});
Class.creator(10,MyOption,{
	'id':1,
	'ns':'',
	'name':'MyOption',
	'inherit':Component,
	'members':members
}, false);
export default MyOption;
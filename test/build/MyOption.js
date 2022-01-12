import Option from "./web/ui/Option.js";
import Component from "./web/components/Component.js";
import Class from "./core/Class.js";
var members = {};
members.render={m:3,d:3,value:function render(){
	return Option.prototype.render.call(this);
}};
var MyOption = Component.createComponent({
	name:'MyOption',
	extends:Option
});
Class.creator(9,MyOption,{
	'id':1,
	'ns':'',
	'name':'MyOption',
	'inherit':Option,
	'members':members
}, false);
export default MyOption;
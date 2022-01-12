import ElSelect from "./ElSelect.js";
import web_components_Component from "./../components/Component.js";
import Class from "./../../core/Class.js";
var members = {};
members.focus={m:3,d:3,value:function focus(){
	ElSelect.prototype.focus.call(this);
}};
members.mounted={m:3,d:3,value:function mounted(){
	this.focus();
	this.watch('value',function(newValue,oldValue){
		console.log('-------',newValue,oldValue);
	});
}};
var Select = web_components_Component.createComponent({
	name:'Select',
	extends:ElSelect
});
Class.creator(8,Select,{
	'id':1,
	'ns':'web.ui',
	'name':'Select',
	'inherit':ElSelect,
	'members':members
}, false);
export default Select;
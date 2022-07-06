const Class = require("./core/Class.js");
function MyOption(){}
const members = {
	render:{
		m:3,
		id:3,
		value:function render(){
			return this.createElement(Option,this.getConfig(),this.slot('default'));
		}
	}
}
Class.creator(12,MyOption,{
	id:1,
	name:"MyOption",
	members:members
});
module.exports=MyOption;
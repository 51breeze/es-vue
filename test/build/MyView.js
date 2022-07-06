const Class = require("./core/Class.js");
const SkinComponent = require("./web/components/SkinComponent.js");
function MyView(){
	SkinComponent.prototype._init.call(this);
	this.skinClass=MySkin;
	this.skinClass;
	this.skin;
}
const members = {
	name:{
		m:3,
		id:4,
		enumerable:true,
		get:function name(){
			return '=========MyView of MySkin=============';
		}
	},
	nameMyView:{
		m:3,
		id:4,
		enumerable:true,
		get:function nameMyView(){
			return 'name';
		}
	}
}
Class.creator(1,MyView,{
	id:1,
	name:"MyView",
	inherit:SkinComponent,
	members:members
});
module.exports=MyView;
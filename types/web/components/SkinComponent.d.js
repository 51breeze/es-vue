const Class = require("./../../core/Class.js");
const _private = Symbol("private");
function SkinComponent(){
	Object.defineProperty(this,_private,{
		value:{
			skinInstance:null,
			_skinClass:"null"
		}
	});
	Component.prototype._init.call(this);
}
const members = {
	skinInstance:{
		m:1,
		id:1,
		writable:true,
		value:null
	},
	_skinClass:{
		m:1,
		id:1,
		writable:true,
		value:
	},
	skin:{
		m:3,
		id:4,
		enumerable:true,
		get:function skin(){
			const instance = this[_private].skinInstance;
			if(instance)
			return instance;
			return this[_private].skinInstance=new this.skinClass(this);
		}
	},
	skinClass:{
		m:3,
		id:4,
		enumerable:true,
		get:function skinClass(){
			return this[_private]._skinClass;
		},
		set:function skinClass(value){
			if(this[_private]._skinClass !== value){
				this[_private]._skinClass=value;
				this[_private].skinInstance=null;
			}
		}
	},
	render:{
		m:3,
		id:3,
		value:function render(){
			return this.skin.render();
		}
	}
}
Class.creator(2,SkinComponent,{
	id:1,
	ns:"web.components",
	name:"SkinComponent",
	private:_private,
	members:members
});
module.exports=SkinComponent;
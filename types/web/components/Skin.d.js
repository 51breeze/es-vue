const Class = require("./../../core/Class.js");
const Event = require("./../../core/Event.js");
const _private = Symbol("private");
function Skin(hostComponent){
	Object.defineProperty(this,_private,{
		value:{
			_hostComponent:null
		}
	});
	this[_private]._hostComponent=hostComponent;
}
const members = {
	_hostComponent:{
		m:1,
		id:1,
		writable:true,
		value:null
	},
	hostComponent:{
		m:3,
		id:4,
		enumerable:true,
		get:function hostComponent(){
			return this[_private]._hostComponent;
		}
	},
	reactive:{
		m:3,
		id:3,
		value:function reactive(name,value){
			return this.hostComponent.reactive(name,value);
		}
	},
	forceUpdate:{
		m:3,
		id:3,
		value:function forceUpdate(){
			return this.hostComponent.forceUpdate();
		}
	},
	getElementByName:{
		m:3,
		id:3,
		value:function getElementByName(name){
			return this.hostComponent.getElementByName(name);
		}
	},
	slot:{
		m:3,
		id:3,
		value:function slot(name,scope,called,params){
			return this.hostComponent.slot(name,scope,called,params);
		}
	},
	createElement:{
		m:3,
		id:3,
		value:function createElement(name,data,children){
			return this.hostComponent.createElement(name,data,children);
		}
	},
	watch:{
		m:3,
		id:3,
		value:function watch(name,callback){
			this.hostComponent.watch(name,callback);
		}
	},
	observable:{
		m:3,
		id:3,
		value:function observable(target){
			return this.hostComponent.observable(target);
		}
	},
	nextTick:{
		m:3,
		id:3,
		value:function nextTick(callback){
			this.hostComponent.nextTick(callback);
		}
	},
	on:{
		m:3,
		id:3,
		value:function on(type,listener){
			this.hostComponent.on(type,listener);
		}
	},
	off:{
		m:3,
		id:3,
		value:function off(type,listener){
			this.hostComponent.off(type,listener);
		}
	},
	emit:{
		m:3,
		id:3,
		value:function emit(type,...args){
			this.hostComponent.emit(type,args);
		}
	},
	addEventListener:{
		m:3,
		id:3,
		value:function addEventListener(type,listener){
			return this.hostComponent.addEventListener(type,listener);
		}
	},
	dispatchEvent:{
		m:3,
		id:3,
		value:function dispatchEvent(event){
			return this.hostComponent.dispatchEvent(event);
		}
	},
	removeEventListener:{
		m:3,
		id:3,
		value:function removeEventListener(type,listener){
			return this.hostComponent.removeEventListener(type,listener);
		}
	},
	hasEventListener:{
		m:3,
		id:3,
		value:function hasEventListener(type,listener){
			return this.hostComponent.removeEventListener(type,listener);
		}
	},
	render:{
		m:3,
		id:3,
		value:function render(){
			return null;
		}
	}
}
Class.creator(11,Skin,{
	id:1,
	ns:"web.components",
	name:"Skin",
	private:_private,
	members:members
});
module.exports=Skin;
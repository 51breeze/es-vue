const Class = require("./core/Class.js");
const MyOption = require("./MyOption.js");
require("./assets/test.css");function Test(options){
	Component.prototype._init.call(this,options);
}
const members = {
	onInitialized:{
		m:3,
		id:3,
		value:function onInitialized(){
			console.log('====onInitialized========');
			Component.prototype.onInitialized.call(this);
		}
	},
	address:{
		m:3,
		id:1,
		writable:true,
		enumerable:true,
		value:
	},
	onBeforeMount:{
		m:3,
		id:3,
		value:function onBeforeMount(){
			console.log('=====beforeMount======');
		}
	},
	name:{
		m:3,
		id:4,
		enumerable:true,
		get:function name(){
			return this.reactive('name');
		},
		set:function name(value){
			this.reactive('name',value);
		}
	},
	value:{
		m:3,
		id:4,
		enumerable:true,
		get:function value(){
			return this.reactive('value');
		},
		set:function value(val){
			console.log('=====ssssssssss======');
			this.reactive('value',val);
		}
	},
	tips:{
		m:3,
		id:3,
		value:function tips(){
			Notification({
				title:'提示成功',
				message:'这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案'
			});
		}
	},
	skin:{
		m:3,
		id:4,
		enumerable:true,
		get:function skin(){
			return null;
		}
	},
	childElements:{
		m:3,
		id:4,
		enumerable:true,
		get:function childElements(){
			return this.reactive('children');
		},
		set:function childElements(value){
			this.reactive('children',value);
		}
	},
	render:{
		m:3,
		id:3,
		value:function render(){
			const createElement = this.createElement.bind(this);
			return createElement("div",null,[
				createElement("p",null,[
					createElement("h5",{
						on:{
							click:this.tips.bind(this)
						}
					},[
						"点击这里提示 "
					].concat(
						this.name
					)),
					createElement(Select,{
						props:{
							value:this.value,
							name:"name",
							size:"mini"
						},
						on:{
							input:(function(){
								this.value=event && event.target && event.target.nodeType===1 ? event.target.value : event;
							}).bind(this)
						},
						directives:[{
							name:"model",
							value:this.value
						}]
					},[
						createElement(MyOption,{
							attrs:{
								value:"深圳"
							}
						})
					].concat(
						createElement(MyOption,{
							attrs:{
								value:"长沙"
							}
						}),
						this.slot("prefix") || [
							createElement("div",{
								slot:"prefix"
							},["6666"])
						]
					))
				]),
				createElement(Link,{
					props:{
						to:'/test'
					}
				},["测试页面"]),
				createElement("br"),
				createElement(Link,{
					props:{
						to:'/index'
					}
				},["首页面"]),
				createElement("div",null,[
					createElement(KeepAlive,null,[
						createElement(Viewport)
					])
				])
			]);
		}
	},
	beforeEnter:{
		m:3,
		id:3,
		value:function beforeEnter(...args){
			console.log(args);
		}
	},
	isShow:{
		m:3,
		id:1,
		writable:true,
		enumerable:true,
		value:true
	},
	toggle:{
		m:3,
		id:3,
		value:function toggle(){
			this.isShow=!this.isShow;
			console.log('--------',this.isShow);
		}
	}
}
Class.creator(11,Test,{
	id:1,
	name:"Test",
	members:members
});
module.exports=Test;
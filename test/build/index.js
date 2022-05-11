import VueRouter from "vue-router";
import MyView from "./MyView.js";
import Test from "./Test.js";
import Router from "./web/components/Router.js";
import Class from "./core/Class.js";
import MySkin from "./MySkin.js";
import System from "./core/System.js";
import Person from "./Person.js";
import PersonSkin from "./PersonSkin.js";
var _private=Symbol("private");
function Index(){
	Object.defineProperty(this,_private,{value:{'_instance':null}});
}
var methods = {};
methods.main={m:3,d:3,value:function main(){
	const index = new Index();
	var v = new MyView();
	v.skinClass=MySkin;
	var map = new Map();
	map.set('name',{});
	var set = new Set();
	set.add(v);
	var it = Array.from(set.values());
	var en = map.entries();
	for(var item,_v,_i=System.getIterator(en); _i && (_v=_i.next()) && !_v.done;){
		item=_v.value;
		var b = item[0];
	}
	console.log(map.size,set.size,Array.from(set.values()));
	index.instance.childElements=v.render();
	index.display();
}};
var members = {};
members.display={m:3,d:3,value:function display(){
	var _this = this;
	this.instance.value="深圳";
	this.instance.mount('#app');
	setTimeout(function(){
		const vm = _this.instance;
	},1000);
}};
members.router={m:3,d:4,enumerable:true,get:function router(){
	return new Router({"routes":[{"path":"/index","component":Person},{"path":"/test","component":PersonSkin}]});
}};
members._instance={m:1,d:1,writable:true,value:null};
members.instance={m:3,d:4,enumerable:true,get:function instance(){
	if(this[_private]._instance){
		return this[_private]._instance;
	}
	this[_private]._instance=new Test({"router":this.router});
	return this[_private]._instance;
}};
members.testRouterClass={m:3,d:3,value:function testRouterClass(){
	it("should VueRouter eq Router ",function(){
		expect(VueRouter).toBe(Router);
	});
}};
members.test8={m:3,d:3,value:function test8(){
	var args = Array.prototype.slice.call(arguments,0);

}};
members.testRouterView={m:3,d:3,value:function testRouterView(){
	var _this = this;
	this.instance.mount();
	it('should router page view',function(){
		_this.instance.name="标题名称";
		setTimeout(function(){
			const vm = _this.instance;
			expect(vm.$el.textContent).toContain('标题名称');
			expect(vm.$el.textContent).toContain('深圳');
			expect(vm.$el.textContent).toContain('点击这里提示');
			expect(vm.$el.textContent).toContain('测试页面');
			expect(vm.$el.textContent).toContain('首页面');
		},100);
	});
	it('should router page view',function(done){
		const vm = _this.instance;
		vm.$router.push({"path":'index'});
		setTimeout(function(){
			expect(vm.$el.textContent).toContain('the is PersonSkin child');
			expect(vm.$el.textContent).toContain('the scope value:onetwothreefourfive');
			const el = vm.$el.querySelector('#person-root-child');
			expect('Person page').toContain(el.textContent);
			done();
		},100);
	});
}};
Class.creator(0,Index,{
	'id':1,
	'ns':'',
	'name':'Index',
	'private':_private,
	'methods':methods,
	'members':members
}, false);
export default Index;
Index.main();
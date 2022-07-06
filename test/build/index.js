const MyView = require("./MyView.js");
const Test = require("./Test.js");
const Class = require("./core/Class.js");
const Person = require("./Person.js");
const PersonSkin = require("./PersonSkin.js");
const VueRouter = require("vue-router");
const _private = Symbol("private");
function Index(){
	Object.defineProperty(this,_private,{
		value:{
			_instance:null
		}
	});
}
const methods = {
	main:{
		m:3,
		id:3,
		value:function main(){
			const index = new Index();
			var v = new MyView();
			v.skinClass=MySkin;
			var map = new Map();
			map.set('name',{});
			var set = new Set();
			set.add(v);
			var it = Array.from(set.values());
			var en = map.entries();
			for(var item of en){
				var b = item[0];
			}
			console.log(map.size,set.size,Array.from(set.values()));
			index.instance.childElements=v.render();
			index.display();
		}
	}
}
const members = {
	display:{
		m:3,
		id:3,
		value:function display(){
			this.instance.value="深圳";
			this.instance.mount('#app');
			setTimeout(()=>{
				const vm = this.instance;
			},1000);
		}
	},
	router:{
		m:3,
		id:4,
		enumerable:true,
		get:function router(){
			return new Router({
				routes:[{
					path:"/index",
					component:Person
				},{
					path:"/test",
					component:PersonSkin
				}]
			});
		}
	},
	_instance:{
		m:1,
		id:1,
		writable:true,
		value:null
	},
	instance:{
		m:3,
		id:4,
		enumerable:true,
		get:function instance(){
			if(this[_private]._instance){
				return this[_private]._instance;
			}
			this[_private]._instance=new Test({
				router:this.router
			});
			return this[_private]._instance;
		}
	},
	testRouterClass:{
		m:3,
		id:3,
		value:function testRouterClass(){
			it("should VueRouter eq Router ",()=>{
				expect(VueRouter).toBe(Router);
			});
		}
	},
	test8:{
		m:3,
		id:3,
		value:function test8(...args){}
	},
	testRouterView:{
		m:3,
		id:3,
		value:function testRouterView(){
			this.instance.mount();
			it('should router page view',()=>{
				this.instance.name="标题名称";
				setTimeout(()=>{
					const vm = this.instance;
					expect(vm.$el.textContent).toContain('标题名称');
					expect(vm.$el.textContent).toContain('深圳');
					expect(vm.$el.textContent).toContain('点击这里提示');
					expect(vm.$el.textContent).toContain('测试页面');
					expect(vm.$el.textContent).toContain('首页面');
				},100);
			});
			it('should router page view',(done)=>{
				const vm = this.instance;
				vm.$router.push({
					path:'index'
				});
				setTimeout(()=>{
					expect(vm.$el.textContent).toContain('the is PersonSkin child');
					expect(vm.$el.textContent).toContain('the scope value:onetwothreefourfive');
					const el = vm.$el.querySelector('#person-root-child');
					expect('Person page').toContain(el.textContent);
					done();
				},100);
			});
		}
	}
}
Class.creator(0,Index,{
	id:1,
	name:"Index",
	private:_private,
	methods:methods,
	members:members
});
module.exports=Index;
Index.main();
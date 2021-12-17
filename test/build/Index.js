var _private=Symbol("private");
import Router from "./web/Router.js";
import Test from "./Test.js";
import Class from "./core/Class.js";
import Person from "./Person.js";
import PersonSkin from "./PersonSkin.js";
function Index(){
}
var methods = {};
methods.main={m:3,d:3,value:function main(){
	const router = new Router({"routes":[{"path":"/index","component":Person},{"path":"/test","component":PersonSkin}]});
	const p = new Test({"router":router});
	p.name="深圳";
	p.mount('#app');
}};
Class.creator(0,Index,{
	'id':1,
	'ns':'vue',
	'name':'Index',
	'private':_private,
	'methods':methods
});
export default Index;
Index.main();
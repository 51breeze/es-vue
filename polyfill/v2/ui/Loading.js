///<import from='vue' name='Vue' />
///<import from='element-ui/packages/loading' name='Loading' />
///<import from='element-ui/lib/theme-chalk/loading.css' />
///<namespaces name='web.ui' />
///<createClass value='false' />
///<referenceAssets value='false' />
Vue.use(Loading);
Object.defineProperty(Loading,'directive',{get:function(){
      return Vue.directive('loading');
}});
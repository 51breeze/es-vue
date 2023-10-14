/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
///<import from='vue' name='Vue' />
///<references from='System' />
///<references from='web.components.Component' />
///<references from='web.components.Router' />
///<import from='element-ui/lib/theme-chalk/base.css' />
///<namespaces name='web' />
const privateKey = Symbol('private');
function Application( options ){
    this[privateKey] = {
        _app:null,
        _provides:{},
        _plugins:[],
        _mixins:{},
        _options:options
    };
}

Application.prototype = Object.create( Component.prototype );
Application.prototype.constructor = Application;

Object.defineProperty(Application.prototype,'app',{get:function app(){
   return this[privateKey]._app;
}});

Object.defineProperty(Application.prototype,'plugin',{value:function plugin( plugin ){
    plugin = Array.isArray(plugin) ? plugin : [plugin];
    this[privateKey]._plugins.push( ...plugin );
    return this;
}});

Object.defineProperty(Application.prototype,'provide',{value:function provide(name,value){
    this[privateKey]._provides[name] = value;
    return this;
}});

Object.defineProperty(Application.prototype,'mixin',{value:function mixin(name, method){
    this[privateKey]._mixins[name] = method;
    return this;
}});

Object.defineProperty(Application.prototype,'locale',{get:function locale(){
    return null;
}});

Object.defineProperty(Application.prototype,'store',{get:function store(){
    return null;
}});

Object.defineProperty(Application.prototype,'directives',{get:function directives(){
    return null;
}});

Object.defineProperty(Application.prototype,'routes',{get:function routes(){
    return [];
}});

Object.defineProperty(Application.prototype,'render',{get:function render(){
    throw new Error('application render method must overwrite in subclass');
}});

Object.defineProperty(Application.prototype,'router',{get:function router(){
    const routes = this.routes;
    if( routes && routes.length === 0 )return null;
    const router = this[privateKey]._router;
    if( router )return router;
    return this[privateKey]._router = new Router({
        routes:routes
    });
}});

Object.defineProperty(Application.prototype,'mount',{value:function mount(element){
    const mixins = this[privateKey]._mixins;
    const plugins = this[privateKey]._plugins;
    const opts = this[privateKey]._options || {};
    if( mixins ){
        Vue.mixin({
            methods:mixins
        });
    }
    if( plugins && plugins.lenght > 0 ){
        plugins.forEach( plugin=> Vue.use( plugin ) );
    }
    const directives = this.directives;
    if( directives ){
        Object.keys(directives).forEach( name=>{
            Vue.directive(name, directives[name]);
        });
    }
    const options = {
        ...opts,
    };
    ['router','locale','store','provide'].forEach( key=>{
        const value = key==='provide' ?  this[privateKey]._provides : this[key];
        if( value ){
            if( key==='provide'){
                Object.keys(value).forEach(key=>{
                    System.registerProvide(key, value[key], 'global:vue:application')
                });
            }
            options[key] = value;
        }
    });
    options.el = element;
    options.render=(h)=>{
        return this.render(h);
    }
    this[privateKey]._app = new Vue(options);
}});

Object.defineProperty( Application.prototype, 'unmount', {value:function unmount(){
    this.app.$destroy();
    return this;
}});

Object.defineProperty( Application.prototype, 'getRefs', {value:function getRefs(name){
    return this.app.$refs[name];
}});

Object.defineProperty( Application.prototype, 'element', {get:function element(){
    return this.app.$el;
}});

Object.defineProperty( Application.prototype, 'parent', {get:function parent(){
    return this.app.$parent;
}});

Object.defineProperty( Application.prototype, 'children', {get:function children(){
    return this.app.$children;
}});

Object.defineProperty( Application.prototype, 'createVNode', {value:function createVNode(name,config,children){
    return this.app.$createElement(name, config, children);
}});

Object.defineProperty( Application.prototype, 'getAttribute', {value:function getAttribute(name){
    return this.app['$'+name] || null;
}});
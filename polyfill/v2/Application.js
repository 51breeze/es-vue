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
///<references from='Reflect' />
///<import from='element-ui/lib/theme-chalk/base.css' />
///<import from='${__filename}?callhook&action=config' name='__config'/>
///<import from='${__filename}?callhook&action=route' name='__routes' />
///<namespaces name='web' />
const privateKey = Symbol('private');
function Application( options ){
    Component.prototype._init.call(this, {});
    this[privateKey] = {
        _vueApp:null,
        _provides:{},
        _plugins:[],
        _mixins:{},
        _options:options
    };
    System.setConfig('#global#application#instance#',this)
}

Application.prototype = Object.create( Component.prototype );
Application.prototype.constructor = Application;

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
    return __routes;
}});

Object.defineProperty( Application.prototype, 'config', {get:function config(){
    return __config;
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
            // if( key==='provide'){
            //     Object.keys(value).forEach(key=>{
            //         System.registerProvide(key, value[key], 'global:vue:application')
            //     });
            // }
            options[key] = value;
        }
    });
    options.el = element;
    options.render=(h)=>{
        return this.render(h);
    }
    options.mixins = [{
        beforeMount:()=>{
            if( this.hasEventListener(ComponentEvent.BEFORE_MOUNT) ){
                this.dispatchEvent( new ComponentEvent( ComponentEvent.BEFORE_MOUNT ) );
            }
            this.onBeforeMount();
        },
        mounted:()=>{
            if( this.hasEventListener(ComponentEvent.MOUNTED) ){
                this.dispatchEvent( new ComponentEvent( ComponentEvent.MOUNTED ) );
            }
            this.onMounted();
        },
        beforeUpdate(){
            if( this.hasEventListener(ComponentEvent.BEFORE_UPDATE) ){
                this.dispatchEvent( new ComponentEvent( ComponentEvent.BEFORE_UPDATE ) );
            }
            this.onBeforeUpdate();
        },
        updated:()=>{
            if( this.hasEventListener(ComponentEvent.UPDATED) ){
                this.dispatchEvent( new ComponentEvent( ComponentEvent.UPDATED ) );
            }
            this.onUpdated();
        },
        beforeDestroy:()=>{
            if( this.hasEventListener(ComponentEvent.BEFORE_DESTROY) ){
                this.dispatchEvent( new ComponentEvent( ComponentEvent.BEFORE_DESTROY ) );
            }
            this.onBeforeUnmount();
        },
        destroyed:()=>{
            if( this.hasEventListener(ComponentEvent.DESTROYED) ){
                this.dispatchEvent( new ComponentEvent( ComponentEvent.DESTROYED ) );
            }
            this.onUnmounted();
        },
        errorCaptured:()=>{
            if( this.hasEventListener(ComponentEvent.ERROR_CAPTURED) ){
                this.dispatchEvent( new ComponentEvent( ComponentEvent.ERROR_CAPTURED ) );
            }
            this.onErrorCaptured();
        },
        activated:()=>{
            if( this.hasEventListener(ComponentEvent.ACTIVATED) ){
                this.dispatchEvent( new ComponentEvent( ComponentEvent.ACTIVATED ) );
            }
            this.onActivated();
        },
        deactivated:()=>{
            if( this.hasEventListener(ComponentEvent.DEACTIVATED) ){
                this.dispatchEvent( new ComponentEvent( ComponentEvent.DEACTIVATED ) );
            }
            this.onDeactivated();
        }
    }];
    this[privateKey]._vueApp = new Vue(options);
}});

Object.defineProperty( Application.prototype, 'unmount', {value:function unmount(){
    getVueApp(this).$destroy();
    return this;
}});

Object.defineProperty( Application.prototype, 'forceUpdate', {value:function forceUpdate(){
    getVueApp(this).$forceUpdate();
}});

Object.defineProperty( Application.prototype, 'slot', {value:function slot(){
    return [];
}});

Object.defineProperty( Application.prototype, 'element', {get:function element(){
    return getVueApp(this).$el;
}});

Object.defineProperty( Application.prototype, 'parent', {get:function parent(){
    return getVueApp(this).$parent;
}});

Object.defineProperty( Application.prototype, 'children', {get:function children(){
    return getVueApp(this).$children;
}});

Object.defineProperty( Application.prototype, 'getParentComponent', {value:function getParentComponent(){
    return null;
}});

Object.defineProperty( Application.prototype, 'createVNode', {value:function createVNode(name,config,children){
    return getVueApp(this).$createElement(name, config, children);
}});

Object.defineProperty( Application.prototype, 'getRefs', {value:function getRefs(name){
    return getVueApp(this).$refs[name];
}});

Object.defineProperty( Application.prototype, 'on', {value:function on(type, listener){
    return getVueApp(this).$on(type,listener);
}});

Object.defineProperty( Application.prototype, 'off', {value:function off(type, listener){
    return getVueApp(this).$off( type, listener);
}});

Object.defineProperty( Application.prototype, 'emit', {value:function emit(type){
    var args = Array.from(arguments);
    return getVueApp(this).$emit.apply(this, args);
}});

Object.defineProperty( Application.prototype, 'watch', {value:function watch(name, callback, options){
    return Component.prototype.watch.call(getVueApp(this),name, callback, options)
}});

Object.defineProperty( Application.prototype, 'nextTick', {value:function nextTick(callback){
    return getVueApp(this).$nextTick(callback);
}});

Object.defineProperty( Application.prototype, 'getAttribute', {value:function getAttribute(name){
    const vueApp = this[privateKey]._vueApp
    if(name=='vueApp'||name==='instance'){
        return this[privateKey]._vueApp;
    }
    return vueApp['$'+name] || null;
}});

function getVueApp(target){
    const app = target[privateKey]._vueApp;
    if(!app){
        throw new Error('[es-vue] Vue app unavailable.')
    }
    return app;
}
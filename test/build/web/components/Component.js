/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
import Event from "./../../core/Event.js";
import Class from "./../../core/Class.js";
import EventDispatcher from "./../../core/EventDispatcher.js";
import ComponentEvent from "./../events/ComponentEvent.js";
import Vue from "vue";
var classKey = Class.key;
var key = Symbol('private');
var mixins = [{
    render(){
        return this.render.apply(this, Array.prototype.slice.call(arguments));
    },
    beforeCreate(){
        if( this.hasEventListener('onBeforeCreate') ){
            this.dispatchEvent( new ComponentEvent('onBeforeCreate') );
        }
        var props = this[key].config.props;
        var propsData = this.onReceiveProps( props );
        if( propsData ){
            for(var name in propsData ){
                if( Object.hasOwnProperty.call(this, name) ){
                    this[name] = propsData[name];
                }
            }
        }
    },
    created(){
        this[key].initialized=true;
        this.onInitialized();
    },
    beforeMount(){
        if( this.hasEventListener(ComponentEvent.BEFORE_MOUNT) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.BEFORE_MOUNT ) );
        }
        this.onBeforeMount();
    },
    mounted(){
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
    updated(){
        if( this.hasEventListener(ComponentEvent.UPDATED) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.UPDATED ) );
        }
        this.onUpdated();
    },
    beforeDestroy(){
        if( this.hasEventListener(ComponentEvent.BEFORE_DESTROY) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.BEFORE_DESTROY ) );
        }
        this.onBeforeUnmount();
    },
    destroyed(){
        if( this.hasEventListener(ComponentEvent.DESTROYED) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.DESTROYED ) );
        }
        this.onUnmounted();
    },
    errorCaptured(){
        if( this.hasEventListener(ComponentEvent.ERROR_CAPTURED) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.ERROR_CAPTURED ) );
        }
        this.onErrorCaptured();
    },
    activated(){
        if( this.hasEventListener(ComponentEvent.ACTIVATED) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.ACTIVATED ) );
        }
        this.onActivated();
    },
    deactivated(){
        if( this.hasEventListener(ComponentEvent.DEACTIVATED) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.DEACTIVATED ) );
        }
        this.onDeactivated();
    }
}];

function Component(options){
    Component.options = Vue.options;
    Vue.call(this,options);
}

Component.prototype = Object.create(Vue.prototype);
Component.prototype.constructor = Component;
Component.options = Vue.options;
var proto = Component.prototype;

Object.defineProperty( proto, '_init', {value:function _init(options){
    var context = options && options._parentVnode || {};
    var componentOptions = context.componentOptions || {};
    this[key] = Object.create(null);
    this[key].event=new EventDispatcher();
    this[key].initialized=false;
    this[key].context = context;
    this[key].provideQueues = [];
    this[key].options = componentOptions;
    this[key].config = context.data || {};
    this[key].states = Object.create(null);
    Vue.prototype._init.call(this,options);
}});

Object.defineProperty( proto, 'render', {value: function render(){return null}});

Object.defineProperty( proto, 'getConfig', {value:function getConfig(){
    return this[key].config;
}});

Object.defineProperty( proto, 'isWebComponent', {value:true});

Object.defineProperty( proto, 'onReceiveProps', {value: function onReceiveProps(props){
    return props;
}});

Object.defineProperty( proto, 'onInitialized', {value:function onInitialized(){}});

Object.defineProperty( proto, 'onBeforeMount', {value:function onBeforeMount(){}});

Object.defineProperty( proto, 'onMounted', {value:function onMounted(){}});

Object.defineProperty( proto, 'onBeforeUpdate', {value:function onBeforeUpdate(){}});

Object.defineProperty( proto, 'onUpdated', {value:function onUpdated(){}});

Object.defineProperty( proto, 'onBeforeUnmount', {value:function onBeforeUnmount(){}});

Object.defineProperty( proto, 'onUnmounted', {value:function onUnmounted(){}});

Object.defineProperty( proto, 'onErrorCaptured', {value:function onErrorCaptured(e){}});

Object.defineProperty( proto, 'onActivated', {value:function onActivated(){}});

Object.defineProperty( proto, 'onDeactivated', {value:function onDeactivated(){}});

Object.defineProperty( proto, 'addProvider', {value:function addProvider( provider ){
    var type = typeof provider;
    if( type === "function"){
        this[key].provideQueues.push( (function(context){ 
            if( context.called ){
                return context.result;
            }
            context.called = true;
            context.result = provider.call(this);
            if( typeof context.result !== 'object' ){
                throw new Error('Provider must return be an object');
            }
            return context.result;
        }).bind(this,{}) );
    }else if( type ==='object' ){
        this[key].provideQueues.push( (function(context){ 
           return provider;
        }).bind(this,{}) );
    }else{
        throw new Error('Provider must is function or object');
    }
}});

Object.defineProperty( proto, 'injectProperty', {value:function injectProperty(name, from, defaultValue){
    var source = this;
    while (source) {
        var provideQueues = source[key].provideQueues;
        var len = provideQueues.length;
        if( provideQueues && len > 0 ) {
            for(var i = 0; i<len; i++){
                var provide = provideQueues[ i ];
                var result = provide();
                if( Object.hasOwnProperty.call(result, from) ){
                    var value = result[ from ];
                    this.reactive(name, value === void 0 ? defaultValue : value);
                    break;
                }
            }  
            break;
        }
        source = source.parent;
    }
}});

Object.defineProperty( proto, 'reactive', {value:function reactive(name, value, initValue){
    var states = this[key].states;
    var init = false;
    if( !Object.hasOwnProperty.call(states, name) ){
        init = true;
        if( value === void 0 && initValue ){
            initValue = typeof initValue === "function" ? initValue() : initValue;
            Vue.util.defineReactive(states, name, initValue );
        }else{
            Vue.util.defineReactive(states, name, value );
        }
    }
    if( value === void 0 ){
        return states[name];
    }else {
        if( !init ){
            states[name] = value;
        }
        return value;
    }
}});

Object.defineProperty( proto, 'forceUpdate', {value:function forceUpdate(){
    this.$forceUpdate();
}});

Object.defineProperty( proto, 'mount', {value:function mount(element){
    return this.$mount( element );
}});

Object.defineProperty( proto, 'observable', {value:function observable(object){
    return Vue.observable( object );
}});

Object.defineProperty( proto, 'slot', {value:function slot(name,scoped,called,args){
    name = name || 'default';
    if( scoped ){
        var value = this.$scopedSlots[name];
        if( called ){
            return value && typeof value === "function" ? value(args) : null;
        }
        return value;
    }
    return this.$slots[name];
}});

Object.defineProperty( proto, 'parent', {get:function parent(){
    return this.$parent;
}});

Object.defineProperty( proto, 'children', {get:function children(){
    return this.$children;
}});

Object.defineProperty( proto, 'createElement', {value:function createElement(name,config,children){
    return this.$createElement(name, config, children);
}});

Object.defineProperty( proto, 'getElementByRefName', {value:function getElementByRefName(name){
    return this.$refs[name];
}});

Object.defineProperty( proto, 'addEventListener', {value:function addEventListener(type, listener,useCapture,priority,reference){
    return this[key].event.addEventListener(type,listener,useCapture,priority,reference);
}});

Object.defineProperty( proto, 'dispatchEvent', {value:function dispatchEvent(event){
    return this[key].event.dispatchEvent(event);
}});

Object.defineProperty( proto, 'removeEventListener', {value:function removeEventListener(type, listener){
    return this[key].event.removeEventListener(type, listener);
}});

Object.defineProperty( proto, 'hasEventListener', {value:function hasEventListener(type, listener){
    return this[key].event.hasEventListener(type, listener);
}});

Object.defineProperty( proto, 'on', {value:function on(type, listener){
    return this.$on(type,listener);
}});

Object.defineProperty( proto, 'off', {value:function off(type, listener){
    return this.$off( type, listener);
}});

Object.defineProperty( proto, 'emit', {value:function emit(type, args){
    return this.$emit(type, args);
}});

Object.defineProperty( proto, 'watch', {value:function watch(name, callback){
    return this.$watch(name, callback);
}});

Object.defineProperty( proto, 'nextTick', {value:function nextTick(callback){
    return this.$nextTick(callback);
}});

Object.defineProperty( proto, 'destroy', {value:function destroy(){
    return this.$destroy();
}});

Object.defineProperty( Component, 'createComponent', {value:function createComponent(options){
    options = options || {};
    options.mixins = mixins;
    var subClass = Vue.extend( options );
    return subClass;
}});
Class.creator(3,Component,{
	'id':1,
	'global':true,
	'dynamic':false,
	'name':'Component'
}, false);
export default Component;
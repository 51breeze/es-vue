/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
///<import from='vue' name='Vue' />
///<references from='Class' />
///<references from='EventDispatcher' />
///<references from='web.events.ComponentEvent' name='ComponentEvent' />
///<namespaces name='web.components' />
///__REFS__
var classKey = Class.key;
var key = Symbol('private');
var mixins = [{
    render(){
        return this.render.apply(this, Array.prototype.slice.call(arguments));
    },
    created(){
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
    var context = options && options._parentVnode && options._parentVnode.componentOptions && options._parentVnode || {};
    var componentOptions = context.componentOptions || {};
    this[key] = Object.create(null);
    this[key].event=new EventDispatcher();
    this[key].initialized=false;
    this[key].options = componentOptions;
    this[key].config = context.data || {};
    this[key].states = {};
    var classModule = this.constructor;
    var description = classModule[classKey];
    var props = {};
    if( description ){
        var members = description.members || {};
        var data = context.data || {};
        for(var name in members ){
            var member = members[name];
            if( Class.CONSTANT.PROPERTY_ACCESSOR === member.d ){
                if( data.props && Object.hasOwnProperty.call(data.props,name) ){
                    props[ name ] = data.props[ name ]
                }else if( data.attrs && Object.hasOwnProperty.call(data.attrs,name) ){
                    props[ name ] = data.attrs[ name ]
                }
            }
        }
    }

    var propsData = this.onReceiveProps( props );
    if( propsData ){
        for(var name in propsData ){
            if( Object.hasOwnProperty.call(this, name) ){
                this[name] = propsData[name];
            }
        }
    }
    
    Vue.prototype._init.call(this,options);
    this[key].initialized=true;
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

Object.defineProperty( proto, 'onShouldUpdate', {value: function onShouldUpdate(newValue,oldValue){
    return newValue !== oldValue;
}});

Object.defineProperty( proto, 'onBeforeUpdate', {value:function onBeforeUpdate(){}});

Object.defineProperty( proto, 'onUpdated', {value:function onUpdated(){}});

Object.defineProperty( proto, 'onBeforeUnmount', {value:function onBeforeUnmount(){}});

Object.defineProperty( proto, 'onUnmounted', {value:function onUnmounted(){}});

Object.defineProperty( proto, 'onErrorCaptured', {value:function onErrorCaptured(e){}});

Object.defineProperty( proto, 'onActivated', {value:function onActivated(){}});

Object.defineProperty( proto, 'onDeactivated', {value:function onDeactivated(){}});

Object.defineProperty( proto, 'reactive', {value:function reactive(name, value){
    var states = this[key].states;
    if( value === void 0 ){
        return Object.hasOwnProperty.call(states, name) ? states[name] : void 0;
    }else {
        var old = states[name];
        if( this[key].initialized ){
            if( this.onShouldUpdate(old,value) ){
                states[name] = value;
                this.$forceUpdate();
            }
        }else{
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

Object.defineProperty( proto, 'children', {get:function parent(){
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
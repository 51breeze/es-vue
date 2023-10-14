/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
///<import from='vue' name='Vue' />
///<references from='Class' />
///<references from='System' />
///<references from='Reflect' />
///<references from='EventDispatcher' />
///<references from='web.events.ComponentEvent' name='ComponentEvent' />
///<namespaces name='web.components' />
var key = Symbol('private');
var hasOwn = Object.prototype.hasOwnProperty;
var emptyObject = Object.create(null);

function copyObject(target, deep){
    if( target && typeof target ==='object' ){
        if( Object.prototype.toString.call(target) === '[object Object]' ){
            var keys = Object.keys( target );
            var obj = {};
            for(var i=0;i<keys.length;i++){
                var name = keys[i];
                obj[ name ] = deep===true ? copyObject( target[ name ] ) : target[ name ];
            }
            return obj;
        }else if( Array.isArray(target) ){
            var items = [];
            for(var i=0; i<target.length;i++){
                items.push( deep===true ? copyObject(target[i]) : target[i] );
            }
            return items;
        }
    }
    return target;
}

function defineProps(vm, obj, prop, name, propsData){
    const cache = vm[key];
    let value = null;
    if( propsData && hasOwn.call(propsData,name) && vm.beforeReceiveProp(propsData[name],name) ){
        value =vm.receivePropValue(propsData[name],name);
        const descriptor = Reflect.getDescriptor(vm, name);
        if( descriptor && descriptor.isMember){
            if(descriptor.type === Reflect.MEMBERS_ACCESSOR && descriptor.modifier === Reflect.MODIFIER_PUBLIC){
                const setter = descriptor.set;
                if( setter ){
                    cache.propsUpdating = true;
                    setter.call(vm, value);
                    cache.propsUpdating = false;
                }
            }
        }
    }else if(prop.default !== void 0){
        value = prop.default;
        if( value && typeof value ==='function' && prop.type !== Function ){
            value = value.call(vm);
        }
    }

    if( !hasOwn.call(cache.states, name) ){
        cache.statePrevious[name]=value;
        Vue.util.defineReactive(cache.states, name, value);
    }

    Object.defineProperty(obj, name, {
        enumerable: true,
        configurable: true,
        get:function(){
            return value;
        },
        set:function(newValue){
            if( vm.beforeReceiveProp(newValue,name) ){
                cache.propsUpdating = true;
                vm[name] = value = vm.receivePropValue(newValue,name);
                cache.propsUpdating = false;
            }
        }
    });
}

var mixins = [{
    render(){
        return this.render.apply(this, Array.prototype.slice.call(arguments));
    },
    beforeCreate(){
        this[key].props = this.$options.props;
        this.$options.props = null;
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

function Component(){}
Component.prototype = Object.create(Vue.prototype);
Component.prototype.constructor = Component;
Component.options = Vue.options;

var proto = Component.prototype;
function initPrivate(target){
    if( !hasOwn.call(target,key) ){
        target[key] = Object.create(null);
        target[key].event=new EventDispatcher();
        target[key].initialized=false;
        target[key].states=Object.create(null);
        target[key].statePrevious = Object.create(null);
        target[key].preventedProps = Object.create(null);
    }
    return target[key];
}

Object.defineProperty( proto, '_init', {value:function _init(options, propsData){
    var target = initPrivate(this);
    if( !target.initialized ){
        Vue.prototype._init.call(this,options);
        var _propsData = arguments.lenght > 1 && typeof propsData ==="object" ? propsData :  null;
        var context = options && options._parentVnode || {};
        var keys = this.$options._propKeys = [];
        var props = this[key].props;
        target.propsUpdating = false;
        target.context = options;
        target.options = context.componentOptions || {};
        target.config = context.data || {};

        const {hasTemplate, esHandle, esPrivateKey} = this.$options;
        if( hasTemplate ){
            this[esHandle||'esInstance'] = this;
            if( esPrivateKey ){
                const descriptor = Reflect.getDescriptor(this);
                this[esPrivateKey] = descriptor.privateKey;
            }
        }

        this._props = {};
        if( props ){
            if( _propsData ){
                propsData = this.$options.propsData = _propsData;
            }else{
                propsData = this.$options.propsData || {};
            }
            this.$options.props = props;
            for(var name in props){
                keys.push(name);
                defineProps(this, this._props, props[name], name, propsData);
            }
        }
        var _provided = emptyObject;
        if( this.$parent ){
            if( this.$parent[key] ){
                _provided = this.$parent[key].provides
            }else{
                _provided = this.$parent._provided
            }
        }
        target.provides = _provided;
    }
}});

Object.defineProperty( proto, '_initialized', {value: function _initialized(){
    const target = this[key];
    if( !target.initialized ){
        target.initialized=true;
        if( this.hasEventListener('componentInitialized') ){
            this.dispatchEvent( new ComponentEvent( 'componentInitialized' ) );
        }
    }
    this.onInitialized();
}});

Object.defineProperty( proto, 'render', {value: function render(){return null}});

Object.defineProperty( proto, 'getConfig', {value:function getConfig(){
    return this[key].config;
}});

Object.defineProperty( proto, 'isWebComponent', {value:true});

Object.defineProperty( proto, 'getInitProps', {value: function getInitProps(options){
    var context = (options ? options._parentVnode : null) || {};
    var options = context.componentOptions || {};
    return Object.assign( Object.create(null), options.propsData || {});
}});

Object.defineProperty( proto, 'receivePropValue', {value: function receivePropValue(value,name){
    return value;
}});

Object.defineProperty( proto, 'toValue', {value: function toValue(value){
    return value;
}});

Object.defineProperty( proto, 'beforeReceiveProp', {value: function beforeReceiveProp(value,name){
    return this[key].preventedProps[name] !== true;
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

Object.defineProperty( proto, 'provide', {value:function provide(name, provider){
    if( typeof provider !=='function' ){
        throw new Error(`Provider '${name}' must is function. give `+(typeof provider));
    }else{
        var _provided = null;
        if( this.$parent ){
            if( this.$parent[key] ){
                _provided = this.$parent[key].provides;
            }else{
                _provided = this.$parent._provided;
            }
        }
        if( this[key].provides === _provided ){
            this[key].provides = Object.create( this[key].provides );
        }else if( this[key].provides === emptyObject ){
            this[key].provides = Object.create(null);
        }
        this[key].provides[name] = provider;
    }
}});

Object.defineProperty( proto, 'inject', {value:function inject(name, from, defaultValue){
    const descriptor =Reflect.getDescriptor(this, name);
    if( !descriptor ){
        throw new Error(`Injector property '${name}' is not exists.`);
    }
    const provides = this[key].provides || emtyObject;
    let value = void 0;
    from = from || name;
    if( from in provides ){
        value = provides[from];
        if( typeof value ==='function' ){
            value = value.call(this);
        }
    }else {
        const _res = System.getProvide(from, 'global:vue:application');
        if( _res !== null ){
            value = _res;
            if( typeof value ==='function' ){
                value = value.call(this);
            }
        }else if( defaultValue !== void 0 ){
            value = defaultValue;
        }
    }
    if( value !== void 0 ){
        value = this.receivePropValue(value, name);
        if(descriptor.type === Reflect.MEMBERS_ACCESSOR){
            if( descriptor.set ){
                descriptor.set.call(this,value);
            }else{
                throw new Error(`Injector property '${name}' is readonly.`);
            }
        }else if(descriptor.type === Reflect.MEMBERS_METHODS){
            descriptor.method.call(this, value);
        }else if( descriptor.type === Reflect.MEMBERS_PROPERTY ){
            let target = this;
            if( descriptor.modifier === Reflect.MODIFIER_PRIVATE ){
                target = descriptor.dataset;
            }
            if( target ){
                target[name] = value;
            }
        }
    }
    return value;
}});

Object.defineProperty( proto, 'reactive', {value:function reactive(name, value, initValue){
    var isWrite = arguments.length === 2;
    var cache = this[key];
    var states = cache.states;
    var props = cache.props;
    var _propsData = this.$options && this.$options.propsData;
    var propsData = _propsData ? _propsData : cache.options.propsData;
    var isProp = props && hasOwn.call(props,name);
    var isPropData = isProp && propsData && hasOwn.call(propsData,name);
    if( !hasOwn.call(states, name) ){
        initValue = arguments.length === 3 ? initValue : value;
        if( typeof initValue === "function" ){
            initValue = initValue();
        }
        Vue.util.defineReactive(states, name, value=initValue);
        cache.statePrevious[name] = value;
    }
    if( !isWrite ){
        if( cache.propsUpdating ){
            return cache.statePrevious[name];
        }
        return states[name];
    }else{
        if(!cache.propsUpdating){
            cache.preventedProps[name] = true;
        }
        if( isPropData ){
            propsData[name] = value;
        }
        cache.statePrevious[name] = value;
        states[name] = value;
        return value;
    }
}});

Object.defineProperty( proto, 'reference', {value:function reference(value, shallowFlag=true){
    return shallowFlag ? Vue.shallowRef(value) : Vue.ref(value)
}});

Object.defineProperty( proto, 'forceUpdate', {value:function forceUpdate(){
    this.$forceUpdate();
}});

Object.defineProperty( proto, 'observable', {value:function observable(object){
    return Vue.observable( object );
}});

function makeChildren(name, children, context){
    children = Array.isArray(children) ? children : [children];
    return children.map( child=>{
        if( typeof child ==="object" ){
            return child;
        }
        return context.createVNode('span', {slot:name}, [child]);
    })
}

Object.defineProperty( proto, 'slot', {value:function slot(name,scoped,args,fallback){
    if( scoped === true ){
        if( args && typeof args ==='function' ){
            fallback = args
        }
        var value = this.$scopedSlots[name] || fallback;
        var isFun = value && typeof value === "function";
        var isArr = Array.isArray(args);
        if( args===true || isArr){
            if( isFun ){
                return makeChildren(name, value.apply(null, isArr ? args : [] ), this );
            }
        }
        return value;
    }else if( scoped && typeof scoped ==="function" ){
        fallback = scoped;
    }
    var result = this.$slots[name];
    if( result ){
        return makeChildren(name, result, this);
    }else if( fallback ){
        return makeChildren(name, fallback(), this);
    }
    return [];
}});

Object.defineProperty( proto, 'element', {get:function element(){
    return this.$el;
}});

Object.defineProperty( proto, 'parent', {get:function parent(){
    return this.$parent;
}});

Object.defineProperty( proto, 'children', {get:function children(){
    return this.$children;
}});

Object.defineProperty( proto, 'getParentComponent', {value:function getParentComponent( filter ){
    var parent = this.$parent;
    var isFn = typeof filter === 'function';
    while( parent ){
        if( isFn ){
            if( filter( parent ) ){
                return parent;
            }
        }else if( filter === true ){
            if(parent instanceof Component){
                return parent;
            }
        }else{
            return parent;
        }
        parent = parent.$parent;
    }
    return null;
}});

Object.defineProperty( proto, 'createVNode', {value:function createVNode(name,config,children){
    return this.$createElement(name, config, children);
}});

Object.defineProperty( proto, 'getRefs', {value:function getRefs(name){
    return this.$refs[name];
}});

Object.defineProperty( proto, 'addEventListener', {value:function addEventListener(type, listener,useCapture,priority,reference){
    initPrivate(this);
    return this[key].event.addEventListener(type,listener,useCapture,priority,reference);
}});

Object.defineProperty( proto, 'dispatchEvent', {value:function dispatchEvent(event){
    initPrivate(this);
    return this[key].event.dispatchEvent(event);
}});

Object.defineProperty( proto, 'removeEventListener', {value:function removeEventListener(type, listener){
    initPrivate(this);
    return this[key].event.removeEventListener(type, listener);
}});

Object.defineProperty( proto, 'hasEventListener', {value:function hasEventListener(type, listener){
    initPrivate(this);
    return this[key].event.hasEventListener(type, listener);
}});

Object.defineProperty( proto, 'on', {value:function on(type, listener){
    return this.$on(type,listener);
}});

Object.defineProperty( proto, 'off', {value:function off(type, listener){
    return this.$off( type, listener);
}});

Object.defineProperty( proto, 'emit', {value:function emit(type){
    var args = Array.from(arguments);
    return this.$emit.apply(this, args);
}});

Object.defineProperty( proto, 'watch', {value:function watch(name, callback, options){
    var segs = String(name).split('.');
    var first = segs[0].trim();
    var descriptor = Reflect.getDescriptor(this,first);
    options = options === true ? {deep:true} : options;
    if( descriptor && descriptor.isMember ){
        if( descriptor.modifier === Reflect.MODIFIER_PRIVATE ){
            const _privateKey = descriptor.privateKey;
            name = ()=>{
                var obj = this[_privateKey];
                for (var i = 0; i < segs.length; i++) {
                    if (!obj) { return }
                    obj = obj[ segs[i] ];
                }
                return obj;
            };
        }
        const isProperty = (descriptor.type ===Reflect.MEMBERS_ACCESSOR && descriptor.get) || (descriptor.type === Reflect.MEMBERS_PROPERTY);
        if( !isProperty ){
            throw new Error(`Watching '${name}' is not properties.`);
        }
        return this.$watch(name, callback, options);
    }else{
        throw new Error(`Watching property '${name}' is not exists.`);
    }
}});

Object.defineProperty( proto, 'nextTick', {value:function nextTick(callback){
    return this.$nextTick(callback);
}});

Object.defineProperty( proto, 'getAttribute', {value:function getAttribute(name){
    return this['$'+name] || this[name];
}});

Object.defineProperty( proto, 'invokeHook', {value:function invokeHook(...args){
    if(args[0] ==='component:beforeRender'){
        if( !this[privateKey].componentBeforeRenderHookFlag ){
            this[privateKey].componentBeforeRenderHookFlag = true;
            const items = args.slice(1);
            const hook = (e)=>{
                items.forEach( fn=>{
                    if(typeof fn ==='function'){
                        fn.call(this, e)
                    }
                });
            }
            this.addEventListener('componentInitialized',hook);
            this.addEventListener(ComponentEvent.BEFORE_UPDATE, hook);
        }
        return true;
    }else if(args[0] ==='System::callMethod'){
        const method = System[String(args[1])];
        if( method && typeof method ==='function' ){
            return method.apply(System, args.slice(2));
        }
    }
    return System.invokeHook(...args);
}});

Object.defineProperty( Component, 'getAttribute', {value:function getAttribute(target,name){
    if( target instanceof Vue){
        return target['$'+name] || target[name];
    }
    return null;
}});

const directiveClassMaps={};
Object.defineProperty( Component, 'resolveDirective', {value:function resolveDirective(config,context){
    if( !config )return function(){};
    var name = config.name;
    var dire = name;
    var directive = {
        name:'',
        value:config.value
    };
    if( config.modifier ){
        directive.modifiers = config.modifier;
    }
    if( config.arg ){
        directive.arg = config.arg;
    }
    if( config.directiveClass ){
        if( System.isClass( config.directiveClass ) ){
            directive.rawName = name;
            directive.name = name;
            if( hasOwn.call(directiveClassMaps, name) ){
                dire = directiveClassMaps[name];
            }else{
                const result = Reflect.getDescriptor(config.directiveClass, 'directive')
                if( result && result.isStatic && result.label === 'accessor' && result.get ){
                    dire = result.get.call(this);
                }else{
                    dire = new config.directiveClass( context );
                }
                directiveClassMaps[name] = dire;
            }
        }else{
            const result = config.directiveClass.directive;
            if( result  ){
                dire = result;
            }else{
                dire = config.directiveClass;
            }
        }
        directive.def = dire;
    }else if( typeof name === "string" ){
        directive.name = name;
    }else{
        directive.def = name;
    }
    return directive;
}});

Object.defineProperty( Component, 'createComponent', {value:function createComponent(options){
    options = options || {};
    if( Array.isArray(options.mixins) ){
        options.mixins.push( ...mixins );
    }else{
        options.mixins = mixins;
    }
    return Vue.extend( options );
}});

System.registerHook('polyfills:value',function(value, property, className){
    if( property ==="size" ){
        if(value ==="large")return ''
    }
    return value;
},-500);
/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
///<import from='vue' name='Vue' />
///<references from='Class' />
///<references from='EventDispatcher' />
///<references from='web.components.ComponentEvent' />
///<namespaces name='web.components' />
///__REFS__
var classKey = Class.key;
var key = Symbol('private');
var baseOptions = {};
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

function createProperties( classConstructor , superClass ){
    var proto = classConstructor.prototype;
    var invoke = function(context,name,args){
        if( superClass ){
            var callback = superClass[name];
            if( typeof callback === "function" ){
                if( args ){
                    return callback.apply( context, args );
                }else{
                    return callback.call( context ); 
                }
            }
        }
        return null;
    }
    Object.defineProperty( proto, '_init', {value:function _init(options){
        this[key] = Object.create(null);
        this[key].event=new EventDispatcher();
        this[key].initialized=false;
        this[key].options = options && options._parentVnode && options._parentVnode.componentOptions && options._parentVnode.componentOptions || {};
        var classModule = this.constructor;
        var opts = classModule && classModule.options;
        if( opts && opts.methods ){
            var description = classModule[classKey];
            if( description ){
                var members = description.members || {};
                for(var name in opts.methods ){
                    if(Object.hasOwnProperty.call(members, name)){
                        delete opts.methods[name];
                    }
                }
            }
        }
        var propsData = this.onReceiveProps( this[key].options.propsData );
        if( propsData ){
            for(var name in propsData ){
                if( this.hasOwnProperty( name ) ){
                    this[name] = propsData[name];
                }
            }
        }
        Vue.prototype._init.call(this,options);
        this[key].initialized=true;
    }});

    Object.defineProperty( proto, 'isWebComponent', {value:true});

    Object.defineProperty( proto, 'onReceiveProps', {value: function onReceiveProps(props){
        return props;
    }});

    Object.defineProperty( proto, 'onInitialized', {value:function onInitialized(){
        return invoke(this,'created');
    }});

    Object.defineProperty( proto, 'onBeforeMount', {value:function onBeforeMount(){
        return invoke(this,'beforeMount');
    }});

    Object.defineProperty( proto, 'onMounted', {value:function onMounted(){
        return invoke(this,'mounted');
    }});

    Object.defineProperty( proto, 'onShouldUpdate', {value: function onShouldUpdate(newValue,oldValue){
        return newValue !== oldValue;
    }});

    Object.defineProperty( proto, 'onBeforeUpdate', {value:function onBeforeUpdate(){
        return invoke(this,'beforeUpdate');
    }});

    Object.defineProperty( proto, 'onUpdated', {value:function onUpdated(){
        return invoke(this,'updated');
    }});

    Object.defineProperty( proto, 'onBeforeUnmount', {value:function onBeforeUnmount(){
        return invoke(this,'beforeDestroy');
    }});

    Object.defineProperty( proto, 'onUnmounted', {value:function onUnmounted(){
        return invoke(this,'destroyed');
    }});

    Object.defineProperty( proto, 'onErrorCaptured', {value:function onErrorCaptured(e){
        return invoke(this,'destroyed',[e]);
    }});

    Object.defineProperty( proto, 'onActivated', {value:function onActivated(){
        return invoke(this,'activated');
    }});

    Object.defineProperty( proto, 'onDeactivated', {value:function onDeactivated(){
        return invoke(this,'deactivated');
    }});

    Object.defineProperty( proto, 'render', {value: function render(){
        return invoke(this,'render', Array.prototype.slice.call(arguments) );
    }});

    Object.defineProperty( proto, 'data', {value:function data(name, value){
        var data = this._data;
        if( name ){
            if( value === void 0 ){
                return data[name];
            }else{
                var old = data[name];
                if( this[key].initialized ){
                    if( this.onShouldUpdate(old,value) ){
                        data[name] = value;
                        this.$forceUpdate();
                    }
                }else{
                    data[name] = value;
                }
                return value;
            }
        }else{
            return Object.assign({}, data);
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

    return classConstructor;
}

createProperties(Component);

Object.defineProperty( Component, 'createComponent', {value:function createComponent(options, inheritComponent){
    options = options || {};
    options.mixins = mixins;
    if( inheritComponent ){
        var superClass = inheritComponent;
        var isFun = typeof superClass === 'function';
        if( isFun && superClass.prototype.isWebComponent===true ){
            return superClass; 
        }
        options.extends = superClass;
        var inheritClass = Vue.extend(options);
        createProperties(inheritClass, isFun ? superClass.options : superClass );
        if( inheritClass.options.methods ){
            Object.assign( inheritClass.prototype, inheritClass.options.methods )
        }
        return inheritClass;
    }
    var subClass = Vue.extend( options );
    return subClass;
}});
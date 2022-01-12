import Event from "./../../core/Event.js";
import Vue from "vue";
import Class from "./../../core/Class.js";
import EventDispatcher from "./../../core/EventDispatcher.js";
import ComponentEvent from "./ComponentEvent.js";

/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */






var classKey = Class.key;
var key = Symbol('private');
var baseOptions = {};
var mixins = [{
    render(){
        return this.render.apply(this, Array.prototype.slice.call(arguments));
    },
    beforeCreate(){
        this.beforeCreate();
    },
    beforeMount(){
        if( this.hasEventListener(ComponentEvent.BEFORE_MOUNT) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.BEFORE_MOUNT ) );
        }
        this.beforeMount();
    },
    beforeUpdate(){
        if( this.hasEventListener(ComponentEvent.BEFORE_UPDATE) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.BEFORE_UPDATE ) );
        }
        this.beforeUpdate();
    },
    beforeDestroy(){
        if( this.hasEventListener(ComponentEvent.BEFORE_DESTROY) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.BEFORE_DESTROY ) );
        }
        this.beforeDestroy();
    },
    errorCaptured(){
        if( this.hasEventListener(ComponentEvent.ERROR_CAPTURED) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.ERROR_CAPTURED ) );
        }
        this.errorCaptured();
    },
    created(){
        if( this.hasEventListener(ComponentEvent.CREATED) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.CREATED ) );
        }
        this.created();
    },
    mounted(){
        if( this.hasEventListener(ComponentEvent.MOUNTED) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.MOUNTED ) );
        }
        this.mounted();
    },
    updated(){
        if( this.hasEventListener(ComponentEvent.UPDATED) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.UPDATED ) );
        }
        this.updated();
    },
    destroyed(){
        if( this.hasEventListener(ComponentEvent.DESTROYED) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.DESTROYED ) );
        }
        this.destroyed();
    },
    activated(){
        if( this.hasEventListener(ComponentEvent.ACTIVATED) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.ACTIVATED ) );
        }
        this.activated();
    },
    deactivated(){
        if( this.hasEventListener(ComponentEvent.DEACTIVATED) ){
            this.dispatchEvent( new ComponentEvent( ComponentEvent.DEACTIVATED ) );
        }
        this.activated();
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
        var opts = this.constructor.options;
        if( opts.__excludes && opts.__excludes.length > 0 && opts.methods ){
            var excludes = opts.__excludes;
            for(var i=0;i<excludes.length;i++){
                var name = excludes[i];
                if(Object.hasOwnProperty.call(opts.methods, name)){
                    delete opts.methods[name];
                }
            }
        }
        var propsData = this[key].options.propsData;
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

    Object.defineProperty( proto, 'getDataProps', {value:function getDataProps(){
        return Object.assign({},this[key].options.propsData);
    }});

    Object.defineProperty( proto, 'isComponent', {value:true});

    Object.defineProperty( proto, 'beforeCreate', {value:function beforeCreate(){
        return invoke(this,'beforeCreate');
    }});

    Object.defineProperty( proto, 'created', {value:function created(){
        return invoke(this,'created');
    }});

    Object.defineProperty( proto, 'beforeMount', {value:function beforeMount(){
        return invoke(this,'beforeMount');
    }});

    Object.defineProperty( proto, 'mounted', {value:function mounted(){
        return invoke(this,'mounted');
    }});

    Object.defineProperty( proto, 'beforeUpdate', {value:function beforeUpdate(){
        return invoke(this,'beforeUpdate');
    }});

    Object.defineProperty( proto, 'updated', {value:function updated(){
        return invoke(this,'updated');
    }});

    Object.defineProperty( proto, 'beforeDestroy', {value:function beforeDestroy(){
        return invoke(this,'beforeDestroy');
    }});

    Object.defineProperty( proto, 'activated', {value:function activated(){
        return invoke(this,'activated');
    }});

    Object.defineProperty( proto, 'destroyed', {value:function destroyed(){
        return invoke(this,'destroyed');
    }});

    Object.defineProperty( proto, 'errorCaptured', {value:function errorCaptured(e){
        return invoke(this,'destroyed',[e]);
    }});

    Object.defineProperty( proto, 'deactivated', {value:function deactivated(){
        return invoke(this,'deactivated');
    }});

    Object.defineProperty( proto, 'render', {value: function render(a){
        return invoke(this,'render',[a||this.$createElement]);
    }});

    Object.defineProperty( proto, 'data', {value:function data(name, value){
        var data = this._data;
        var props = this._props;
        if( name ){
            if( value === void 0 ){
                return data[name] || props[name];
            }else{
                var old = data[name];
                if( old !== value ){
                    data[name] = value;
                    if( this[key].initialized ){
                        this.$forceUpdate();
                    }
                }
                return value;
            }
        }else{
            return Object.assign({}, data);
        }
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

    Object.defineProperty( proto, 'config', {get:function config(){
        return this.$vnode && this.$vnode.data ? this.$vnode.data : {};
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

    return classConstructor;
}

createProperties(Component);

Object.defineProperty( Component, 'createComponent', {value:function createComponent(options, inheritComponent){
    options = options || {};
    options.mixins = mixins;
    if( inheritComponent ){
        var superClass = inheritComponent;
        if( typeof superClass === 'function' && superClass.prototype.isComponent===true ){
            return superClass; 
        }
        superClass = Vue.extend(inheritComponent);
        options.extends = superClass;
        var inheritClass = Vue.extend(options);
        createProperties(inheritClass, superClass.options);
        if( inheritClass.options.methods ){
            Object.assign( inheritClass.prototype, inheritClass.options.methods )
        }
        return inheritClass;
    }
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
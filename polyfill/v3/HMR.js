/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
///<references from='System' />
///<namespaces name='dev.tools' />
///<createClass value='false' />
const errorHook = ()=>{
    console.warn('[HMR] __VUE_HMR_RUNTIME__ is not defined.');
}
const Api = typeof __VUE_HMR_RUNTIME__ !== 'undefined' ?  __VUE_HMR_RUNTIME__ : {
    createRecord:errorHook,
    rerender:errorHook,
    reload:errorHook
};
const map = Object.create(null);
const HMR={
    createRecord(id, vueComponent){
        return Api.createRecord(id, vueComponent);
    },
    rerender(id, vueComponent){
        let render = typeof vueComponent ==='function' ? vueComponent.prototype.render : vueComponent.render;
        if(render){
            Api.rerender(id, render);
        }else{
            Api.reload(id, vueComponent);
        }
    },
    reload(id, vueComponent){
        Api.reload(id, vueComponent);
    }
}
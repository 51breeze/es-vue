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
    console.warn('[HMR] vue-hmr-runitme is not defined.');
}
const Api = typeof __VUE_HMR_RUNTIME__ !== 'undefined' ?  __VUE_HMR_RUNTIME__ : {
    createRecord:errorHook,
    rerender:errorHook,
    reload:errorHook
};

const map = Object.create(null);
const HMR={
    hasRecord(){
        return !!map[id];
    },
    createRecord(id, vueComponent){
        if( map[id] )return false;
        map[id] = true;
        (vueComponent.__vccOpts || vueComponent).__hmrId = id;
        Api.createRecord(id, vueComponent);
        return true;
    },
    rerender(id, vueComponent){
        System.setImmediate(()=>{
            Api.rerender(id, vueComponent);
        })
    },
    reload(id, vueComponent){
        System.setImmediate(()=>{
            Api.reload(id, vueComponent);
        })
    }
}
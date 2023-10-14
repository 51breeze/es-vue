/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
///<import from='vue' name='Vue' />
///<import from='vue-hot-reload-api' name='Api' />
///<namespaces name='dev.tools' />
///<createClass value='false' />

// make the API aware of the Vue that you are using.
// also checks compatibility.
Api.install(Vue);

// compatibility can be checked via api.compatible after installation
if (!Api.compatible) {
    throw new Error('vue-hot-reload-api is not compatible with the version of Vue you are using.')
}
const map = Object.create(null);
const HMR={
    hasRecord(){
        return !!map[id];
    },
    createRecord(id, vueComponent){
        if( map[id] )return false;
        map[id] = true
        Api.createRecord(id, vueComponent);
        return true;
    },

    rerender(id, vueComponent){
        Api.rerender(id, vueComponent);
    },

    reload(id, vueComponent){
        Api.reload(id, vueComponent);
    }
}
/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
///<import from='vue' name='Vue' namespaced />
///<namespaces name='web.components' />
///<createClass value='false' />
const Comment = Vue.defineComponent({
    name:'es-Comment',
    props: {
        text:{
            type:String,
            required:true
        }
    },
    setup(props, context) {
        return () => {
            if(context.slots){
                if(Object.keys(context.slots).length>0){
                    throw new Error('Comment-component is cannot has children. please use the text props instead')
                }
            }
            return Vue.h(Vue.Comment,Vue.unref(props.text));
        };
    }
});
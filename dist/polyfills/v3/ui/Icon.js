///<import from='element-plus/lib/components/icon' name='ElIcon' />
///<import from='vue' name='Vue' namespaced />
///<import from='@element-plus/icons-vue' name='ElementPlusIconsVue' namespaced />
///<references from='System' />
///<namespaces name='web.ui' />
///<createClass value='false' />

System.registerOnceHook('application:created', (app)=>{
    app = app.getAttribute('vueApp');
    Object.keys(ElementPlusIconsVue).forEach( key=>{
        const com = ElementPlusIconsVue[key];
        app.component(com.name||key, com);
    });
});

const hasOwn = Object.prototype.hasOwnProperty;

function _resolveComponent(name){
    if( ElementPlusIconsVue ){
        if( hasOwn.call(ElementPlusIconsVue, name) ){
            return ElementPlusIconsVue[name];
        }
        let key = name.toLowerCase();
        if( hasOwn.call(ElementPlusIconsVue, key) ){
            return ElementPlusIconsVue[key];
        }
        key = name.slice(0,1).toUpperCase()+name.slice(1);
        if( hasOwn.call(ElementPlusIconsVue, key) ){
            return ElementPlusIconsVue[key];
        }
    }
    return Vue.resolveComponent(name);
}


function resolveComponent(name){
    name = String(name).trim();
    const value = _resolveComponent(name);
    if(!value){
        console.error(`[ES-VUE] The '${name}' icon component was not resolved`)
        return Vue.createCommentVNode(`icon '${name}' not resolved`)
    }
    return Vue.h(value);
}

const Icon = Vue.defineComponent({
    name:'es-icon',
    props: {
        size:{type:[Number, String]},
        color:{type:String},
        name:{type:String},
        src:{type:String}
    },
    setup(props, context) {
        let {size,color} = Vue.toRefs(props);
        return (_ctx, _cache) => {
            return Vue.h(ElIcon, {...context.attrs,size:Vue.unref(size),color:Vue.unref(color)}, {
                default:Vue.withCtx(()=>{
                    let name = Vue.unref(props.name);
                    let src = Vue.unref(props.src);
                    if((name || src) && !_ctx.$slots.default ){
                        if(src){
                            src = String(src).trim();
                            if(src){
                                if(src.startsWith('data:image/svg+xml;base64,')){
                                    src = src.substring('data:image/svg+xml;base64,'.length);
                                    if(typeof atob==='function'){
                                        src = atob(src);
                                    }else{
                                        src = Buffer.from(src, 'base64').toString();
                                    }
                                    return [Vue.createStaticVNode(src)];
                                }else if(src.charCodeAt(0) === 60 && src.charCodeAt(src.length-1)===62){
                                    return [Vue.createStaticVNode(src)];
                                }
                                return [Vue.h('img', {src, style:"width:100%;height:100%"})];
                            }
                        }
                        return [resolveComponent(name)];
                    }else {
                        let children = null;
                        if( typeof _ctx.$slots.default === 'function' ){
                            children =  _ctx.$slots.default();
                        }else if( Array.isArray(_ctx.$slots.default) ){
                            children = _ctx.$slots.default;
                        }else{
                            children = [_ctx.$slots.default];
                        }
                        if( Array.isArray(children) && children.length>0){
                            return children.map( child=>{
                                if(typeof child === 'string'){
                                    return resolveComponent(child)
                                }else if(Vue.isVNode(child)){
                                    if(child.type===Vue.Text && typeof child.children === 'string'){
                                        return resolveComponent(child.children)
                                    }else if(typeof child.type ==='string'){
                                        return resolveComponent(child.type)
                                    }
                                }
                                return child;
                            })
                        }
                    }
                    return []
                })
            });
        };
    }
});
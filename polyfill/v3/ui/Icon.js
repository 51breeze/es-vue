///<import from='element-plus/lib/components/icon' name='ElIcon' />
///<import from='element-plus/theme-chalk/el-icon.css' />
///<import from='vue' name='Vue' namespaced />
///<import from='@element-plus/icons-vue' name='ElementPlusIconsVue' namespaced />
///<namespaces name='web.ui' />
///<createClass value='false' />
///<referenceAssets value='false' />

const hasOwn = Object.prototype.hasOwnProperty;
function resolveComponent(name){
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

const Icon = Vue.defineComponent({
    name:'es-icon',
    props: {
        size:{type:[Number, String]},
        color:{type:String},
        name:{type:String}
    },
    setup(props) {
        const {size,color,name} = props;
        return (_ctx, _cache) => {
            const slots = {};
            if( name && !_ctx.$slots.default ){
                return Vue.h(ElIcon, {size,color}, {
                    default:()=>Vue.h( resolveComponent(name) ) 
                })
            }else {
                slots.default = ()=>{  
                    let children = [_ctx.$slots.default];
                    if( typeof _ctx.$slots.default === 'function' ){
                        children =  _ctx.$slots.default();  
                    }else if( Array.isArray(_ctx.$slots.default) ){
                        children = _ctx.$slots.default;
                    }
                    return children.map( child=>{
                        if( typeof child.type ==="string" ){
                            return Vue.h( resolveComponent(child.type), child.props);
                        }else{
                            return child;
                        }
                    });
                };
            }
            return Vue.h(ElIcon, {size,color}, slots);
        };
    }
});
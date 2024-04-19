///<import from='element-ui/lib/theme-chalk/icon.css' />
///<import from='vue' name='Vue' />
///<namespaces name='web.ui' />
///<createClass value='false' />
const Icon = Vue.extend({
    name:'es-icon',
    props: {
        size:{type:[Number, String]},
        color:{type:String},
        name:{type:String}
    },
    render(h) {
        let {size,color,name} = this;
        if( typeof size ==='number' ){
            size = size+'px';
        }
        const style = {};
        if(size){
            style.fontSize=size;
        }
        if(color){
            style.color=color;
        }
        const children = this.$children;
        if( children && children.lenght > 0 && children[0].tag ){
            name = String(children[0].tag);
        }
        return h('i', {style, class:`el-icon-${name}`});
    }
});



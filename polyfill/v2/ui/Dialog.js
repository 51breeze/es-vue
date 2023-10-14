///<import from='vue' name='Vue' />
///<import from='element-ui/packages/dialog' name='_Dialog' />
///<import from='element-ui/lib/theme-chalk/dialog.css' />
///<namespaces name='web.ui' />
///<createClass value='false' />
///<referenceAssets value='false' />
var visible = _Dialog.watch.visible;
var options = {
    name:'EsDialog',
    mixins:[_Dialog],
    props:{
        value:{
            type:Boolean,
            default:false 
        }
    },
    watch: {
        value(val,old) {
            if( visible ){
                visible.call(this, val, old);
            }
        }
    },
    beforeCreate(){
        this.$on('close',()=>{
            this.$emit('input', false);
        });
    }
};

var Dialog = Vue.component(options.name, options);
Object.defineProperty(Dialog.prototype,'visible',{
    configurable:true,
    enumerable:true,
    get:function(){
        return this.value;
    }
});
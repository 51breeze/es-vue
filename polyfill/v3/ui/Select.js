///<import from='element-plus/lib/components/select' name='_Select' />
///<import from='vue' name='Vue' namespaced />
///<import from='element-plus/theme-chalk/el-select.css' />
///<import from='element-plus/theme-chalk/el-popper.css' />
///<import from='element-plus/theme-chalk/el-scrollbar.css' />
///<import from='element-plus/theme-chalk/el-tag.css' />
///<import from='element-plus/theme-chalk/el-input.css' />
///<namespaces name='web.ui' />
///<createClass value='false' />
///<referenceAssets value='false' />
var Select = Object.assign({}, _Select);
const _setup = Select.setup;
Select.setup=function(props, ctx){
    if( props.size ){
        var value = props.size;
        if(value ==='mini')props.size='small';
        if(value==='medium')props.size='default';
    }
    return _setup(props, ctx)
}
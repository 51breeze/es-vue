import "element-plus/lib/components/option/style/css";
import Class from "./Class.js";
import Component from "./web/components/Component.js";
import {ElOption as Option} from "element-plus/lib/components/select";
import dev_tools_HMR from "./dev/tools/HMR.js";
function MyOption(){
    Component.call(this,arguments[0]);
}
Class.creator(MyOption,{
    m:513,
    name:"MyOption",
    inherit:Component,
    members:{
        render:{
            m:544,
            value:function render(){
                console.log(this,'------------MyOption-----');
                return this.createVNode(Option,this.getAttribute('config'),{
                    default:()=>{
                        const child = this.slot('default');
                        if(typeof child === 'function'){
                            return child();
                        }
                        return child;
                    }
                });
            },
            configurable:true
        }
    }
});
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("a3e4c6b9",MyOption)){
        dev_tools_HMR.reload("a3e4c6b9",MyOption)
    }
}
export default Component.createComponent(MyOption,{
    name:"es-MyOption",
    __hmrId:"a3e4c6b9"
});
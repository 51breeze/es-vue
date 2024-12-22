import  *  as vue from "vue";
import Reflect from "./../../Reflect.js";
export default {
    name:"v-list",
    props:{
        title:{
            type:String,
            default:"test"
        },
        list:{
            type:Array,
            default:[]
        }
    },
    render:function(){
        console.log('---------v-list 55555------',this.title,this.list);
        return vue.h('h3',{},[this.title].concat(Reflect.call(null,this.list,"map",[(item)=>{
            return vue.h('span',{},[Reflect.get(null,item,"label")]);
        }])));
    }
}
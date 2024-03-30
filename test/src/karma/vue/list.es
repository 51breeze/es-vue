import * as vue from 'vue';

export default {
    name:"v-list",
    props:{
        title:{type:String,default:"test"},
        list:{type:Array,default:[]}
    },
    render(){
        console.log('---------v-list 55555------', this.title , this.list )
        return vue.h('h3',{}, [this.title].concat( this.list.map(item=>{
        
            return  vue.h('span',{}, [ item.label ])


        })))
    }
};
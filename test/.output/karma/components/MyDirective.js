import Class from "./../../Class.js";
function MyDirective(){}
Class.creator(MyDirective,{
    m:513,
    ns:"karma.components",
    name:"MyDirective",
    members:{
        bind:{
            m:544,
            value:function bind(el){
                console.log(el,'----------MyDirective-------------');
                el.focus();
            }
        }
    }
});
export default MyDirective;
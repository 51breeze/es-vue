import Class from "./../Class.js";
import Store from "./../web/Store.js";
function UserStore(){
    Store.apply(this,arguments);
    this.userinfo={
        name:'sss'
    }
    this.isLogin=false;
    this.isLoginssss=false;
    this.persson=null;
    this.add="===99999==";
}
Class.creator(UserStore,{
    m:513,
    ns:"stores",
    name:"UserStore",
    inherit:Store,
    methods:{
        use:{
            m:800,
            value:function use(){
                return Store.use(UserStore);
            }
        }
    },
    members:{
        userinfo:{
            m:520,
            writable:true,
            enumerable:true
        },
        isLogin:{
            m:520,
            writable:true,
            enumerable:true
        },
        isLoginssss:{
            m:520,
            writable:true,
            enumerable:true
        },
        persson:{
            m:520,
            writable:true,
            enumerable:true
        },
        add:{
            m:1032,
            writable:true
        },
        info:{
            m:576,
            enumerable:true,
            set:function info(value){
                this.persson=value;
                console.log('-------set info----',value);
            }
        },
        addName:{
            m:576,
            enumerable:true,
            get:function addName(){
                return this.add;
            }
        },
        fetch:{
            m:544,
            value:function fetch(){
                this.isLogin=true;
                this.setState('add','==6666666666=2222===========');
                this.userinfo.name='6666';
                console.log(this.add,'------666-333--6666666-');
                return this.userinfo;
            }
        }
    }
});
export default UserStore;
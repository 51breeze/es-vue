package stores;

import web.Store;

class UserStore extends Store{

    userinfo = {name:'sss'};

    isLogin = false;

    isLoginssss = false;

    persson = null;

    protected add = "===99999==";

    set info( value ){
        this.persson = value;
        console.log('-------set info----', value )
        
    }

    get addName(){
        
        return this.add;
    }

    fetch(){
        this.isLogin = true;
        //this.add = '===999999=============';

         this.setState('add', '==6666666666=2222===========')


         this.userinfo.name = '6666'
         console.log( this.add,  '------666-333--6666666-')
         return this.userinfo;
    }

    static use(){
        return Store.use(UserStore)
    }

}
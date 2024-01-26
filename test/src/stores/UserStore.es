package stores;

import web.Store;

class UserStore extends Store{

    userinfo = {name:'sss'};

    isLogin = false;

    persson = null;

    private add = "";

    set info( value ){
        this.persson = value;
        console.log('-------set info-------', value )
        
    }

    get addName(){
        return this.add;
    }
    fetch(){
        this.isLogin = true;
        this.add = '123';
        this.userinfo.name = 'zh666666666'

        console.log( this.add ,'-------add--------')
        return this.userinfo;
    }

    static use(){
        return Store.use(UserStore)
    }

}
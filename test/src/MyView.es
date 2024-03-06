package;
import web.components.SkinComponent;
//import web.View;
import MySkin;

class MyView extends SkinComponent<MyView>{

    constructor(){
        super();
        this.skinClass = MySkin;
        this.skinClass
        this.skin;

    }

    get name(){
        return '=========MyView of MySkin============='
    }

    get nameMyView():string{
        return 'name';
    }

    
    
}

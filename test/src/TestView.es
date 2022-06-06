package;
import web.components.SkinComponent;
import web.Skin;
import web.View;
import web.components.Route;
import MySkin;

class TestView extends SkinComponent<TestView>{

    constructor(){
        super();
       // this.skinClass = MySkin;

        this.skinClass
    }

    get name(){
        return '=========MyView of MySkin============='
    }

    get nameMyView():string{
        return 'name';
    }

    
    
}

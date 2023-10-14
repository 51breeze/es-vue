package;

import web.Application;

import karma.pages.List;
import web.ui.Loading;

import "theme.scss";

class ComTest extends Application{

    @main
    static main(){


        const index = new ComTest({
            // directives:{
            //     loading:Vue.directive('loading')
            // }
        });
        index.mount('#app')
       
    }

    @Override
    render(h){
        return h( List );
    }

}
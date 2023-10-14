package{

    import web.components.Component;
    // import PersonSkin;
     import web.ui.Button;
    // import MyView;

    //import web.ui.InfiniteScroll;

   // import 'element-plus/theme-chalk/base.css';
   

    class ChildPerson extends Person{

        @Reactive
        private name:string='';

        constructor( props ){
            super( {name:11} );
            console.log( props )
        }

    }

}
package web{
    
    @import(Vue = "vue")
    declare class Vue{
        constructor(props?:object);
        static extend( options:object );
        static use(plugin):void;
        static component(name:string):web.components.Component;
        static get options():object;
    }

    @import(Router = "vue-router")
    declare class Router{}
}

package web.ui{

    @import(Select = "element-ui/packages/select")
    @Embed('element-ui/lib/theme-chalk/select.css');
    declare class Select extends web.components.Component{
        constructor(option?);
        get value():string;
        set value(value:string):void;
    }

    @import(SelectOption = "element-ui/packages/option")
    declare class SelectOption extends web.components.Component{
        constructor(option?);
    }

    @import(Notification = "element-ui/packages/notification")
    @Embed('element-ui/lib/theme-chalk/notification.css');
    @Embed('element-ui/lib/theme-chalk/icon.css');
    declare class Notification{
        @Callable
        constructor(options:{title:string,message:string});
    }

    declare class Viewport extends web.components.Component{
        constructor(option?);
    }
    
    declare class Link extends web.components.Component{
        constructor(option?);
    }
}


package web.components{

    declare class State{
        public constructor(name:string);
    }

    class ComponentEvent extends Event{
        static const BEFORE_CREATE:string = 'componentBeforeCreate';
        static const BEFORE_MOUNT:string = 'componentBeforeMount';
        static const BEFORE_UPDATE:string = 'componentBeforeUpdate';
        static const BEFORE_DESTROY:string = 'componentBeforeDestroy';
        static const ERROR_CAPTURED:string = 'componentErrorCaptured';
        static const UPDATED:string = 'componentUpdated';
        static const MOUNTED:string = 'componentMounted';
        static const CREATED:string = 'componentCreated';
        static const ACTIVATED:string = 'componentActivated';
        static const DEACTIVATED:string = 'componentDeactivated';
        static const DESTROYED:string = 'componentDestroyed';
        public constructor(type:string, bubbles?:boolean,cancelable?:boolean){
            super(type);
        }
    }

    @WebComponent
    declare class Component implements IEventDispatcher {
        public constructor( options?:any );
        protected created();
        protected updated();
        protected render():Node|Component;
        protected mounted();
        protected activated();
        protected deactivated();
        protected destroyed();
        protected beforeCreate();
        protected beforeMount();
        protected beforeUpdate();
        protected beforeDestroy();
        protected shouldUpdate();
        public slot( name:string , scope?:boolean, called?:boolean, params?:object );
        public createElement(name:string|Component,data?:NodeDataConfig,children?:NodeElementResult[]):NodeElementResult;
        public getElementByRefName(name:string):NodeElementResult | NodeElementResult[];
        public get config():NodeDataConfig;
        public forceUpdate();
        public data<T=any>(name?:string, value?:any):T;
        public mount( element:string|Node );
        public addEventListener(type: string, listener: (event?:Event)=>void):this;
        public dispatchEvent(event: Event):boolean;
        public removeEventListener(type: string, listener?: (event?:Event)=>void):boolean;
        public hasEventListener(type: string, listener?: (event?:Event)=>void):boolean;
        public get parent():Component;
        public get children():Component[];
    }

    declare type NodeElementResult = Node | Component;
    declare type NodeDataConfig = {
        props?:{},
        data?:()=>{},
        on?:{},
        style?:{},
        className?:string,
        ref?:string
    };

    @SkinClass
    class Skin<T extends Component> implements IEventDispatcher{
        private var _hostComponent:T=null;
        private var _event:EventDispatcher  =null;
        public constructor(hostComponent:T){
            this._hostComponent = hostComponent;
            this._event = new EventDispatcher(this);
        }

        get hostComponent(){
            return this._hostComponent;
        }

        data<T>(name?:string, value?:any):T{
            return this.hostComponent.data<T>(name,value);
        }

        forceUpdate(){
            return this.hostComponent.forceUpdate();
        }

        getElementByRefName(name){
            return this.hostComponent.getElementByRefName(name);
        }

        slot( name:string , scope?:boolean, called?:boolean, params?:object ){
            return this.hostComponent.slot(name,scope,called,params);
        }

        createElement(name:string|Component,data?:NodeDataConfig,children?:NodeElementResult[]):NodeElementResult{
            return this.hostComponent.createElement(name,data,children);
        }

        render():Node|Component{
            return <div />
        }

        addEventListener(type: string, listener: (event?:Event)=>void){
            this._event.addEventListener(type, listener );
            return this;
        }

        dispatchEvent(event: Event){
            return this._event.dispatchEvent(event);
        }
    
        removeEventListener(type: string, listener?: (event?:Event)=>void){
            return this._event.removeEventListener(type, listener);
        }

        hasEventListener(type: string, listener?: (event?:Event)=>void){
            return this._event.hasEventListener(type, listener);
        }

        // public set state(vlaue:State){

        // }
        // public get state():State{

        // }
        // public set stateGroup( value:State[] ){

        // }
        // public get stateGroup():State[]{

        // }
    }
}
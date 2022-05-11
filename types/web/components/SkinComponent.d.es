package web.components{

    @Reference('./Skin.d.es');

    import web.components.Component;
    import web.components.Skin;

    class SkinComponent<T extends Component> extends Component{

        private skinInstance = null;
        private _skinClass:class< Skin<T> >;

        public constructor(){
           super();
        }

        get skin(){
            const instance = this.skinInstance;
            if(instance)return instance;
            return this.skinInstance = new this.skinClass(this);
        }

        set skinClass(value:class< Skin<T> > ){
            if( this._skinClass !== value ){
                this._skinClass = value;
                this.skinInstance = null;
            }
        }

        get skinClass(){
            return this._skinClass;
        }

        @override
        render(){
            return this.skin.render();
        }
    }
}
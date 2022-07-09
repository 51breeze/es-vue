package web.events{
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
            super(type,bubbles,cancelable);
        }
    }
}
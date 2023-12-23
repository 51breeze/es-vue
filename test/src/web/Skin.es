package web;
import web.components.Component;

@SkinClass
class Skin<T extends Component > implements IEventDispatcher{
    private var _hostComponent:T;
    public constructor(hostComponent:T){
        this._hostComponent = hostComponent;
    }

    get hostComponent():T{
        return this._hostComponent;
    }

    reactive<T>(name:string, value?:any):T{
        return this.hostComponent.reactive<T>(name,value);
    }

    forceUpdate(){
        return this.hostComponent.forceUpdate();
    }

    getElementByName(name){
        return this.hostComponent.getRefs(name);
    }
    
    slot( name:string , scope?:boolean, called?:boolean, params?:object ){
        return this.hostComponent.slot(name,scope,called,params);
    }

    createElement(name:string|Component,data?:web.components.VNodeDataConfig,children?:VNode | Component[]){
        //return this.hostComponent.createVNode(name,data,children);
    }

    watch(name: string, callback:(uewVlaue?,oldValue?)=>void):void{
        this.hostComponent.watch(name, callback);
    }

    observable<T extends object>(target:T):T{
        return this.hostComponent.observable<T>(target);
    }

    nextTick(callback:()=>void):void{
         this.hostComponent.nextTick(callback);
    }

    on(type: string, listener:(...args)=>void){
        this.hostComponent.on(type,listener);
    }

    off(type: string, listener?:(...args)=>void):void{
        this.hostComponent.off(type, listener);
    }

    emit(type: string, ...args?:any[]):void{
        this.hostComponent.emit(type, args);
    }

    addEventListener(type: string, listener: (event?:Event)=>void){
        return this.hostComponent.addEventListener(type, listener);
    }

    dispatchEvent(event: Event):boolean{
        return this.hostComponent.dispatchEvent(event);
    }

    removeEventListener(type: string, listener?: (event?:Event)=>void):boolean{
        return this.hostComponent.removeEventListener(type, listener);
    }

    hasEventListener(type: string, listener?: (event?:Event)=>void):boolean{
        return this.hostComponent.removeEventListener(type, listener);
    }

    render(){
        return null;
    }

}
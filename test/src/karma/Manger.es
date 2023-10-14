package karma;
import web.components.Component;
import karma.asserts.Base;

class Manger {

    static private instance:Manger;

    static getInstance(){
        let obj = Manger.instance;
        if( !obj ){
            Manger.instance= obj = new Manger();
        }
        return obj;
    }

    private _app;

    private _dataset:Map<any,any>;

    get dataset(){
        const dataset = this._dataset
        if(dataset){
            return dataset;
        }
        return this._dataset = new Map<any,any>();
    }

    register(name:string, value:any){
        this.dataset.set(name, value);
    }

    get<T=any>(name:string):T{
        const value = this.dataset.get(name);
        if(value instanceof Function){
            return value() as T;
        }
        return this.dataset.get(name) as T;
    }

    getApp(){
        return this._app;
    }

    setApp(app){
        this._app=app;
    }

    private pages:Component[]= [];
    pushPage( page:Component ){
        this.pages.push( page );
    }

    popPage(){
        return this.pages.shift();
    }

    private asserts:Base[]= [];
    addAssert( page:Base ){
        this.asserts.push( page );
    }

    getAsserts(){
        return this.asserts;
    }

    private tasks:{[key:string]:Function} = {};
    addTask( name:string, task:Function ){
        this.tasks[name]=task;
    }

    getTask(name){
        return this.tasks[name];
    }

}
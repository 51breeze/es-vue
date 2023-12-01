package web.components;
import web.components.Component

@Define(slot, default);
@Define(slot, fallback);
class Runtime extends Component {

    platform:'server'|'client' = 'client';
    placeholder:string|VNode =  null;
    tag:string = 'span';

    getRuntimePlatform(){
        return @Env(platform) || 'client';
    }

    @Reactive
    private mounted = false;

    @Override
    protected onMounted():void{
        if(this.platform ==='client'){
            this.mounted = true;
        }
    }

    protected getChildNodes(){
        const defaultSlot = this.slot('default') as Function;
        if(typeof defaultSlot === 'function'){
            return defaultSlot();
        }else{
            return defaultSlot as any;
        }
    }
 
    @Override
    protected render(){
        const runtime = this.getRuntimePlatform().toLowerCase();
        const matched = runtime === this.platform.toLowerCase();
        const fallback = ()=>this.placeholder;
        let placeholder = this.slot('fallback', fallback as any ) as Function;
        if(typeof placeholder !=='function'){
            placeholder = ((value)=>(value)=>value)(placeholder);
        }
        if(runtime ==='server'){
            if(matched){
                return this.getChildNodes();
            }else{
                return this.createVNode(this.tag, {}, placeholder());
            }
        }
        return this.mounted && matched ? this.getChildNodes() : this.createVNode(this.tag, {}, placeholder());
    }
}

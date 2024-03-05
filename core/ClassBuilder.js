const Core = require('./Core');
class ClassBuilder extends Core.ClassBuilder{

    static createClassNode(stack, ctx, type){
        const obj = new ClassBuilder(stack, ctx, type);
        return obj.create();
    }

    create(){
        const storeHmrNode = this.createStoreHMRHotUpdateNode();
        const node = super.create();
        if(node && storeHmrNode){
            this.afterBody.push(storeHmrNode);
        }
        return node;
    }

    createStoreHMRHotUpdateNode(){
        const opts = this.plugin.options;
        if(!opts.hot || opts.mode === 'production')return;
        const program = this.getParentByType('Program');
        if( program._createHMRHotAcceptNodeFlag )return;
        
        const StoreModule = this.compilation.getGlobalTypeById('web.Store');
        if(!StoreModule)return;
        let isStore = false;
        const module = this.module;
        if(this.compilation.modules.size >1){
            isStore = Array.from(this.compilation.modules.values()).some( module=>StoreModule.is(module) );
        }else{
            isStore = StoreModule.is(module);
        }
        if(!isStore || StoreModule===module)return;

        program._createHMRHotAcceptNodeFlag = true;

        const SystemModule = this.compilation.getGlobalTypeById('System');
        this.addDepend(SystemModule);
        this.addDepend(StoreModule);

        const hmrHandler = this.builder.plugin.options.hmrHandler || 'module.hot';
        const StoreHandler = this.getModuleReferenceName(StoreModule, module);
        const SystemHandler = this.getModuleReferenceName(SystemModule, module);
        const key = (this.compilation.file||module.getName()).toLowerCase();
        const node = this.createChunkNode(`if(${hmrHandler}){(function(){
            ${hmrHandler}.accept();
            const key = 'hot-update-records:${key}';
            const hasRecords = ${SystemHandler}.getConfig(key);
            if( !hasRecords ){
                ${SystemHandler}.setConfig(key, true);
            }else{
                ${StoreHandler}.use(${module.id});
            }
        })()}`,true,true);

        if(program.isProgram && program.afterBody){
            program.afterBody.push(node);
            return null;
        }else{
            return node;
        }
    }
}

module.exports = ClassBuilder;
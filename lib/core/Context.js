import BaseContext from "@easescript/transform/lib/core/Context";
import Utils from "easescript/lib/core/Utils";
import path from "path";
import { toCamelCase } from "./Common";
const EXCLUDE_STYLE_RE = /[\\\/]style[\\\/](css|index)$/i;

class Context extends BaseContext{

    #staticHoisted = new Set();
    addStaticHoisted(node){
        if(node){
            if(node.isStaticHoistedNode){
                return node;
            }
            let local = `__hoisted_${this.#staticHoisted.size}__`;
            local = this.createIdentifier(this.getGlobalRefName(null,local));
            this.#staticHoisted.add(this.createVariableDeclaration('const',[
                this.createVariableDeclarator(local, node)
            ]));
            local.isStaticHoistedNode = true;
            return local;
        }
        return null;
    }

    get staticHoistedItems(){
        return Array.from(this.#staticHoisted.values());
    }

    getAvailableOriginType( type ){
        if( type ){
            const originType = Utils.getOriginType(type);
            switch( originType.id ){
                case 'String' :
                case 'Number' :
                case 'Array' :
                case 'Function' :
                case 'Object' :
                case 'Boolean' :
                case 'RegExp' :
                    return originType.id;
                default :
            }
        }
        return null;
    }

    getModuleResourceId(module, query={}){
        const importSourceQuery = this.options.importSourceQuery;
        if( importSourceQuery.enabled ){
            const isString = typeof module === 'string';
            const test = importSourceQuery.test;
            let result = true;
            if(test){
                let file = isString ? module :  path.dirname(module.file) +'.'+ module.id + path.extname(module.file);
                let ns = !isString && Utils.isModule(module) ? module.getName() : null;
                if(test instanceof RegExp){
                    result = test.test(file);
                    if(!result)result = test.test(ns);
                }else{
                    result = file === test || test === ns;
                }
            }
            if(result){
                const typeName = query.type==='style' ? 'styles' :  'component';
                if(typeName){
                    result = importSourceQuery.types.includes(typeName);
                }
                if(!result || !typeName){
                    result = importSourceQuery.types.includes('*');
                }
            }
            if(result && importSourceQuery.query){
                Object.keys(importSourceQuery.query).forEach(key=>{
                    if(query[key] === void 0){
                        query[key] = importSourceQuery.query[key];
                    }
                })
            }
        }
        if(query.vue != null)query.vue = '';
        return super.getModuleResourceId(module, query)
    }

    resolveImportSource(id, ctx={}){
        const ui = this.options.ui;
        if(ui.style==="none"){
            if(EXCLUDE_STYLE_RE.test(id)){
                return {source:false}
            }
        }
        const glob = this.glob;
        const scheme = glob.scheme(id, ctx);
        let source = glob.parse(scheme, ctx);
        let rule = scheme.rule;
        if(rule){
            if(source && Array.isArray(ctx.specifiers)){
                let fully = ui.fully;
                if(fully && 'element-plus' === source ){
                    ctx.specifiers.forEach( item=>{
                        if(item.imported){
                            if(item.imported != "*" && !item.imported.startsWith('El')){
                                item.imported = `El${toCamelCase(item.imported.value)}`
                            }
                        }else{
                            let pos = id.lastIndexOf('/');
                            let basename =  toCamelCase(id.substring(pos+1));
                            item.imported = `El${basename}`
                        }
                    })
                }
            }
        }else{
            source = id;
        }
        return source;
    }
    
    createDefaultRoutePathNode(module){
        if(Utils.isModule(module)){
            return this.createLiteral(
                this.plugin.makeCode.getDefaultRoutePath(module)
            );
        }
        return null;
    }

}

export default Context;
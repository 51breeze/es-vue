import BaseContext from "@easescript/transform/lib/core/Context";
import {checkMatchStringOfRule} from "@easescript/transform/lib/core/Common";
import Namespace from "easescript/lib/core/Namespace";
import Utils from "easescript/lib/core/Utils";
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

    isWebComponent(module){
        if(Utils.isCompilation(module)){
            module = module.mainModule;
        }
        if(!Utils.isModule(module))return false;
        if(module.isWebComponent())return true;
        return this.isApplication(module);
    }

    isApplication(module){
        if( !module || !module.isModule || module.isDeclaratorModule )return false;
        const Application = Namespace.globals.get('web.Application');
        return Application.is(module);
    }

    getModuleResourceId(module, query={}, extformat=null){
        const options = this.options.importFormation || {};
        const importQuery = options.query;
        const ext = options.ext;
        const needFormat = extformat == null && ext.enabled && ext.suffix;
        const needQuery = importQuery.enabled && importQuery.attrs;
        if((needFormat || needQuery) && this.isWebComponent(module)){
            if(needFormat && checkMatchStringOfRule(ext.test, module.file, module)){
                extformat = ext.suffix;
            }
            if(needQuery && checkMatchStringOfRule(importQuery.test, module.file, module)){
                Object.keys(importQuery.attrs).forEach(key=>{
                    if(query[key] === void 0){
                        query[key] = importQuery.attrs[key];
                    }
                })
            }
        }
        return super.getModuleResourceId(module, query, extformat)
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
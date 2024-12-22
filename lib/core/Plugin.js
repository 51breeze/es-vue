import BasePlugin from "@easescript/transform/lib/core/Plugin";
import {createBuildContext} from "./Builder";
import {createPolyfillModule} from '@easescript/transform/lib/core/Polyfill';
import path from "path";

function defineError(complier){
    if(defineError.loaded || !complier || !complier.diagnostic)return;
    defineError.loaded=true;
    let define = complier.diagnostic.defineError
    define(11000,'',[
        '对非元素根节点的组件使用"show"指令时，无法按预期运行。',
        "Runtime directive used on component with non-element root node. The 'show' directives will not function as intended"
    ]);
    define(11001,'',[
        '指令组件的子级只能是一个VNode的类型',
        "Child of directive-component can only is of a VNode"
    ]);
    define(11002,'',[
        'JSX不支持动态属性名',
        "Dynamic property name is not supported in JSX. this property will be removed."
    ]);
    define(11003,'',[
        '函数中引用的组件不是标识符',
        "The component references in a function is not an identifier"
    ]);
}

class Plugin extends BasePlugin{
    #context = null;
    get context(){
        return this.#context;
    }
    init(){
        defineError(this.complier)
        //创建一个用来构建的上下文对象。每个插件都应该实现自己的上下文对象
        this.#context = createBuildContext(this, this.records);
        //初始化需要的虚拟模块。 每个插件都应该实现自己的虚拟模块
        createPolyfillModule(
            path.join(__dirname, "./polyfills"),
            this.#context.virtuals.createVModule
        );
    }
}

export default Plugin
export {defineError, Plugin}
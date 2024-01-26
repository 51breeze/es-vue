package vue{

    declare interface App<HostElement = any> {
        version: string;
        config: AppConfig;
        use<Options extends any[]>(plugin: Plugin<Options>, ...options: Options[]): this;
        use<Options>(plugin: Plugin<Options>, options: Options): this;
        mixin(mixin: any): this;
        component(name: string): any;
        component(name: string, component: any): this;
        directive(name: string): any;
        directive(name: string, directive: any): this;
        mount(rootContainer: HostElement | string, isHydrate?: boolean, isSVG?: boolean): any;
        unmount(): void;
        provide<T>(key:any, value: T): this;
        /**
        * Runs a function with the app as active instance. This allows using of `inject()` within the function to get access
        * to variables provided via `app.provide()`.
        *
        * @param fn - function to run with the app as active instance
        */
        runWithContext<T>(fn: () => T): T;
        _uid: number;
        _component: any;
        _props: {[key:string]:any} | null;
        _container: HostElement | null;
        _context: AppContext;
        _instance: any;
        /**
        * v2 compat only
        */
        filter?(name: string): Function;
        filter?(name: string, filter: Function): this;
    }

    declare type OptionMergeFunction = (to: any, from: any) => any;
    declare interface AppConfig {
        const isNativeTag?:(tag: string) => boolean;
        performance: boolean;
        optionMergeStrategies: {[key:string]:OptionMergeFunction};
        globalProperties:{[key:string]:any};
        errorHandler?: (err: any, instance:any, info: string) => void;
        warnHandler?: (msg: string, instance:any, trace: string) => void;
        /**
        * Options to pass to `@vue/compiler-dom`.
        * Only supported in runtime compiler build.
        */
        compilerOptions: RuntimeCompilerOptions;
        /**
        * @deprecated use config.compilerOptions.isCustomElement
        */
        isCustomElement?: (tag: string) => boolean;
        /**
        * Temporary config for opt-in to unwrap injected refs.
        * @deprecated this no longer has effect. 3.3 always unwraps injected refs.
        */
        unwrapInjectedRef?: boolean;
    }

    declare interface RuntimeCompilerOptions {
        isCustomElement?: (tag: string) => boolean;
        whitespace?: 'preserve' | 'condense';
        comments?: boolean;
        delimiters?: [string, string];
    }

    declare interface AppContext {
        app: App;
        config: AppConfig;
        mixins: any[];
        components:{[key:string]:any};
        directives: {[key:string]:any};
        provides:{[key:string]:any};
    }

    declare type PluginInstallFunction<Options> = (app: App, ...options: Options[]) => any;

    declare type Plugin<Options = any[]> = PluginInstallFunction<Options> | {
        install: PluginInstallFunction<Options>
    };

    declare interface Ref<T=any>{
        value: T;
    }

    declare type Record<T=any> = {[key:string]:T};

    declare interface VNode extends global.VNode{
        type: any;
        props: Record | null;
        key: string | number | null;
        ref:any;
        scopeId: string | null;
        children: VNode[];
        component: ComponentInternalInstance | null;
        dirs: any[] | null;
        transition: any;
        el: any;
        anchor: any;
        target: any;
        targetAnchor: any;
        suspense: any;
        shapeFlag: number;
        patchFlag: number;
        appContext: AppContext | null;
    }

    declare interface ComponentInternalInstance{
        uid: number;
        type: any;
        parent: ComponentInternalInstance | null;
        root: ComponentInternalInstance;
        appContext: AppContext;
        /**
        * Vnode representing this component in its parent's vdom tree
        */
        vnode: VNode;
        /* removed internal: next */
        /**
        * Root vnode of this component's own vdom tree
        */
        subTree: VNode;
        /**
        * Render effect instance
        */
        effect: any;
        /**
        * Bound effect runner to be passed to schedulers
        */
        update: any;
        proxy: ComponentPublicInstance | null;
        exposed:Record | null;
        exposeProxy:Record | null;
        data: Record;
        props:Record;
        attrs:Record;
        slots:Record;
        refs:Record;
        emit: any;
        attrsProxy:Record | null;
        slotsProxy:Record | null;
        isMounted: boolean;
        isUnmounted: boolean;
        isDeactivated: boolean;
    }

    declare interface ComponentPublicInstance{
        $: ComponentInternalInstance
        $data:Record
        $props:Record
        $attrs:Record
        $refs:Record
        $slots:Record
        $root: ComponentPublicInstance
        $parent: ComponentPublicInstance
        $emit: any
        $el: any
        $options: Record
        $forceUpdate: () => void
        $nextTick: (fn:()=>void)=>void
        $watch<T extends watchOpt>(source: T, cb:(...args) => any, options?: any): any
    }

    declare type watchOpt = string | (...args) => any

    declare type VNodeChildAtom = VNode | string | number | boolean | null;
    declare type RawChildren = string | number | boolean | VNode | VNodeChildAtom[] | () => any;

    declare function h(type: string, children?: RawChildren): VNode;
    declare function h(type: string, props?: Record | null, children?: RawChildren | Record): VNode;

    declare function defineComponent(options:Record):Record;
    declare function defineAsyncComponent(options:Record):Record;
    declare function openBlock(disableTracking?: boolean): void;
    declare function createBlock(type: any, props?: Record | null, children?: any, patchFlag?: number, dynamicProps?: string[]): VNode;
    declare function createElementBlock(type:any, props?: Record | null, children?: any, patchFlag?: number, dynamicProps?: string[], shapeFlag?: number): VNode;
    declare function createElementVNode(type: any, props?: Record | null, children?: any, patchFlag?: number, dynamicProps?: string[] | null, shapeFlag?: number, isBlockNode?: boolean, needFullChildrenNormalization?: boolean): VNode;
    declare function createVNode(type:any, props?:Record | null, children?: any, patchFlag?: number, dynamicProps?: string[] | null, isBlockNode?: boolean): VNode;
    declare function createTextVNode(text?: string, flag?: number): VNode;
    declare function createCommentVNode(text?: string, asBlock?: boolean): VNode;
    declare function createStaticVNode(content: string, numberOfNodes: number): VNode;
    declare function cloneVNode<T, U>(vnode: VNode, extraProps?:Record | null, mergeRef?: boolean): VNode;
    declare function mergeProps<A extends Record, B extends Record>(a:A, b:B): A & B;
    declare function mergeProps<A extends Record, B extends Record, C extends Record>(a:A, b:B, c:C): A & B & C;
    declare function mergeProps<A extends Record, B extends Record, C extends Record, D extends Record>(a:A, b:B, c:C, d:D): A & B & C & D;
    declare function isVNode(value: any):boolean
    declare function markRaw<T>(value:T):T;

    declare function watch<T>(source: WatchSource<T>,callback:WatchCallback<T>,options?:WatchOptions):()=>void
    declare function watch<T>(sources: WatchSource<T>[],callback: WatchCallback<T>[],options?:WatchOptions): ()=>void
    declare type WatchCallback<T> = (value: T,oldValue: T, onCleanup: (cleanupFn: () => void) => void) => void
    declare type WatchSource<T> = Ref<T> | (() => T) | object;

    declare interface WatchEffectOptions {
        flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
        onTrack?: (event: Record) => void
        onTrigger?: (event: Record) => void
    }

    declare interface WatchOptions extends WatchEffectOptions {
        immediate?: boolean // 默认：false
        deep?: boolean // 默认：false
        flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
        onTrack?: (event: Record) => void
        onTrigger?: (event: Record) => void
    }

    declare function reactive<T extends object>(target:T):T
    declare function renderList<T>(source: Iterable, renderItem: (value: T, index: number) => VNode): VNode[];
    declare function renderSlot(slots: Record, name: string, props?: Record, fallback?: () => VNode[], noSlotted?: boolean): VNode;

    declare function onActivated(hook: Function, target?: ComponentInternalInstance | null): void;
    declare function onDeactivated(hook: Function, target?: ComponentInternalInstance | null): void;
    declare const onBeforeMount: (hook: () => any, target?: ComponentInternalInstance | null) => false | Function;
    declare const onMounted: (hook: () => any, target?: ComponentInternalInstance | null) => false | Function;
    declare const onBeforeUpdate: (hook: () => any, target?: ComponentInternalInstance | null) => false | Function;
    declare const onUpdated: (hook: () => any, target?: ComponentInternalInstance | null) => false | Function;
    declare const onBeforeUnmount: (hook: () => any, target?: ComponentInternalInstance | null) => false | Function;
    declare const onUnmounted: (hook: () => any, target?: ComponentInternalInstance | null) => false | Function;
    declare const onServerPrefetch: (hook: () => any, target?: ComponentInternalInstance | null) => false | Function;
    declare type DebuggerHook = (e: Error) => void;
    declare const onRenderTriggered: (hook: DebuggerHook, target?: ComponentInternalInstance | null) => false | Function;
    declare const onRenderTracked: (hook: DebuggerHook, target?: ComponentInternalInstance | null) => false | Function;
    declare type ErrorCapturedHook<TError = Error> = (err: TError, instance: ComponentPublicInstance | null, info: string) => boolean | void;
    declare function onErrorCaptured<TError = Error>(hook: ErrorCapturedHook<TError>, target?: ComponentInternalInstance | null): void;
}
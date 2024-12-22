package web.components{

    declare class Router{
        static const START_LOCATION:RouteConfig;
        mode:'hash' | 'history' | 'abstract';
        base:string;
        get currentRoute():Route;
        get options():RouterOptions;
        push(location: RouterLocation, onComplete?:(route?:Route)=>void, onAbort?:()=>void):Promise<Route>;
        replace(location: RouterLocation, onComplete?:(route?:Route)=>void, onAbort?:()=>void):Promise<Route>;
        go( value?:number ):void;
        back():void;
        forward():void;
        beforeEach( callback:(to:Route, from:Route, next:(to?:any)=>void) =>any );
        beforeResolve( callback:(to:Route, from:Route, next:(to?:any)=>void) =>any );
        afterEach( callback:(to:Route, from:Route) =>any );
        getMatchedComponents( location?:RouterLocation ):Component[];
        resolve( location?:RouterLocation, current?:Route, append?:boolean ):{
             location:RouterLocation,
             route:Route, 
             href:string, 
             normalizedTo:RouterLocation,
             resolved:Route
        };
        match (raw: RouterLocation, current?: Route, redirectedFrom?: RouterLocation): Route
        addRoute(route:RouteConfig,parentPath?:string);
        getRoutes():RouteRecordPublic[];
        onReady( done:()=>void, error?:()=>void ):void;
        onError( error?:()=>void ):void;
        constructor(options?:RouterOptions);
    }

    declare type RouterPosition = { 
        x: number,
        y: number
    };

    declare interface RouterDictionary<T> { 
        [key: string]: T 
    }

    declare type RouterLocation=string | { 
        name?:string, 
        path?:string,
        hash?: string,
        params?:RouterDictionary<string>,
        query?: RouterDictionary<string | (string | null)[] | null >,
        append?: boolean,
        replace?: boolean
    }

    declare type RouterPositionResult = RouterPosition | { 
        selector: string,
        offset?: RouterPosition,
        behavior?: ScrollBehavior 
    }

    declare interface RouterOptions {
        routes?: RouteConfig[]
        mode?: 'hash' | 'history' | 'abstract'
        fallback?: boolean
        base?: string
        linkActiveClass?: string
        linkExactActiveClass?: string
        parseQuery?: (query: string) => object
        stringifyQuery?: (query: object) => string
        scrollBehavior?: (
            to: Route,
            from: Route,
            savedPosition: RouterPosition
        ) => RouterPositionResult | Promise<RouterPositionResult> | null
    }

    declare interface Route{
        path:string,
        params?:RouterDictionary<string>,
        query?:RouterDictionary<string | (string | null)[]>,
        hash?:string,
        name?:string,
        redirectedFrom?:string,
        fullPath?:string,
        matched?:RouteRecord[],
        meta?:{[key:string | number]:any}
    }

    declare interface RouteRecord {
        path: string
        regex: RegExp
        components: RouterDictionary<Component>
        instances: RouterDictionary<Component>
        name?: string
        parent?: RouteRecord
        redirect?: RouterLocation | (to: Route) => RouteConfig
        matchAs?: string
        meta: {[key:string | number]:any}
        beforeEnter?: (
            route: Route,
            redirect: (location: RouterLocation) => void,
            next: () => void
        ) => any
        props:boolean | object | RouterDictionary<string | number | object>
    }

    declare interface RouteRecordPublic {
        path: string
        components: RouterDictionary<Component>
        instances: RouterDictionary<Component>
        name?: string
        redirect?: RouterLocation | (to: Route) => RouteConfig
        meta: any
        beforeEnter?: (
            route: Route,
            redirect: (location: RouterLocation) => void,
            next: () => void
        ) => any
        props: boolean | RouterDictionary<string | number | object> | (name)=>any
    }

    declare interface RouteConfig{
        path: string
        component ?: Component | ()=>Component
        name?: string
        redirect?: RouterLocation | Function
        props?: boolean | RouterDictionary<string | number | object> | (name)=>any
        alias?: string | string[]
        children?: RouteConfig[]
        beforeEnter?: (to: Route, from: Route, next: ()=>void) => void
        meta?: any
        caseSensitive?: boolean
        pathToRegexpOptions?: object
    }
}
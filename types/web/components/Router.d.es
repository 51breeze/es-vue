package web.components{
    declare class Router{
        static const START_LOCATION:RouteConfig;
        const currentRoute:RouteConfig;
        const options:RouterOptions;
        mode:'hash' | 'history' | 'abstract';
        base:string;
        push(location: RouteLocation, onComplete?:()=>void, onAbort?:()=>void):Promise<Route>;
        replace(location: RouteLocation, onComplete?:()=>void, onAbort?:()=>void):Promise<Route>;
        go( value?:number ):void;
        back():void;
        forward():void;
        beforeEach( callback:(to:Route, from:Route, next:(to?:any)=>void) =>any );
        beforeResolve( callback:(to:Route, from:Route, next:(to?:any)=>void) =>any );
        afterEach( callback:(to:Route, from:Route) =>any );
        getMatchedComponents( location?:RouteLocation ):Component[];
        resolve( location?:RouteLocation, current?:Route, append?:boolean ):{
             location:RouteLocation,
             route:Route, 
             href:string, 
             normalizedTo:RouteLocation,
             resolved:Route
        };
        match (raw: RouteLocation, current?: Route, redirectedFrom?: RouteLocation): Route
        addRoute(route:RouteConfig,parentPath?:string);
        getRoutes():RouteRecordPublic[];
        onReady( done:()=>void, error?:()=>void ):void;
        onError( error?:()=>void ):void;
        constructor(options?:RouterOptions);
    }

    declare internal type Position = { 
        x: number,
        y: number
    };

    declare internal interface Dictionary<T> { 
        [key: string]: T 
    }

    declare internal type RouteLocation=string | { 
        name?:string, 
        path?:string,
        hash?: string,
        params?:Dictionary<string>,
        query?: Dictionary<string | (string | null)[] | null >,
        append?: boolean,
        replace?: boolean
    }

    declare internal type PositionResult = Position | { 
        selector: string,
        offset?: Position,
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
            savedPosition: Position
        ) => PositionResult | Promise<PositionResult> | null
    }

    declare type Route={
        path:string,
        params?:Dictionary<string>,
        query?:Dictionary<string | (string | null)[]>,
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
        components: Dictionary<Component>
        instances: Dictionary<Component>
        name?: string
        parent?: RouteRecord
        redirect?: RouteLocation | (to: Route) => RouteConfig
        matchAs?: string
        meta: {[key:string | number]:any}
        beforeEnter?: (
            route: Route,
            redirect: (location: RouteLocation) => void,
            next: () => void
        ) => any
        props:boolean | object | Dictionary<string | number | object>
    }

    declare interface RouteRecordPublic {
        path: string
        components: Dictionary<Component>
        instances: Dictionary<Component>
        name?: string
        redirect?: RouteLocation | (to: Route) => RouteConfig
        meta: any
        beforeEnter?: (
            route: Route,
            redirect: (location: RouteLocation) => void,
            next: () => void
        ) => any
        props: boolean | object | Dictionary<string | number | object>
    }

    declare interface RouteConfig{
        path: string
        component ?: Component | ()=>Component
        name?: string
        redirect?: RouteLocation | Function
        props?: boolean | {} | (name)=>any
        alias?: string | string[]
        children?: RouteConfig[]
        beforeEnter?: (to: Route, from: Route, next: ()=>void) => void
        meta?: any
        caseSensitive?: boolean
        pathToRegexpOptions?: object
    }

}
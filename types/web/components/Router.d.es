package web.components{

    @Import(Router = "vue-router")
    declare class Router{
        static const START_LOCATION:RouteConfig;
        mode:string;
        base:string;
        currentRoute:RouteConfig;
        push(location: RouteLocation, onComplete?:()=>void, onAbort?:()=>void):Promise<any>;
        replace(location: RouteLocation, onComplete?:()=>void, onAbort?:()=>void):Promise<any>;
        go( value?:number ):void;
        back():void;
        forward():void;
        beforeEach( callback:(to:Route, from:Route, next:()=>void) =>void );
        beforeResolve( callback:(to:Route, from:Route, next:()=>void) =>void );
        afterEach( callback:(to:Route, from:Route) =>void );
        getMatchedComponents( location?:RouteLocation ):Component[];
        resolve( location?:RouteLocation, current?, append? ):{ location:RouteLocation,route:Route, href:string};
        addRoute(route:RouteConfig,parentPath?:string);
        getRoutes():Route[];
        onReady( done:()=>void, error?:()=>void ):void;
        onError( error?:()=>void ):void;
    }

    declare type RouteLocation=string | { name?:string, path?:string, params?:{} }

    declare type Route={
        path:string,
        params?:{},
        query?:{},
        hash?:string,
        name?:string,
        redirectedFrom?:string,
        fullPath?:string,
        matched?:Route[],
    }

    declare type RouteConfig={
        path: string,
        component ?: Component,
        name?: string,
        components?: { [name:string]:Component }, 
        redirect?: RouteLocation | Function,
        props?: boolean | {} | (name)=>any,
        alias?: string | string[],
        children?: RouteConfig[],
        beforeEnter?: (to: Route, from: Route, next: ()=>void) => void,
        meta?: any,
        caseSensitive?: boolean, 
        pathToRegexpOptions?: object 
    }

}
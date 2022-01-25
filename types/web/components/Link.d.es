package web.components{
    import web.components.Component
    declare class Link extends Component{
        exact:boolean;
        activeClass:string;
        exactActiveClass:string;
        ariaCurrentValue:'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
        append:boolean;
        replace:boolean;
        tag:string;
        to:string;
        event:string[];
    }
}
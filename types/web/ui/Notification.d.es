package web.ui{

    @import(Notification = "element-ui/packages/notification")
    @Embed('element-ui/lib/theme-chalk/notification.css');
    @Embed('element-ui/lib/theme-chalk/icon.css');
    declare final class Notification{
        @Callable
        constructor(options:NotificationOptions);
        close():void;
        
        static closeAll():void;
        static success( options:NotificationOptions ):Notification;
        static warning( options:NotificationOptions ):Notification;
        static info( options:NotificationOptions ):Notification;
        static error( options:NotificationOptions ):Notification;
    }

    declare interface NotificationOptions {

        /** Title of the MessageBox */
        title?: string

        /** Content of the MessageBox */
        message: string | VNode | web.components.Component

        /** Message type, used for icon display */
        type?: 'success' | 'warning' | 'info' | 'error'

        dangerouslyUseHTMLString?:boolean;

        /** Custom icon's class */
        iconClass?: string

        /** Custom class name for MessageBox */
        customClass?: string

        duration?:number;
        offset?:number;

        position?:'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

        showClose?:boolean;

        onClose?:()=>void;
        onClick?:()=>void;
    }
}
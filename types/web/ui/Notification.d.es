package web.ui{
    @import(Notification = "element-ui/packages/notification")
    @Embed('element-ui/lib/theme-chalk/notification.css');
    @Embed('element-ui/lib/theme-chalk/icon.css');
    declare final class Notification{
        @Callable
        constructor(options:{title:string,message:string});
    }
}
package web.events{
    
    /**
    * 过渡事件名集合
    */
    class TransitionEvent{
        static const BEFORE_ENTER= 'before-enter'
        static const BEFORE_LEAVE= 'before-leave'
        static const BEFORE_APPEAR='before-appear'
        static const ENTER='enter'
        static const LEAVE='leave'
        static const APPEAR='appear'
        static const AFTER_ENTER='after-enter'
        static const AFTER_LEAVE='after-leave'
        static const AFTER_APPEAR='after-appear'
        static const ENTER_CANELLED='enter-cancelled'
        static const LEAVE_CANELLED= 'leave-cancelled'
        static const APPEAR_CANCELLED='appear-cancelled'
    }
}
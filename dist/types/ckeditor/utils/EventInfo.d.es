package ckeditor.utils;

/**
 * The event object passed to event callbacks. It is used to provide information about the event as well as a tool to
 * manipulate it.
 */
declare class EventInfo<TName extends string, TReturn = any> {
    /**
     * The object that fired the event.
     */
    const source: object;
    /**
     * The event name.
     */
    const name: TName;
    /**
     * Path this event has followed. See {@link module:utils/emittermixin~Emitter#delegate}.
     */
    path: Array<object>;
    
    /**
     * Stops the event emitter to call further callbacks for this event interaction.
     */
    const stop: {
        called?: boolean
    } | ()=>void;

    /**
     * Removes the current callback from future interactions of this event.
     */
    const off: {
        called?: boolean
    } | ()=>void;

    /**
     * The value which will be returned by {@link module:utils/emittermixin~Emitter#fire}.
     *
     * It's `undefined` by default and can be changed by an event listener:
     *
     * ```ts
     * dataController.fire( 'getSelectedContent', ( evt ) => {
     * 	// This listener will make `dataController.fire( 'getSelectedContent' )`
     * 	// always return an empty DocumentFragment.
     * 	evt.return = new DocumentFragment();
     *
     * 	// Make sure no other listeners are executed.
     * 	evt.stop();
     * } );
     * ```
     */
    return: TReturn | any;

    /**
     * @param source The emitter.
     * @param name The event name.
     */
    constructor(source: object, name: TName);
}

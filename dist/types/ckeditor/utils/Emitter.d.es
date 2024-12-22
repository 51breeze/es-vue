package ckeditor.utils;


/**
 * Emitter/listener interface.
 *
 * Can be easily implemented by a class by mixing the {@link module:utils/emittermixin~Emitter} mixin.
 *
 * ```ts
 * class MyClass extends EmitterMixin() {
 * 	// This class now implements the `Emitter` interface.
 * }
 * ```
 *
 * Read more about the usage of this interface in the:
 * * {@glink framework/architecture/core-editor-architecture#event-system-and-observables Event system and observables}
 * section of the {@glink framework/architecture/core-editor-architecture Core editor architecture} guide.
 * * {@glink framework/deep-dive/event-system Event system} deep-dive guide.
 */
declare interface Emitter {
    
    /**
     * Registers a callback function to be executed when an event is fired.
     *
     * Shorthand for {@link #listenTo `this.listenTo( this, event, callback, options )`} (it makes the emitter
     * listen on itself).
     *
     * @typeParam TEvent The type descibing the event. See {@link module:utils/emittermixin~BaseEvent}.
     * @param event The name of the event.
     * @param callback The function to be called on event.
     * @param options Additional options.
     */
    on(event: string, callback: GetCallback, options?:CallbackOptions): void;
    /**
     * Registers a callback function to be executed on the next time the event is fired only. This is similar to
     * calling {@link #on} followed by {@link #off} in the callback.
     *
     * @typeParam TEvent The type descibing the event. See {@link module:utils/emittermixin~BaseEvent}.
     * @param event The name of the event.
     * @param callback The function to be called on event.
     * @param options Additional options.
     */
    once(event: string, callback: GetCallback, options?:CallbackOptions): void;
    /**
     * Stops executing the callback on the given event.
     * Shorthand for {@link #stopListening `this.stopListening( this, event, callback )`}.
     *
     * @param event The name of the event.
     * @param callback The function to stop being called.
     */
    off(event: string, callback: Function): void;
    /**
     * Registers a callback function to be executed when an event is fired in a specific (emitter) object.
     *
     * Events can be grouped in namespaces using `:`.
     * When namespaced event is fired, it additionally fires all callbacks for that namespace.
     *
     * ```ts
     * // myEmitter.on( ... ) is a shorthand for myEmitter.listenTo( myEmitter, ... ).
     * myEmitter.on( 'myGroup', genericCallback );
     * myEmitter.on( 'myGroup:myEvent', specificCallback );
     *
     * // genericCallback is fired.
     * myEmitter.fire( 'myGroup' );
     * // both genericCallback and specificCallback are fired.
     * myEmitter.fire( 'myGroup:myEvent' );
     * // genericCallback is fired even though there are no callbacks for "foo".
     * myEmitter.fire( 'myGroup:foo' );
     * ```
     *
     * An event callback can {@link module:utils/eventinfo~EventInfo#stop stop the event} and
     * set the {@link module:utils/eventinfo~EventInfo#return return value} of the {@link #fire} method.
     *
     * @label BASE_EMITTER
     * @typeParam TEvent The type describing the event. See {@link module:utils/emittermixin~BaseEvent}.
     * @param emitter The object that fires the event.
     * @param event The name of the event.
     * @param callback The function to be called on event.
     * @param options Additional options.
     */
    listenTo(emitter: Emitter, event:string, callback: GetCallback, options?:CallbackOptions): void;
    /**
     * Stops listening for events. It can be used at different levels:
     *
     * * To stop listening to a specific callback.
     * * To stop listening to a specific event.
     * * To stop listening to all events fired by a specific object.
     * * To stop listening to all events fired by all objects.
     *
     * @label BASE_STOP
     * @param emitter The object to stop listening to. If omitted, stops it for all objects.
     * @param event (Requires the `emitter`) The name of the event to stop listening to. If omitted, stops it
     * for all events from `emitter`.
     * @param callback (Requires the `event`) The function to be removed from the call list for the given
     * `event`.
     */
    stopListening(emitter?: Emitter, event?: string, callback?: Function): void;
    /**
     * Fires an event, executing all callbacks registered for it.
     *
     * The first parameter passed to callbacks is an {@link module:utils/eventinfo~EventInfo} object,
     * followed by the optional `args` provided in the `fire()` method call.
     *
     * @typeParam TEvent The type describing the event. See {@link module:utils/emittermixin~BaseEvent}.
     * @param eventOrInfo The name of the event or `EventInfo` object if event is delegated.
     * @param args Additional arguments to be passed to the callbacks.
     * @returns By default the method returns `undefined`. However, the return value can be changed by listeners
     * through modification of the {@link module:utils/eventinfo~EventInfo#return `evt.return`}'s property (the event info
     * is the first param of every callback).
     */
    fire(eventOrInfo: any, ...args): any;
    /**
     * Delegates selected events to another {@link module:utils/emittermixin~Emitter}. For instance:
     *
     * ```ts
     * emitterA.delegate( 'eventX' ).to( emitterB );
     * emitterA.delegate( 'eventX', 'eventY' ).to( emitterC );
     * ```
     *
     * then `eventX` is delegated (fired by) `emitterB` and `emitterC` along with `data`:
     *
     * ```ts
     * emitterA.fire( 'eventX', data );
     * ```
     *
     * and `eventY` is delegated (fired by) `emitterC` along with `data`:
     *
     * ```ts
     * emitterA.fire( 'eventY', data );
     * ```
     *
     * @param events Event names that will be delegated to another emitter.
     */
    delegate(...events:string[]): EmitterMixinDelegateChain;

    /**
     * Stops delegating events. It can be used at different levels:
     *
     * * To stop delegating all events.
     * * To stop delegating a specific event to all emitters.
     * * To stop delegating a specific event to a specific emitter.
     *
     * @param event The name of the event to stop delegating. If omitted, stops it all delegations.
     * @param emitter (requires `event`) The object to stop delegating a particular event to.
     * If omitted, stops delegation of `event` to all emitters.
     */
    stopDelegating(event?: string, emitter?: Emitter): void;
}


/**
 * Utility type that gets the callback type for the given event.
 */
declare type GetCallback = (ev: any, ...args) => void;


/**
 * Additional options for registering a callback.
 */
declare interface CallbackOptions {

    name?: string
    args?: Array<any>
    return?:boolean
    eventInfo?:any

    /**
     * The priority of this event callback. The higher
     * the priority value the sooner the callback will be fired. Events having the same priority are called in the
     * order they were added.
     *
     * @defaultValue `'normal'`
     */
    const priority?: PriorityString;
}


/**
 * The return value of {@link ~Emitter#delegate}.
 */
declare interface EmitterMixinDelegateChain {
    /**
     * Selects destination for {@link module:utils/emittermixin~Emitter#delegate} events.
     *
     * @param emitter An `EmitterMixin` instance which is the destination for delegated events.
     * @param nameOrFunction A custom event name or function which converts the original name string.
     */
    to(emitter: Emitter, nameOrFunction?: string | ((name: string) => string)): void;
}

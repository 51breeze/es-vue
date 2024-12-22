package ckeditor.utils;


/**
 * Keystroke handler allows registering callbacks for given keystrokes.
 *
 * The most frequent use of this class is through the {@link module:core/editor/editor~Editor#keystrokes `editor.keystrokes`}
 * property. It allows listening to keystrokes executed in the editing view:
 *
 * ```ts
 * editor.keystrokes.set( 'Ctrl+A', ( keyEvtData, cancel ) => {
 * 	console.log( 'Ctrl+A has been pressed' );
 * 	cancel();
 * } );
 * ```
 *
 * However, this utility class can be used in various part of the UI. For instance, a certain {@link module:ui/view~View}
 * can use it like this:
 *
 * ```ts
 * class MyView extends View {
 * 	constructor() {
 * 		this.keystrokes = new KeystrokeHandler();
 *
 * 		this.keystrokes.set( 'tab', handleTabKey );
 * 	}
 *
 * 	render() {
 * 		super.render();
 *
 * 		this.keystrokes.listenTo( this.element );
 * 	}
 * }
 * ```
 *
 * That keystroke handler will listen to `keydown` events fired in this view's main element.
 *
 */
declare class KeystrokeHandler {
    /**
     * Starts listening for `keydown` events from a given emitter.
     */
    listenTo(emitter: Emitter | HTMLElement | Window): void;
    /**
     * Registers a handler for the specified keystroke.
     *
     * @param keystroke Keystroke defined in a format accepted by
     * the {@link module:utils/keyboard~parseKeystroke} function.
     * @param callback A function called with the
     * {@link module:engine/view/observer/keyobserver~KeyEventData key event data} object and
     * a helper function to call both `preventDefault()` and `stopPropagation()` on the underlying event.
     * @param options Additional options.
     * @param options.priority The priority of the keystroke
     * callback. The higher the priority value the sooner the callback will be executed. Keystrokes having the same priority
     * are called in the order they were added.
     */
    set(keystroke: string | (string | number)[], callback: (ev: KeyboardEvent, cancel: () => void) => void, options?: {
        priority?: PriorityString
    }): void;

    /**
     * Triggers a keystroke handler for a specified key combination, if such a keystroke was {@link #set defined}.
     *
     * @param keyEvtData Key event data.
     * @returns Whether the keystroke was handled.
     */
    press(keyEvtData: ReadonlyKeystrokeInfo): boolean;

    /**
     * Stops listening to `keydown` events from the given emitter.
     */
    stopListening(emitter?: Emitter | HTMLElement | Window): void;
    
    /**
     * Destroys the keystroke handler.
     */
    destroy(): void;
}

package ckeditor.engine;
/**
* A controller for the editing pipeline. The editing pipeline controls the {@link ~EditingController#model model} rendering,
* including selection handling. It also creates the {@link ~EditingController#view view} which builds a
* browser-independent virtualization over the DOM elements. The editing controller also attaches default converters.
*/
declare class EditingController {
    /**
    * Editor model.
    */
    const model: any;
    /**
    * Editing view controller.
    */
    const view: any;
    /**
    * A mapper that describes the model-view binding.
    */
    const mapper: any;
    /**
    * Downcast dispatcher that converts changes from the model to the {@link #view editing view}.
    */
    const downcastDispatcher: any;
    /**
    * Creates an editing controller instance.
    *
    * @param model Editing model.
    * @param stylesProcessor The styles processor instance.
    */
    constructor(model: any, stylesProcessor: any);
    /**
    * Removes all event listeners attached to the `EditingController`. Destroys all objects created
    * by `EditingController` that need to be destroyed.
    */
    destroy(): void;
    /**
    * Calling this method will refresh the marker by triggering the downcast conversion for it.
    *
    * Reconverting the marker is useful when you want to change its {@link module:engine/view/element~Element view element}
    * without changing any marker data. For instance:
    *
    * ```ts
    * let isCommentActive = false;
    *
    * model.conversion.markerToHighlight( {
    * 	model: 'comment',
    * 	view: data => {
    * 		const classes = [ 'comment-marker' ];
    *
    * 		if ( isCommentActive ) {
    * 			classes.push( 'comment-marker--active' );
    * 		}
    *
    * 		return { classes };
    * 	}
    * } );
    *
    * // ...
    *
    * // Change the property that indicates if marker is displayed as active or not.
    * isCommentActive = true;
    *
    * // Reconverting will downcast and synchronize the marker with the new isCommentActive state value.
    * editor.editing.reconvertMarker( 'comment' );
    * ```
    *
    * **Note**: If you want to reconvert a model item, use {@link #reconvertItem} instead.
    *
    * @param markerOrName Name of a marker to update, or a marker instance.
    */
    reconvertMarker(markerOrName: any): void;
    /**
    * Calling this method will downcast a model item on demand (by requesting a refresh in the {@link module:engine/model/differ~Differ}).
    *
    * You can use it if you want the view representation of a specific item updated as a response to external modifications. For instance,
    * when the view structure depends not only on the associated model data but also on some external state.
    *
    * **Note**: If you want to reconvert a model marker, use {@link #reconvertMarker} instead.
    *
    * @param item Item to refresh.
    */
    reconvertItem(item: any): void;
}
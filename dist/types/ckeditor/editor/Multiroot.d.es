package ckeditor.editor;

import ckeditor.core.Editor;

/**
 * The {@glink installation/getting-started/predefined-builds#classic-editor classic editor} implementation.
 * It uses an inline editable and a sticky toolbar, all enclosed in a boxed UI.
 * See the {@glink examples/builds/classic-editor demo}.
 *
 * In order to create a classic editor instance, use the static
 * {@link module:editor-classic/classiceditor~ClassicEditor.create `ClassicEditor.create()`} method.
 *
 * # Classic editor and classic build
 *
 * The classic editor can be used directly from source (if you installed the
 * [`@ckeditor/ckeditor5-editor-classic`](https://www.npmjs.com/package/@ckeditor/ckeditor5-editor-classic) package)
 * but it is also available in the {@glink installation/getting-started/predefined-builds#classic-editor classic build}.
 *
 * {@glink installation/getting-started/predefined-builds Builds}
 * are ready-to-use editors with plugins bundled in. When using the editor from
 * source you need to take care of loading all plugins by yourself
 * (through the {@link module:core/editor/editorconfig~EditorConfig#plugins `config.plugins`} option).
 * Using the editor from source gives much better flexibility and allows easier customization.
 *
 * Read more about initializing the editor from source or as a build in
 * {@link module:editor-classic/classiceditor~ClassicEditor.create `ClassicEditor.create()`}.
 */

import {MultiRootEditor as Multiroot} from '@ckeditor/ckeditor5-editor-multi-root'
declare class Multiroot extends Editor<Multiroot>{

    /**
     * Destroys the editor instance, releasing all resources used by it.
     *
     * Updates the original editor element with the data if the
     * {@link module:core/editor/editorconfig~EditorConfig#updateSourceElementOnDestroy `updateSourceElementOnDestroy`}
     * configuration option is set to `true`.
     *
     * **Note**: The multi-root editor does not remove the toolbar and editable when destroyed. You can
     * do that yourself in the destruction chain, if you need to:
     *
     * ```ts
     * editor.destroy().then( () => {
     * 	// Remove the toolbar from DOM.
     * 	editor.ui.view.toolbar.element.remove();
     *
     * 	// Remove editable elements from DOM.
     * 	for ( const editable of Object.values( editor.ui.view.editables ) ) {
     * 	    editable.element.remove();
     * 	}
     *
     * 	console.log( 'Editor was destroyed' );
     * } );
     * ```
     */
    destroy(): Promise<any>;
    /**
     * Adds a new root to the editor.
     *
     * ```ts
     * editor.addRoot( 'myRoot', { data: '<p>Initial root data.</p>' } );
     * ```
     *
     * After a root is added, you will be able to modify and retrieve its data.
     *
     * All root names must be unique. An error will be thrown if you will try to create a root with the name same as
     * an already existing, attached root. However, you can call this method for a detached root. See also {@link #detachRoot}.
     *
     * Whenever a root is added, the editor instance will fire {@link #event:addRoot `addRoot` event}. The event is also called when
     * the root is added indirectly, e.g. by the undo feature or on a remote client during real-time collaboration.
     *
     * Note, that this method only adds a root to the editor model. It **does not** create a DOM editable element for the new root.
     * Until such element is created (and attached to the root), the root is "virtual": it is not displayed anywhere and its data can
     * be changed only using the editor API.
     *
     * To create a DOM editable element for the root, listen to {@link #event:addRoot `addRoot` event} and call {@link #createEditable}.
     * Then, insert the DOM element in a desired place, that will depend on the integration with your application and your requirements.
     *
     * ```ts
     * editor.on( 'addRoot', ( evt, root ) => {
     * 	const editableElement = editor.createEditable( root );
     *
     * 	// You may want to create a more complex DOM structure here.
     * 	//
     * 	// Alternatively, you may want to create a DOM structure before
     * 	// calling `editor.addRoot()` and only append `editableElement` at
     * 	// a proper place.
     *
     * 	document.querySelector( '#editors' ).appendChild( editableElement );
     * } );
     *
     * // ...
     *
     * editor.addRoot( 'myRoot' ); // Will create a root, a DOM editable element and append it to `#editors` container element.
     * ```
     *
     * You can set root attributes on the new root while you add it:
     *
     * ```ts
     * // Add a collapsed root at fourth position from top.
     * // Keep in mind that these are just examples of attributes. You need to provide your own features that will handle the attributes.
     * editor.addRoot( 'myRoot', { attributes: { isCollapsed: true, index: 4 } } );
     * ```
     *
     * See also {@link module:core/editor/editorconfig~EditorConfig#rootsAttributes `rootsAttributes` configuration option}.
     *
     * Note that attributes keys of attributes added in `attributes` option are also included in {@link #getRootsAttributes} return value.
     *
     * By setting `isUndoable` flag to `true`, you can allow for detaching the root using the undo feature.
     *
     * Additionally, you can group adding multiple roots in one undo step. This can be useful if you add multiple roots that are
     * combined into one, bigger UI element, and want them all to be undone together.
     *
     * ```ts
     * let rowId = 0;
     *
     * editor.model.change( () => {
     * 	editor.addRoot( 'left-row-' + rowId, { isUndoable: true } );
     * 	editor.addRoot( 'center-row-' + rowId, { isUndoable: true } );
     * 	editor.addRoot( 'right-row-' + rowId, { isUndoable: true } );
     *
     * 	rowId++;
     * } );
     * ```
     *
     * @param rootName Name of the root to add.
     * @param options Additional options for the added root.
     */
    addRoot(rootName: string, options?): void;
    /**
     * Detaches a root from the editor.
     *
     * ```ts
     * editor.detachRoot( 'myRoot' );
     * ```
     *
     * A detached root is not entirely removed from the editor model, however it can be considered removed.
     *
     * After a root is detached all its children are removed, all markers inside it are removed, and whenever something is inserted to it,
     * it is automatically removed as well. Finally, a detached root is not returned by
     * {@link module:engine/model/document~Document#getRootNames} by default.
     *
     * It is possible to re-add a previously detached root calling {@link #addRoot}.
     *
     * Whenever a root is detached, the editor instance will fire {@link #event:detachRoot `detachRoot` event}. The event is also
     * called when the root is detached indirectly, e.g. by the undo feature or on a remote client during real-time collaboration.
     *
     * Note, that this method only detached a root in the editor model. It **does not** destroy the DOM editable element linked with
     * the root and it **does not** remove the DOM element from the DOM structure of your application.
     *
     * To properly remove a DOM editable element after a root was detached, listen to {@link #event:detachRoot `detachRoot` event}
     * and call {@link #detachEditable}. Then, remove the DOM element from your application.
     *
     * ```ts
     * editor.on( 'detachRoot', ( evt, root ) => {
     * 	const editableElement = editor.detachEditable( root );
     *
     * 	// You may want to do an additional DOM clean-up here.
     *
     * 	editableElement.remove();
     * } );
     *
     * // ...
     *
     * editor.detachRoot( 'myRoot' ); // Will detach the root, and remove the DOM editable element.
     * ```
     *
     * By setting `isUndoable` flag to `true`, you can allow for re-adding the root using the undo feature.
     *
     * Additionally, you can group detaching multiple roots in one undo step. This can be useful if the roots are combined into one,
     * bigger UI element, and you want them all to be re-added together.
     *
     * ```ts
     * editor.model.change( () => {
     * 	editor.detachRoot( 'left-row-3', true );
     * 	editor.detachRoot( 'center-row-3', true );
     * 	editor.detachRoot( 'right-row-3', true );
     * } );
     * ```
     *
     * @param rootName Name of the root to detach.
     * @param isUndoable Whether detaching the root can be undone (using the undo feature) or not.
     */
    detachRoot(rootName: string, isUndoable?: boolean): void;
    /**
     * Creates and returns a new DOM editable element for the given root element.
     *
     * The new DOM editable is attached to the model root and can be used to modify the root content.
     *
     * @param root Root for which the editable element should be created.
     * @param placeholder Placeholder for the editable element. If not set, placeholder value from the
     * {@link module:core/editor/editorconfig~EditorConfig#placeholder editor configuration} will be used (if it was provided).
     * @returns The created DOM element. Append it in a desired place in your application.
     */
    createEditable(root: any, placeholder?: string): HTMLElement;
    /**
     * Detaches the DOM editable element that was attached to the given root.
     *
     * @param root Root for which the editable element should be detached.
     * @returns The DOM element that was detached. You may want to remove it from your application DOM structure.
     */
    detachEditable(root: any): HTMLElement;
    /**
     * Loads a root that has previously been declared in {@link module:core/editor/editorconfig~EditorConfig#lazyRoots `lazyRoots`}
     * configuration option.
     *
     * Only roots specified in the editor config can be loaded. A root cannot be loaded multiple times. A root cannot be unloaded and
     * loading a root cannot be reverted using the undo feature.
     *
     * When a root becomes loaded, it will be treated by the editor as though it was just added. This, among others, means that all
     * related events and mechanisms will be fired, including {@link ~MultiRootEditor#event:addRoot `addRoot` event},
     * {@link module:engine/model/document~Document#event:change `model.Document` `change` event}, model post-fixers and conversion.
     *
     * Until the root becomes loaded, all above mechanisms are suppressed.
     *
     * This method is {@link module:utils/observablemixin~Observable#decorate decorated}.
     *
     * When this method is used in real-time collaboration environment, its effects become asynchronous as the editor will first synchronize
     * with the remote editing session, before the root is added to the editor.
     *
     * If the root has been already loaded by any other client, the additional data passed in `loadRoot()` parameters will be ignored.
     *
     * @param rootName Name of the root to load.
     * @param options Additional options for the loaded root.
     * @fires loadRoot
     */
    loadRoot(rootName: string, options?): void;
    /**
     * Returns the document data for all attached roots.
     *
     * @param options Additional configuration for the retrieved data.
     * Editor features may introduce more configuration options that can be set through this parameter.
     * @param options.trim Whether returned data should be trimmed. This option is set to `'empty'` by default,
     * which means that whenever editor content is considered empty, an empty string is returned. To turn off trimming
     * use `'none'`. In such cases exact content will be returned (for example `'<p>&nbsp;</p>'` for an empty editor).
     * @returns The full document data.
     */
    getFullData(options?: {[key:string]:string}): {[key:string]:string};
    /**
     * Returns attributes for all attached roots.
     *
     * Note: only attributes specified in {@link module:core/editor/editorconfig~EditorConfig#rootsAttributes `rootsAttributes`}
     * configuration option will be returned.
     *
     * @returns Object with roots attributes. Keys are roots names, while values are attributes set on given root.
     */
    getRootsAttributes(): {[key:string]:any};
    /**
     * Returns attributes for the specified root.
     *
     * Note: only attributes specified in {@link module:core/editor/editorconfig~EditorConfig#rootsAttributes `rootsAttributes`}
     * configuration option will be returned.
     *
     * @param rootName
     */
    getRootAttributes(rootName: string): any;
    /**
     * Switches given editor root to the read-only mode.
     *
     * In contrary to {@link module:core/editor/editor~Editor#enableReadOnlyMode `enableReadOnlyMode()`}, which switches the whole editor
     * to the read-only mode, this method turns only a particular root to the read-only mode. This can be useful when you want to prevent
     * editing only a part of the editor content.
     *
     * When you switch a root to the read-only mode, you need provide a unique identifier (`lockId`) that will identify this request. You
     * will need to provide the same `lockId` when you will want to
     * {@link module:editor-multi-root/multirooteditor~MultiRootEditor#enableRoot re-enable} the root.
     *
     * ```ts
     * const model = editor.model;
     * const myRoot = model.document.getRoot( 'myRoot' );
     *
     * editor.disableRoot( 'myRoot', 'my-lock' );
     * model.canEditAt( myRoot ); // `false`
     *
     * editor.disableRoot( 'myRoot', 'other-lock' );
     * editor.disableRoot( 'myRoot', 'other-lock' ); // Multiple locks with the same ID have no effect.
     * model.canEditAt( myRoot ); // `false`
     *
     * editor.enableRoot( 'myRoot', 'my-lock' );
     * model.canEditAt( myRoot ); // `false`
     *
     * editor.enableRoot( 'myRoot', 'other-lock' );
     * model.canEditAt( myRoot ); // `true`
     * ```
     *
     * See also {@link module:core/editor/editor~Editor#enableReadOnlyMode `Editor#enableReadOnlyMode()`} and
     * {@link module:editor-multi-root/multirooteditor~MultiRootEditor#enableRoot `MultiRootEditor#enableRoot()`}.
     *
     * @param rootName Name of the root to switch to read-only mode.
     * @param lockId A unique ID for setting the editor to the read-only state.
     */
    disableRoot(rootName: string, lockId: string): void;

    /**
     * Removes given read-only lock from the given root.
     *
     * See {@link module:editor-multi-root/multirooteditor~MultiRootEditor#disableRoot `disableRoot()`}.
     *
     * @param rootName Name of the root to switch back from the read-only mode.
     * @param lockId A unique ID for setting the editor to the read-only state.
     */
    enableRoot(rootName: string, lockId: string): void;

}
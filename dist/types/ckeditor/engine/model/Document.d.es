package ckeditor.model;

import ckeditor.utils.Collection;

/**
 * Data model's document. It contains the model's structure, its selection and the history of changes.
 *
 * Read more about working with the model in
 * {@glink framework/architecture/editing-engine#model introduction to the the editing engine's architecture}.
 *
 * Usually, the document contains just one {@link module:engine/model/document~Document#roots root element}, so
 * you can retrieve it by just calling {@link module:engine/model/document~Document#getRoot} without specifying its name:
 *
 * ```ts
 * model.document.getRoot(); // -> returns the main root
 * ```
 *
 * However, the document may contain multiple roots – e.g. when the editor has multiple editable areas
 * (e.g. a title and a body of a message).
 */
declare class Document{
    /**
     * The {@link module:engine/model/model~Model model} that the document is a part of.
     */
    const model: Model;
    /**
     * The document's history.
     */
     const history: History;
    /**
     * The selection in this document.
     */
     const selection: DocumentSelection;
    /**
     * A list of roots that are owned and managed by this document. Use {@link #createRoot}, {@link #getRoot} and
     * {@link #getRootNames} to manipulate it.
     */
     const roots: Collection<RootElement>;
    /**
     * The model differ object. Its role is to buffer changes done on the model document and then calculate a diff of those changes.
     */
     const differ: Differ;
    /**
     * Defines whether the document is in a read-only mode.
     *
     * The user should not be able to change the data of a document that is read-only.
     *
     * @readonly
     */
     const isReadOnly: boolean;
    
    /**
     * Creates an empty document instance with no {@link #roots} (other than
     * the {@link #graveyard graveyard root}).
     */
    constructor(model: Model);
    /**
     * The document version. Every applied operation increases the version number. It is used to
     * ensure that operations are applied on a proper document version.
     *
     * This property is equal to {@link module:engine/model/history~History#version `model.Document#history#version`}.
     *
     * If the {@link module:engine/model/operation/operation~Operation#baseVersion base version} does not match the document version,
     * a {@link module:utils/ckeditorerror~CKEditorError model-document-applyoperation-wrong-version} error is thrown.
     */
    get version(): number;
    set version(version: number);
    /**
     * The graveyard tree root. A document always has a graveyard root that stores removed nodes.
     */
    get graveyard(): RootElement;
    /**
     * Creates a new root.
     *
     * **Note:** do not use this method after the editor has been initialized! If you want to dynamically add a root, use
     * {@link module:engine/model/writer~Writer#addRoot `model.Writer#addRoot`} instead.
     *
     * @param elementName The element name. Defaults to `'$root'` which also has some basic schema defined
     * (e.g. `$block` elements are allowed inside the `$root`). Make sure to define a proper schema if you use a different name.
     * @param rootName A unique root name.
     * @returns The created root.
     */
    createRoot(elementName?: string, rootName?: string): RootElement;
    /**
     * Removes all event listeners set by the document instance.
     */
    destroy(): void;
    /**
     * Returns a root by its name.
     *
     * Detached roots are returned by this method. This is to be able to operate on the detached root (for example, to be able to create
     * a position inside such a root for undo feature purposes).
     *
     * @param name The root name of the root to return.
     * @returns The root registered under a given name or `null` when there is no root with the given name.
     */
    getRoot(name?: string): RootElement | null;
    /**
     * Returns an array with names of all roots added to the document (except the {@link #graveyard graveyard root}).
     *
     * Detached roots **are not** returned by this method by default. This is to make sure that all features or algorithms that operate
     * on the document data know which roots are still a part of the document and should be processed.
     *
     * @param includeDetached Specified whether detached roots should be returned as well.
     */
    getRootNames(includeDetached?: boolean): Array<string>;
    /**
     * Returns an array with all roots added to the document (except the {@link #graveyard graveyard root}).
     *
     * Detached roots **are not** returned by this method by default. This is to make sure that all features or algorithms that operate
     * on the document data know which roots are still a part of the document and should be processed.
     *
     * @param includeDetached Specified whether detached roots should be returned as well.
     */
    getRoots(includeDetached?: boolean): Array<RootElement>;
    /**
     * Used to register a post-fixer callback. A post-fixer mechanism guarantees that the features
     * will operate on a correct model state.
     *
     * An execution of a feature may lead to an incorrect document tree state. The callbacks are used to fix the document tree after
     * it has changed. Post-fixers are fired just after all changes from the outermost change block were applied but
     * before the {@link module:engine/model/document~Document#event:change change event} is fired. If a post-fixer callback made
     * a change, it should return `true`. When this happens, all post-fixers are fired again to check if something else should
     * not be fixed in the new document tree state.
     *
     * As a parameter, a post-fixer callback receives a {@link module:engine/model/writer~Writer writer} instance connected with the
     * executed changes block. Thanks to that, all changes done by the callback will be added to the same
     * {@link module:engine/model/batch~Batch batch} (and undo step) as the original changes. This makes post-fixer changes transparent
     * for the user.
     *
     * An example of a post-fixer is a callback that checks if all the data were removed from the editor. If so, the
     * callback should add an empty paragraph so that the editor is never empty:
     *
     * ```ts
     * document.registerPostFixer( writer => {
     * 	const changes = document.differ.getChanges();
     *
     * 	// Check if the changes lead to an empty root in the editor.
     * 	for ( const entry of changes ) {
     * 		if ( entry.type == 'remove' && entry.position.root.isEmpty ) {
     * 			writer.insertElement( 'paragraph', entry.position.root, 0 );
     *
     * 			// It is fine to return early, even if multiple roots would need to be fixed.
     * 			// All post-fixers will be fired again, so if there are more empty roots, those will be fixed, too.
     * 			return true;
     * 		}
     * 	}
     *
     * 	return false;
     * } );
     * ```
     */
    registerPostFixer(postFixer: ModelPostFixer): void;
    /**
     * A custom `toJSON()` method to solve child-parent circular dependencies.
     *
     * @returns A clone of this object with the document property changed to a string.
     */
    toJSON(): any;
}


/**
 * Callback passed as an argument to the {@link module:engine/model/document~Document#registerPostFixer} method.
 */
declare type ModelPostFixer = (writer: Writer) => boolean;


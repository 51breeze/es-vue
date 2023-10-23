package ckeditor.core;

import ckeditor.utils.Config
import ckeditor.utils.Locale
import ckeditor.utils.LocaleTranslate
import ckeditor.engine.Conversion;
import ckeditor.engine.DataController;
import ckeditor.engine.EditingController;
import ckeditor.ui.EditorUI;

declare interface IEditor{

    /**
    * Commands registered to the editor.
    *
    * Use the shorthand {@link #execute `editor.execute()`} method to execute commands:
    *
    * ```ts
    * // Execute the bold command:
    * editor.execute( 'bold' );
    *
    * // Check the state of the bold command:
    * editor.commands.get( 'bold' ).value;
    * ```
    */
    const commands: CommandCollection;
    /**
    * Stores all configurations specific to this editor instance.
    *
    * ```ts
    * editor.config.get( 'image.toolbar' );
    * // -> [ 'imageStyle:block', 'imageStyle:side', '|', 'toggleImageCaption', 'imageTextAlternative' ]
    * ```
    */
    const config: Config<EditorConfig>;
    /**
    * Conversion manager through which you can register model-to-view and view-to-model converters.
    *
    * See the {@link module:engine/conversion/conversion~Conversion} documentation to learn how to add converters.
    */
    const conversion: Conversion;
    /**
    * The {@link module:engine/controller/datacontroller~DataController data controller}.
    * Used e.g. for setting and retrieving the editor data.
    */
    const data: DataController;
    /**
    * The {@link module:engine/controller/editingcontroller~EditingController editing controller}.
    * Controls user input and rendering the content for editing.
    */
    const editing: EditingController;
    /**
    * The locale instance.
    */
    const locale: Locale;
    /**
    * The editor's model.
    *
    * The central point of the editor's abstract data model.
    */
    const model: any;
    /**
    * The plugins loaded and in use by this editor instance.
    *
    * ```ts
    * editor.plugins.get( 'ClipboardPipeline' ); // -> An instance of the clipboard pipeline plugin.
    * ```
    */
    const plugins: PluginCollection<IEditor>;
    /**
    * An instance of the {@link module:core/editingkeystrokehandler~EditingKeystrokeHandler}.
    *
    * It allows setting simple keystrokes:
    *
    * ```ts
    * // Execute the bold command on Ctrl+E:
    * editor.keystrokes.set( 'Ctrl+E', 'bold' );
    *
    * // Execute your own callback:
    * editor.keystrokes.set( 'Ctrl+E', ( data, cancel ) => {
    * 	console.log( data.keyCode );
    *
    * 	// Prevent the default (native) action and stop the underlying keydown event
    * 	// so no other editor feature will interfere.
    * 	cancel();
    * } );
    * ```
    *
    * Note: Certain typing-oriented keystrokes (like <kbd>Backspace</kbd> or <kbd>Enter</kbd>) are handled
    * by a low-level mechanism and trying to listen to them via the keystroke handler will not work reliably.
    * To handle these specific keystrokes, see the events fired by the
    * {@link module:engine/view/document~Document editing view document} (`editor.editing.view.document`).
    */
    const keystrokes: EditingKeystrokeHandler;
    /**
    * Shorthand for {@link module:utils/locale~Locale#t}.
    *
    * @see module:utils/locale~Locale#t
    */
    const t: LocaleTranslate;
    const id: string;
    /**
    * Indicates the editor life-cycle state.
    *
    * The editor is in one of the following states:
    *
    * * `initializing` &ndash; During the editor initialization (before
    * {@link module:core/editor/editor~Editor.create `Editor.create()`}) finished its job.
    * * `ready` &ndash; After the promise returned by the {@link module:core/editor/editor~Editor.create `Editor.create()`}
    * method is resolved.
    * * `destroyed` &ndash; Once the {@link #destroy `editor.destroy()`} method was called.
    *
    * @observable
    */
    state: 'initializing' | 'ready' | 'destroyed';
    /**
    * The default configuration which is built into the editor class.
    *
    * It is used in CKEditor 5 builds to provide the default configuration options which are later used during the editor initialization.
    *
    * ```ts
    * ClassicEditor.defaultConfig = {
    * 	foo: 1,
    * 	bar: 2
    * };
    *
    * ClassicEditor
    * 	.create( sourceElement )
    * 	.then( editor => {
    * 		editor.config.get( 'foo' ); // -> 1
    * 		editor.config.get( 'bar' ); // -> 2
    * 	} );
    *
    * // The default options can be overridden by the configuration passed to create().
    * ClassicEditor
    * 	.create( sourceElement, { bar: 3 } )
    * 	.then( editor => {
    * 		editor.config.get( 'foo' ); // -> 1
    * 		editor.config.get( 'bar' ); // -> 3
    * 	} );
    * ```
    *
    * See also {@link module:core/editor/editor~Editor.builtinPlugins}.
    */
    static defaultConfig?: EditorConfig;
    /**
    * An array of plugins built into this editor class.
    *
    * It is used in CKEditor 5 builds to provide a list of plugins which are later automatically initialized
    * during the editor initialization.
    *
    * They will be automatically initialized by the editor, unless listed in `config.removePlugins` and
    * unless `config.plugins` is passed.
    *
    * ```ts
    * // Build some plugins into the editor class first.
    * ClassicEditor.builtinPlugins = [ FooPlugin, BarPlugin ];
    *
    * // Normally, you need to define config.plugins, but since ClassicEditor.builtinPlugins was
    * // defined, now you can call create() without any configuration.
    * ClassicEditor
    * 	.create( sourceElement )
    * 	.then( editor => {
    * 		editor.plugins.get( FooPlugin ); // -> An instance of the Foo plugin.
    * 		editor.plugins.get( BarPlugin ); // -> An instance of the Bar plugin.
    * 	} );
    *
    * ClassicEditor
    * 	.create( sourceElement, {
    * 		// Do not initialize these plugins (note: it is defined by a string):
    * 		removePlugins: [ 'Foo' ]
    * 	} )
    * 	.then( editor => {
    * 		editor.plugins.get( FooPlugin ); // -> Undefined.
    * 		editor.config.get( BarPlugin ); // -> An instance of the Bar plugin.
    * 	} );
    *
    * ClassicEditor
    * 	.create( sourceElement, {
    * 		// Load only this plugin. It can also be defined by a string if
    * 		// this plugin was built into the editor class.
    * 		plugins: [ FooPlugin ]
    * 	} )
    * 	.then( editor => {
    * 		editor.plugins.get( FooPlugin ); // -> An instance of the Foo plugin.
    * 		editor.config.get( BarPlugin ); // -> Undefined.
    * 	} );
    * ```
    *
    * See also {@link module:core/editor/editor~Editor.defaultConfig}.
    */
    static builtinPlugins?: Array<PluginConstructor<IEditor>>;

    /**
    * The editor UI instance.
    */
    get ui(): EditorUI;
    
    /**
    * Creates a new instance of the editor class.
    *
    * Usually, not to be used directly. See the static {@link module:core/editor/editor~Editor.create `create()`} method.
    *
    * @param config The editor configuration.
    */
    constructor(config?: EditorConfig);

    /**
    * Defines whether the editor is in the read-only mode.
    *
    * In read-only mode the editor {@link #commands commands} are disabled so it is not possible
    * to modify the document by using them. Also, the editable element(s) become non-editable.
    *
    * In order to make the editor read-only, you need to call the {@link #enableReadOnlyMode} method:
    *
    * ```ts
    * editor.enableReadOnlyMode( 'feature-id' );
    * ```
    *
    * Later, to turn off the read-only mode, call {@link #disableReadOnlyMode}:
    *
    * ```ts
    * editor.disableReadOnlyMode( 'feature-id' );
    * ```
    *
    * @readonly
    * @observable
    */
    get isReadOnly(): boolean;
    set isReadOnly(value: boolean);
    /**
    * Turns on the read-only mode in the editor.
    *
    * Editor can be switched to or out of the read-only mode by many features, under various circumstances. The editor supports locking
    * mechanism for the read-only mode. It enables easy control over the read-only mode when many features wants to turn it on or off at
    * the same time, without conflicting with each other. It guarantees that you will not make the editor editable accidentally (which
    * could lead to errors).
    *
    * Each read-only mode request is identified by a unique id (also called "lock"). If multiple plugins requested to turn on the
    * read-only mode, then, the editor will become editable only after all these plugins turn the read-only mode off (using the same ids).
    *
    * Note, that you cannot force the editor to disable the read-only mode if other plugins set it.
    *
    * After the first `enableReadOnlyMode()` call, the {@link #isReadOnly `isReadOnly` property} will be set to `true`:
    *
    * ```ts
    * editor.isReadOnly; // `false`.
    * editor.enableReadOnlyMode( 'my-feature-id' );
    * editor.isReadOnly; // `true`.
    * ```
    *
    * You can turn off the read-only mode ("clear the lock") using the {@link #disableReadOnlyMode `disableReadOnlyMode()`} method:
    *
    * ```ts
    * editor.enableReadOnlyMode( 'my-feature-id' );
    * // ...
    * editor.disableReadOnlyMode( 'my-feature-id' );
    * editor.isReadOnly; // `false`.
    * ```
    *
    * All "locks" need to be removed to enable editing:
    *
    * ```ts
    * editor.enableReadOnlyMode( 'my-feature-id' );
    * editor.enableReadOnlyMode( 'my-other-feature-id' );
    * // ...
    * editor.disableReadOnlyMode( 'my-feature-id' );
    * editor.isReadOnly; // `true`.
    * editor.disableReadOnlyMode( 'my-other-feature-id' );
    * editor.isReadOnly; // `false`.
    * ```
    *
    * @param lockId A unique ID for setting the editor to the read-only state.
    */
    enableReadOnlyMode(lockId: string): void;
    /**
    * Removes the read-only lock from the editor with given lock ID.
    *
    * When no lock is present on the editor anymore, then the {@link #isReadOnly `isReadOnly` property} will be set to `false`.
    *
    * @param lockId The lock ID for setting the editor to the read-only state.
    */
    disableReadOnlyMode(lockId: string): void;
    /**
    * Loads and initializes plugins specified in the configuration.
    *
    * @returns A promise which resolves once the initialization is completed, providing an array of loaded plugins.
    */
    initPlugins(): Promise<LoadedPlugins>;
    /**
    * Destroys the editor instance, releasing all resources used by it.
    *
    * **Note** The editor cannot be destroyed during the initialization phase so if it is called
    * while the editor {@link #state is being initialized}, it will wait for the editor initialization before destroying it.
    *
    * @fires destroy
    * @returns A promise that resolves once the editor instance is fully destroyed.
    */
    destroy(): Promise<any>;
    /**
    * Executes the specified command with given parameters.
    *
    * Shorthand for:
    *
    * ```ts
    * editor.commands.get( commandName ).execute( ... );
    * ```
    *
    * @param commandName The name of the command to execute.
    * @param commandParams Command parameters.
    * @returns The value returned by the {@link module:core/commandcollection~CommandCollection#execute `commands.execute()`}.
    */
    execute(commandName: string, ...commandParams): any;
    /**
    * Focuses the editor.
    *
    * **Note** To explicitly focus the editing area of the editor, use the
    * {@link module:engine/view/view~View#focus `editor.editing.view.focus()`} method of the editing view.
    *
    * Check out the {@glink framework/deep-dive/ui/focus-tracking#focus-in-the-editor-ui Focus in the editor UI} section
    * of the {@glink framework/deep-dive/ui/focus-tracking Deep dive into focus tracking} guide to learn more.
    */
    focus(): void;

    /**
    * Creates and initializes a new editor instance.
    *
    * This is an abstract method. Every editor type needs to implement its own initialization logic.
    *
    * See the `create()` methods of the existing editor types to learn how to use them:
    *
    * * {@link module:editor-classic/classiceditor~ClassicEditor.create `ClassicEditor.create()`}
    * * {@link module:editor-balloon/ballooneditor~BalloonEditor.create `BalloonEditor.create()`}
    * * {@link module:editor-decoupled/decouplededitor~DecoupledEditor.create `DecoupledEditor.create()`}
    * * {@link module:editor-inline/inlineeditor~InlineEditor.create `InlineEditor.create()`}
    */
    //static create(...args): void;
    
}
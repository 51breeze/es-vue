package ckeditor.core;

/**
* The base class for CKEditor plugin classes.
*/
declare class Plugin implements PluginInterface {

    /**
    * The editor instance.
    *
    * Note that most editors implement the {@link module:core/editor/editor~Editor#ui} property.
    * However, editors with an external UI (i.e. Bootstrap-based) or a headless editor may not have this property or
    * throw an error when accessing it.
    *
    * Because of above, to make plugins more universal, it is recommended to split features into:
    *  - The "editing" part that uses the {@link module:core/editor/editor~Editor} class without `ui` property.
    *  - The "UI" part that uses the {@link module:core/editor/editor~Editor} class and accesses `ui` property.
    */
    const editor: IEditor;

    /**
    * Flag indicating whether a plugin is enabled or disabled.
    * A disabled plugin will not transform text.
    *
    * Plugin can be simply disabled like that:
    *
    * ```ts
    * // Disable the plugin so that no toolbars are visible.
    * editor.plugins.get( 'TextTransformation' ).isEnabled = false;
    * ```
    *
    * You can also use {@link #forceDisabled} method.
    *
    * @observable
    * @readonly
    */
    const isEnabled: boolean;


    /**
    * @inheritDoc
    */
    constructor(editor: IEditor);

    /**
    * Disables the plugin.
    *
    * Plugin may be disabled by multiple features or algorithms (at once). When disabling a plugin, unique id should be passed
    * (e.g. feature name). The same identifier should be used when {@link #clearForceDisabled enabling back} the plugin.
    * The plugin becomes enabled only after all features {@link #clearForceDisabled enabled it back}.
    *
    * Disabling and enabling a plugin:
    *
    * ```ts
    * plugin.isEnabled; // -> true
    * plugin.forceDisabled( 'MyFeature' );
    * plugin.isEnabled; // -> false
    * plugin.clearForceDisabled( 'MyFeature' );
    * plugin.isEnabled; // -> true
    * ```
    *
    * Plugin disabled by multiple features:
    *
    * ```ts
    * plugin.forceDisabled( 'MyFeature' );
    * plugin.forceDisabled( 'OtherFeature' );
    * plugin.clearForceDisabled( 'MyFeature' );
    * plugin.isEnabled; // -> false
    * plugin.clearForceDisabled( 'OtherFeature' );
    * plugin.isEnabled; // -> true
    * ```
    *
    * Multiple disabling with the same identifier is redundant:
    *
    * ```ts
    * plugin.forceDisabled( 'MyFeature' );
    * plugin.forceDisabled( 'MyFeature' );
    * plugin.clearForceDisabled( 'MyFeature' );
    * plugin.isEnabled; // -> true
    * ```
    *
    * **Note:** some plugins or algorithms may have more complex logic when it comes to enabling or disabling certain plugins,
    * so the plugin might be still disabled after {@link #clearForceDisabled} was used.
    *
    * @param id Unique identifier for disabling. Use the same id when {@link #clearForceDisabled enabling back} the plugin.
    */
    forceDisabled(id: string): void;

    /**
    * Clears forced disable previously set through {@link #forceDisabled}. See {@link #forceDisabled}.
    *
    * @param id Unique identifier, equal to the one passed in {@link #forceDisabled} call.
    */
    clearForceDisabled(id: string): void;

    /**
    * @inheritDoc
    */
    destroy(): void;

    /**
    * @inheritDoc
    */
    static get isContextPlugin(): boolean;
}


/**
* The base interface for CKEditor plugins.
*
* In its minimal form a plugin can be a simple function that accepts {@link module:core/editor/editor~Editor the editor}
* as a parameter:
*
* ```ts
* // A simple plugin that enables a data processor.
* function MyPlugin( editor ) {
* 	editor.data.processor = new MyDataProcessor();
* }
* ```
*
* In most cases however, you will want to inherit from the {@link ~Plugin} class which implements the
* {@link module:utils/observablemixin~Observable} and is, therefore, more convenient:
*
* ```ts
* class MyPlugin extends Plugin {
* 	init() {
* 		// `listenTo()` and `editor` are available thanks to `Plugin`.
* 		// By using `listenTo()` you will ensure that the listener is removed when
* 		// the plugin is destroyed.
* 		this.listenTo( this.editor.data, 'ready', () => {
* 			// Do something when the data is ready.
* 		} );
* 	}
* }
* ```
*
* The plugin class can have `pluginName` and `requires` static members. See {@link ~PluginStaticMembers} for more details.
*
* The plugin can also implement methods (e.g. {@link ~PluginInterface#init `init()`} or
* {@link ~PluginInterface#destroy `destroy()`}) which, when present, will be used to properly
* initialize and destroy the plugin.
*
* **Note:** When defined as a plain function, the plugin acts as a constructor and will be
* called in parallel with other plugins' {@link ~PluginConstructor constructors}.
* This means the code of that plugin will be executed **before** {@link ~PluginInterface#init `init()`} and
* {@link ~PluginInterface#afterInit `afterInit()`} methods of other plugins and, for instance,
* you cannot use it to extend other plugins' {@glink framework/architecture/editing-engine#schema schema}
* rules as they are defined later on during the `init()` stage.
*/
declare interface PluginInterface {
    /**
    * The second stage (after plugin constructor) of the plugin initialization.
    * Unlike the plugin constructor this method can be asynchronous.
    *
    * A plugin's `init()` method is called after its {@link ~PluginStaticMembers#requires dependencies} are initialized,
    * so in the same order as the constructors of these plugins.
    *
    * **Note:** This method is optional. A plugin instance does not need to have it defined.
    */
    init?(): Promise<any> | null | void;

    /**
    * The third (and last) stage of the plugin initialization. See also {@link ~PluginConstructor} and {@link ~PluginInterface#init}.
    *
    * **Note:** This method is optional. A plugin instance does not need to have it defined.
    */
    afterInit?(): Promise<any> | null | void;

    /**
    * Destroys the plugin.
    *
    * **Note:** This method is optional. A plugin instance does not need to have it defined.
    */
    destroy(): Promise<any> | null | void;
}

/**
* Creates a new plugin instance. This is the first step of the plugin initialization.
* See also {@link ~PluginInterface#init} and {@link ~PluginInterface#afterInit}.
*
* The plugin static properties should conform to {@link ~PluginStaticMembers `PluginStaticMembers` interface}.
*
* A plugin is always instantiated after its {@link ~PluginStaticMembers#requires dependencies} and the
* {@link ~PluginInterface#init} and {@link ~PluginInterface#afterInit} methods are called in the same order.
*
* Usually, you will want to put your plugin's initialization code in the {@link ~PluginInterface#init} method.
* The constructor can be understood as "before init" and used in special cases, just like
* {@link ~PluginInterface#afterInit} serves the special "after init" scenarios (e.g.the code which depends on other
* plugins, but which does not {@link ~PluginStaticMembers#requires explicitly require} them).
*/

declare type PluginConstructorBase<TContext> = PluginClassConstructor<TContext> | PluginFunctionConstructor<TContext>;
declare type PluginConstructor<TContext = IEditor> = PluginConstructorBase<TContext> & PluginStaticMembers<TContext>;


/**
* In most cases, you will want to inherit from the {@link ~Plugin} class which implements the
* {@link module:utils/observablemixin~Observable} and is, therefore, more convenient:
*
* ```ts
* class MyPlugin extends Plugin {
* 	init() {
* 		// `listenTo()` and `editor` are available thanks to `Plugin`.
* 		// By using `listenTo()` you will ensure that the listener is removed when
* 		// the plugin is destroyed.
* 		this.listenTo( this.editor.data, 'ready', () => {
* 			// Do something when the data is ready.
* 		} );
* 	}
* }
* ```
*/

declare class PluginClassConstructor<TContext = IEditor>{
    constructor(editor: TContext):PluginInterface
};

/**
* In its minimal form a plugin can be a simple function that accepts {@link module:core/editor/editor~Editor the editor}
* as a parameter:
*
* ```ts
* // A simple plugin that enables a data processor.
* function MyPlugin( editor ) {
* 	editor.data.processor = new MyDataProcessor();
* }
* ```
*/
declare type PluginFunctionConstructor<TContext = IEditor> = (editor: TContext) => void;

/**
* Static properties of a plugin.
*/
declare interface PluginStaticMembers<TContext = IEditor> {

    /**
    * An array of plugins required by this plugin.
    *
    * To keep the plugin class definition tight it is recommended to define this property as a static getter:
    *
    * ```ts
    * import Image from './image.js';
    *
    * export default class ImageCaption {
    * 	static get requires() {
    * 		return [ Image ];
    * 	}
    * }
    * ```
    */
    const requires?: PluginDependencies<TContext>;

    /**
    * An optional name of the plugin. If set, the plugin will be available in
    * {@link module:core/plugincollection~PluginCollection#get} by its
    * name and its constructor. If not, then only by its constructor.
    *
    * The name should reflect the constructor name.
    *
    * To keep the plugin class definition tight, it is recommended to define this property as a static getter:
    *
    * ```ts
    * export default class ImageCaption {
    * 	static get pluginName() {
    * 		return 'ImageCaption';
    * 	}
    * }
    * ```
    *
    * Note: The native `Function.name` property could not be used to keep the plugin name because
    * it will be mangled during code minification.
    *
    * Naming a plugin is necessary to enable removing it through the
    * {@link module:core/editor/editorconfig~EditorConfig#removePlugins `config.removePlugins`} option.
    */
    const pluginName?: string;

    /**
    * A flag which defines if a plugin is allowed or not allowed to be used directly by a {@link module:core/context~Context}.
    */
    const isContextPlugin?: boolean;
}

declare type PluginDependencies<TContext = IEditor> = Array<PluginConstructor<TContext> | string>;

declare type LoadedPlugins = Array<PluginInterface>;


/**
* Manages a list of CKEditor plugins, including loading, resolving dependencies and initialization.
*/
declare class PluginCollection<TContext extends object>{

    /**
    * Creates an instance of the plugin collection class.
    * Allows loading and initializing plugins and their dependencies.
    * Allows providing a list of already loaded plugins. These plugins will not be destroyed along with this collection.
    *
    * @param availablePlugins Plugins (constructors) which the collection will be able to use
    * when {@link module:core/plugincollection~PluginCollection#init} is used with the plugin names (strings, instead of constructors).
    * Usually, the editor will pass its built-in plugins to the collection so they can later be
    * used in `config.plugins` or `config.removePlugins` by names.
    * @param contextPlugins A list of already initialized plugins represented by a `[ PluginConstructor, pluginInstance ]` pair.
    */
    constructor(context: TContext, availablePlugins?: any, contextPlugins?: any);


    get<TConstructor extends PluginClassConstructor<TContext>>(key: TConstructor): any;
    get<TName extends string>(key: TName): PluginsMap[TName];
    /**
    * Checks if a plugin is loaded.
    *
    * ```ts
    * // Check if the 'Clipboard' plugin was loaded.
    * if ( editor.plugins.has( 'ClipboardPipeline' ) ) {
    * 	// Now use the clipboard plugin instance:
    * 	const clipboard = editor.plugins.get( 'ClipboardPipeline' );
    *
    * 	// ...
    * }
    * ```
    *
    * @param key The plugin constructor or {@link module:core/plugin~PluginStaticMembers#pluginName name}.
    */
    has(key: PluginConstructor<TContext> | string): boolean;
    /**
    * Initializes a set of plugins and adds them to the collection.
    *
    * @param plugins An array of {@link module:core/plugin~PluginInterface plugin constructors}
    * or {@link module:core/plugin~PluginStaticMembers#pluginName plugin names}.
    * @param pluginsToRemove Names of the plugins or plugin constructors
    * that should not be loaded (despite being specified in the `plugins` array).
    * @param pluginsSubstitutions An array of {@link module:core/plugin~PluginInterface plugin constructors}
    * that will be used to replace plugins of the same names that were passed in `plugins` or that are in their dependency tree.
    * A useful option for replacing built-in plugins while creating tests (for mocking their APIs). Plugins that will be replaced
    * must follow these rules:
    *   * The new plugin must be a class.
    *   * The new plugin must be named.
    *   * Both plugins must not depend on other plugins.
    * @returns A promise which gets resolved once all plugins are loaded and available in the collection.
    */
    init(plugins: Array<PluginConstructor<TContext> | string>, pluginsToRemove?: Array<PluginConstructor<TContext> | string>, pluginsSubstitutions?: Array<PluginConstructor<TContext>>): Promise<LoadedPlugins>;
    /**
    * Destroys all loaded plugins.
    */
    destroy(): Promise<any>;
}

/**
* A `[ PluginConstructor, pluginInstance ]` pair.
*/
declare type PluginEntry<TContext> = [PluginConstructor<TContext>, PluginInterface];

/**
* Helper type that maps plugin names to their types.
* It is meant to be extended with module augmentation.
*
* ```ts
* class MyPlugin extends Plugin {
* 	public static pluginName() {
* 		return 'MyPlugin' as const;
* 	}
* }
*
* declare module '@ckeditor/ckeditor5-core' {
* 	interface PluginsMap {
* 		[ MyPlugin.pluginName ]: MyPlugin;
* 	}
* }
*
* // Returns `MyPlugin`.
* const myPlugin = editor.plugins.get( 'MyPlugin' );
* ```
*/
declare interface PluginsMap {
    [name: string]: PluginInterface;
}
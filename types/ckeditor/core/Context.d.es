package ckeditor.core;

import ckeditor.utils.Config;
import ckeditor.utils.Locale;
import ckeditor.utils.LocaleTranslate;
import ckeditor.utils.Collection;

/**
* Provides a common, higher-level environment for solutions that use multiple {@link module:core/editor/editor~Editor editors}
* or plugins that work outside the editor. Use it instead of {@link module:core/editor/editor~Editor.create `Editor.create()`}
* in advanced application integrations.
*
* All configuration options passed to a context will be used as default options for the editor instances initialized in that context.
*
* {@link module:core/contextplugin~ContextPlugin Context plugins} passed to a context instance will be shared among all
* editor instances initialized in this context. These will be the same plugin instances for all the editors.
*
* **Note:** The context can only be initialized with {@link module:core/contextplugin~ContextPlugin context plugins}
* (e.g. [comments](https://ckeditor.com/collaboration/comments/)). Regular {@link module:core/plugin~Plugin plugins} require an
* editor instance to work and cannot be added to a context.
*
* **Note:** You can add a context plugin to an editor instance, though.
*
* If you are using multiple editor instances on one page and use any context plugins, create a context to share the configuration and
* plugins among these editors. Some plugins will use the information about all existing editors to better integrate between them.
*
* If you are using plugins that do not require an editor to work (e.g. [comments](https://ckeditor.com/collaboration/comments/)),
* enable and configure them using the context.
*
* If you are using only a single editor on each page, use {@link module:core/editor/editor~Editor.create `Editor.create()`} instead.
* In such a case, a context instance will be created by the editor instance in a transparent way.
*
* See {@link ~Context.create `Context.create()`} for usage examples.
*/
declare class Context {
    /**
    * Stores all the configurations specific to this context instance.
    */
    const config: Config<ContextConfig>;
    /**
    * The plugins loaded and in use by this context instance.
    */
    const plugins: PluginCollection<Context | IEditor>;
    const locale: Locale;
    /**
    * Shorthand for {@link module:utils/locale~Locale#t}.
    */
    const t: LocaleTranslate;
    /**
    * A list of editors that this context instance is injected to.
    */
    const editors: Collection<IEditor>;
    /**
    * The default configuration which is built into the `Context` class.
    *
    * It is used in CKEditor 5 builds featuring `Context` to provide the default configuration options which are later used during the
    * context initialization.
    *
    * ```ts
    * Context.defaultConfig = {
    * 	foo: 1,
    * 	bar: 2
    * };
    *
    * Context
    * 	.create()
    * 	.then( context => {
    * 		context.config.get( 'foo' ); // -> 1
    * 		context.config.get( 'bar' ); // -> 2
    * 	} );
    *
    * // The default options can be overridden by the configuration passed to create().
    * Context
    * 	.create( { bar: 3 } )
    * 	.then( context => {
    * 		context.config.get( 'foo' ); // -> 1
    * 		context.config.get( 'bar' ); // -> 3
    * 	} );
    * ```
    *
    * See also {@link module:core/context~Context.builtinPlugins `Context.builtinPlugins`}
    * and {@link module:core/editor/editor~Editor.defaultConfig `Editor.defaultConfig`}.
    */
    static defaultConfig: ContextConfig;
    /**
    * An array of plugins built into the `Context` class.
    *
    * It is used in CKEditor 5 builds featuring `Context` to provide a list of context plugins which are later automatically initialized
    * during the context initialization.
    *
    * They will be automatically initialized by `Context` unless `config.plugins` is passed.
    *
    * ```ts
    * // Build some context plugins into the Context class first.
    * Context.builtinPlugins = [ FooPlugin, BarPlugin ];
    *
    * // Normally, you need to define config.plugins, but since Context.builtinPlugins was
    * // defined, now you can call create() without any configuration.
    * Context
    * 	.create()
    * 	.then( context => {
    * 		context.plugins.get( FooPlugin ); // -> An instance of the Foo plugin.
    * 		context.plugins.get( BarPlugin ); // -> An instance of the Bar plugin.
    * 	} );
    * ```
    *
    * See also {@link module:core/context~Context.defaultConfig `Context.defaultConfig`}
    * and {@link module:core/editor/editor~Editor.builtinPlugins `Editor.builtinPlugins`}.
    */
    static builtinPlugins: Array<PluginConstructor<Context | IEditor>>;

    /**
    * Creates a context instance with a given configuration.
    *
    * Usually not to be used directly. See the static {@link module:core/context~Context.create `create()`} method.
    *
    * @param config The context configuration.
    */
    constructor(config?: ContextConfig);
    /**
    * Loads and initializes plugins specified in the configuration.
    *
    * @returns A promise which resolves once the initialization is completed, providing an array of loaded plugins.
    */
    initPlugins(): Promise<LoadedPlugins>;
    /**
    * Destroys the context instance and all editors used with the context,
    * releasing all resources used by the context.
    *
    * @returns A promise that resolves once the context instance is fully destroyed.
    */
    destroy(): Promise<any>;

    /**
    * Creates and initializes a new context instance.
    *
    * ```ts
    * const commonConfig = { ... }; // Configuration for all the plugins and editors.
    * const editorPlugins = [ ... ]; // Regular plugins here.
    *
    * Context
    * 	.create( {
    * 		// Only context plugins here.
    * 		plugins: [ ... ],
    *
    * 		// Configure the language for all the editors (it cannot be overwritten).
    * 		language: { ... },
    *
    * 		// Configuration for context plugins.
    * 		comments: { ... },
    * 		...
    *
    * 		// Default configuration for editor plugins.
    * 		toolbar: { ... },
    * 		image: { ... },
    * 		...
    * 	} )
    * 	.then( context => {
    * 		const promises = [];
    *
    * 		promises.push( ClassicEditor.create(
    * 			document.getElementById( 'editor1' ),
    * 			{
    * 				editorPlugins,
    * 				context
    * 			}
    * 		) );
    *
    * 		promises.push( ClassicEditor.create(
    * 			document.getElementById( 'editor2' ),
    * 			{
    * 				editorPlugins,
    * 				context,
    * 				toolbar: { ... } // You can overwrite the configuration of the context.
    * 			}
    * 		) );
    *
    * 		return Promise.all( promises );
    * 	} );
    * ```
    *
    * @param config The context configuration.
    * @returns A promise resolved once the context is ready. The promise resolves with the created context instance.
    */
    static create(config?: ContextConfig): Promise<Context>;
}


/**
* The context configuration.
*/
declare type ContextConfig = {
    plugins?: Array<PluginConstructor<Context | IEditor>>,
    substitutePlugins?: Array<PluginConstructor<Context | IEditor>>,
} & EditorConfig;
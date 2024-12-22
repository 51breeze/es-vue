package ckeditor.engine;
/**
* Controller for the data pipeline. The data pipeline controls how data is retrieved from the document
* and set inside it. Hence, the controller features two methods which allow to {@link ~DataController#get get}
* and {@link ~DataController#set set} data of the {@link ~DataController#model model}
* using the given:
*
* * {@link module:engine/dataprocessor/dataprocessor~DataProcessor data processor},
* * downcast converters,
* * upcast converters.
*
* An instance of the data controller is always available in the {@link module:core/editor/editor~Editor#data `editor.data`}
* property:
*
* ```ts
* editor.data.get( { rootName: 'customRoot' } ); // -> '<p>Hello!</p>'
* ```
*/
declare class DataController{
    /**
    * Data model.
    */
    const model: any;
    /**
    * Mapper used for the conversion. It has no permanent bindings, because these are created while getting data and
    * ae cleared directly after the data are converted. However, the mapper is defined as a class property, because
    * it needs to be passed to the `DowncastDispatcher` as a conversion API.
    */
    const mapper: any;
    /**
    * Downcast dispatcher used by the {@link #get get method}. Downcast converters should be attached to it.
    */
    const downcastDispatcher: any;
    /**
    * Upcast dispatcher used by the {@link #set set method}. Upcast converters should be attached to it.
    */
    const upcastDispatcher: any;
    /**
    * The view document used by the data controller.
    */
    const viewDocument: any;
    /**
    * Styles processor used during the conversion.
    */
    const stylesProcessor: any;
    /**
    * Data processor used specifically for HTML conversion.
    */
    const htmlProcessor: any;
    /**
    * Data processor used during the conversion.
    * Same instance as {@link #htmlProcessor} by default. Can be replaced at run time to handle different format, e.g. XML or Markdown.
    */
    processor: any;

    /**
    * Creates a data controller instance.
    *
    * @param model Data model.
    * @param stylesProcessor The styles processor instance.
    */
    constructor(model: any, stylesProcessor: any);
    /**
    * Returns the model's data converted by downcast dispatchers attached to {@link #downcastDispatcher} and
    * formatted by the {@link #processor data processor}.
    *
    * A warning is logged when you try to retrieve data for a detached root, as most probably this is a mistake. A detached root should
    * be treated like it is removed, and you should not save its data. Note, that the detached root data is always an empty string.
    *
    * @fires get
    * @param options Additional configuration for the retrieved data. `DataController` provides two optional
    * properties: `rootName` and `trim`. Other properties of this object are specified by various editor features.
    * @param options.rootName Root name. Default 'main'.
    * @param options.trim Whether returned data should be trimmed. This option is set to `empty` by default,
    * which means whenever editor content is considered empty, an empty string will be returned. To turn off trimming completely
    * use `'none'`. In such cases the exact content will be returned (for example a `<p>&nbsp;</p>` for an empty editor).
    * @returns Output data.
    */
    get(options?: {
        rootName?: string,
        trim?: 'empty' | 'none',
        [key: string]: any
    }): string;
    /**
    * Returns the content of the given {@link module:engine/model/element~Element model's element} or
    * {@link module:engine/model/documentfragment~DocumentFragment model document fragment} converted by the downcast converters
    * attached to the {@link #downcastDispatcher} and formatted by the {@link #processor data processor}.
    *
    * @param modelElementOrFragment The element whose content will be stringified.
    * @param options Additional configuration passed to the conversion process.
    * @returns Output data.
    */
    stringify(modelElementOrFragment: any, options?: any): string;
    /**
    * Returns the content of the given {@link module:engine/model/element~Element model element} or
    * {@link module:engine/model/documentfragment~DocumentFragment model document fragment} converted by the downcast
    * converters attached to {@link #downcastDispatcher} into a
    * {@link module:engine/view/documentfragment~DocumentFragment view document fragment}.
    *
    * @fires toView
    * @param modelElementOrFragment Element or document fragment whose content will be converted.
    * @param options Additional configuration that will be available through the
    * {@link module:engine/conversion/downcastdispatcher~DowncastConversionApi#options} during the conversion process.
    * @returns Output view DocumentFragment.
    */
    toView(modelElementOrFragment: any, options?:any): any;
    /**
    * Sets the initial input data parsed by the {@link #processor data processor} and
    * converted by the {@link #upcastDispatcher view-to-model converters}.
    * Initial data can be only set to a document whose {@link module:engine/model/document~Document#version} is equal 0.
    *
    * **Note** This method is {@link module:utils/observablemixin~Observable#decorate decorated} which is
    * used by e.g. collaborative editing plugin that syncs remote data on init.
    *
    * When data is passed as a string, it is initialized on the default `main` root:
    *
    * ```ts
    * dataController.init( '<p>Foo</p>' ); // Initializes data on the `main` root only, as no other is specified.
    * ```
    *
    * To initialize data on a different root or multiple roots at once, an object containing `rootName` - `data` pairs should be passed:
    *
    * ```ts
    * dataController.init( { main: '<p>Foo</p>', title: '<h1>Bar</h1>' } ); // Initializes data on both the `main` and `title` roots.
    * ```
    *
    * @fires init
    * @param data Input data as a string or an object containing the `rootName` - `data`
    * pairs to initialize data on multiple roots at once.
    * @returns Promise that is resolved after the data is set on the editor.
    */
    init(data: any): Promise<void>;
    /**
    * Sets the input data parsed by the {@link #processor data processor} and
    * converted by the {@link #upcastDispatcher view-to-model converters}.
    * This method can be used any time to replace existing editor data with the new one without clearing the
    * {@link module:engine/model/document~Document#history document history}.
    *
    * This method also creates a batch with all the changes applied. If all you need is to parse data, use
    * the {@link #parse} method.
    *
    * When data is passed as a string it is set on the default `main` root:
    *
    * ```ts
    * dataController.set( '<p>Foo</p>' ); // Sets data on the `main` root, as no other is specified.
    * ```
    *
    * To set data on a different root or multiple roots at once, an object containing `rootName` - `data` pairs should be passed:
    *
    * ```ts
    * dataController.set( { main: '<p>Foo</p>', title: '<h1>Bar</h1>' } ); // Sets data on the `main` and `title` roots as specified.
    * ```
    *
    * To set the data with a preserved undo stack and add the change to the undo stack, set `{ isUndoable: true }` as a `batchType` option.
    *
    * ```ts
    * dataController.set( '<p>Foo</p>', { batchType: { isUndoable: true } } );
    * ```
    *
    * @fires set
    * @param data Input data as a string or an object containing the `rootName` - `data`
    * pairs to set data on multiple roots at once.
    * @param options Options for setting data.
    * @param options.batchType The batch type that will be used to create a batch for the changes applied by this method.
    * By default, the batch will be set as {@link module:engine/model/batch~Batch#isUndoable not undoable} and the undo stack will be
    * cleared after the new data is applied (all undo steps will be removed). If the batch type `isUndoable` flag is be set to `true`,
    * the undo stack will be preserved instead and not cleared when new data is applied.
    */
    set(data: any, options?: {
        batchType?: any
    }): void;
    /**
    * Returns the data parsed by the {@link #processor data processor} and then converted by upcast converters
    * attached to the {@link #upcastDispatcher}.
    *
    * @see #set
    * @param data Data to parse.
    * @param context Base context in which the view will be converted to the model.
    * See: {@link module:engine/conversion/upcastdispatcher~UpcastDispatcher#convert}.
    * @returns Parsed data.
    */
    parse(data: string, context?: any): any;
    /**
    * Returns the result of the given {@link module:engine/view/element~Element view element} or
    * {@link module:engine/view/documentfragment~DocumentFragment view document fragment} converted by the
    * {@link #upcastDispatcher view-to-model converters}, wrapped by {@link module:engine/model/documentfragment~DocumentFragment}.
    *
    * When marker elements were converted during the conversion process, it will be set as a document fragment's
    * {@link module:engine/model/documentfragment~DocumentFragment#markers static markers map}.
    *
    * @fires toModel
    * @param viewElementOrFragment The element or document fragment whose content will be converted.
    * @param context Base context in which the view will be converted to the model.
    * See: {@link module:engine/conversion/upcastdispatcher~UpcastDispatcher#convert}.
    * @returns Output document fragment.
    */
    toModel(viewElementOrFragment:any, context?: any): any;
    /**
    * Adds the style processor normalization rules.
    *
    * You can implement your own rules as well as use one of the available processor rules:
    *
    * * background: {@link module:engine/view/styles/background~addBackgroundRules}
    * * border: {@link module:engine/view/styles/border~addBorderRules}
    * * margin: {@link module:engine/view/styles/margin~addMarginRules}
    * * padding: {@link module:engine/view/styles/padding~addPaddingRules}
    */
    addStyleProcessorRules(callback: (stylesProcessor: any) => void): void;
    /**
    * Registers a {@link module:engine/view/matcher~MatcherPattern} on an {@link #htmlProcessor htmlProcessor}
    * and a {@link #processor processor} for view elements whose content should be treated as raw data
    * and not processed during the conversion from DOM to view elements.
    *
    * The raw data can be later accessed by the {@link module:engine/view/element~Element#getCustomProperty view element custom property}
    * `"$rawContent"`.
    *
    * @param pattern Pattern matching all view elements whose content should be treated as a raw data.
    */
    registerRawContentMatcher(pattern: any): void;
    /**
    * Removes all event listeners set by the DataController.
    */
    destroy(): void;
}
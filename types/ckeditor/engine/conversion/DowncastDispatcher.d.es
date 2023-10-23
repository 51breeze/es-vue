package ckeditor.engine;

import ckeditor.model.MarkerCollection;
import ckeditor.model.Item;
import ckeditor.model.Differ;
import ckeditor.model.Position;
import ckeditor.model.DocumentSelection;
import ckeditor.model.Selection;
import ckeditor.model.Schema;
import ckeditor.view.DowncastWriter;

/**
 * The downcast dispatcher is a central point of downcasting (conversion from the model to the view), which is a process of reacting
 * to changes in the model and firing a set of events. The callbacks listening to these events are called converters. The
 * converters' role is to convert the model changes to changes in view (for example, adding view nodes or
 * changing attributes on view elements).
 *
 * During the conversion process, downcast dispatcher fires events basing on the state of the model and prepares
 * data for these events. It is important to understand that the events are connected with the changes done on the model,
 * for example: "a node has been inserted" or "an attribute has changed". This is in contrary to upcasting (a view-to-model conversion)
 * where you convert the view state (view nodes) to a model tree.
 *
 * The events are prepared basing on a diff created by the {@link module:engine/model/differ~Differ Differ}, which buffers them
 * and then passes to the downcast dispatcher as a diff between the old model state and the new model state.
 *
 * Note that because the changes are converted, there is a need to have a mapping between the model structure and the view structure.
 * To map positions and elements during the downcast (a model-to-view conversion), use {@link module:engine/conversion/mapper~Mapper}.
 *
 * Downcast dispatcher fires the following events for model tree changes:
 *
 * * {@link module:engine/conversion/downcastdispatcher~DowncastDispatcher#event:insert `insert`} &ndash;
 * If a range of nodes was inserted to the model tree.
 * * {@link module:engine/conversion/downcastdispatcher~DowncastDispatcher#event:remove `remove`} &ndash;
 * If a range of nodes was removed from the model tree.
 * * {@link module:engine/conversion/downcastdispatcher~DowncastDispatcher#event:attribute `attribute`} &ndash;
 * If an attribute was added, changed or removed from a model node.
 *
 * For {@link module:engine/conversion/downcastdispatcher~DowncastDispatcher#event:insert `insert`}
 * and {@link module:engine/conversion/downcastdispatcher~DowncastDispatcher#event:attribute `attribute`},
 * the downcast dispatcher generates {@link module:engine/conversion/modelconsumable~ModelConsumable consumables}.
 * These are used to have control over which changes have already been consumed. It is useful when some converters
 * overwrite others or convert multiple changes (for example, it converts an insertion of an element and also converts that
 * element's attributes during the insertion).
 *
 * Additionally, downcast dispatcher fires events for {@link module:engine/model/markercollection~Marker marker} changes:
 *
 * * {@link module:engine/conversion/downcastdispatcher~DowncastDispatcher#event:addMarker `addMarker`} &ndash; If a marker was added.
 * * {@link module:engine/conversion/downcastdispatcher~DowncastDispatcher#event:removeMarker `removeMarker`} &ndash; If a marker was
 * removed.
 *
 * Note that changing a marker is done through removing the marker from the old range and adding it to the new range,
 * so both of these events are fired.
 *
 * Finally, a downcast dispatcher also handles firing events for the {@link module:engine/model/selection model selection}
 * conversion:
 *
 * * {@link module:engine/conversion/downcastdispatcher~DowncastDispatcher#event:selection `selection`}
 * &ndash; Converts the selection from the model to the view.
 * * {@link module:engine/conversion/downcastdispatcher~DowncastDispatcher#event:attribute `attribute`}
 * &ndash; Fired for every selection attribute.
 * * {@link module:engine/conversion/downcastdispatcher~DowncastDispatcher#event:addMarker `addMarker`}
 * &ndash; Fired for every marker that contains a selection.
 *
 * Unlike the model tree and the markers, the events for selection are not fired for changes but for a selection state.
 *
 * When providing custom listeners for a downcast dispatcher, remember to check whether a given change has not been
 * {@link module:engine/conversion/modelconsumable~ModelConsumable#consume consumed} yet.
 *
 * When providing custom listeners for a downcast dispatcher, keep in mind that you **should not** stop the event. If you stop it,
 * then the default converter at the `lowest` priority will not trigger the conversion of this node's attributes and child nodes.
 *
 * When providing custom listeners for a downcast dispatcher, remember to use the provided
 * {@link module:engine/view/downcastwriter~DowncastWriter view downcast writer} to apply changes to the view document.
 *
 * You can read more about conversion in the following guide:
 *
 * * {@glink framework/deep-dive/conversion/downcast Downcast conversion}
 *
 * An example of a custom converter for the downcast dispatcher:
 *
 * ```ts
 * // You will convert inserting a "paragraph" model element into the model.
 * downcastDispatcher.on( 'insert:paragraph', ( evt, data, conversionApi ) => {
 * 	// Remember to check whether the change has not been consumed yet and consume it.
 * 	if ( !conversionApi.consumable.consume( data.item, 'insert' ) ) {
 * 		return;
 * 	}
 *
 * 	// Translate the position in the model to a position in the view.
 * 	const viewPosition = conversionApi.mapper.toViewPosition( data.range.start );
 *
 * 	// Create a <p> element that will be inserted into the view at the `viewPosition`.
 * 	const viewElement = conversionApi.writer.createContainerElement( 'p' );
 *
 * 	// Bind the newly created view element to the model element so positions will map accordingly in the future.
 * 	conversionApi.mapper.bindElements( data.item, viewElement );
 *
 * 	// Add the newly created view element to the view.
 * 	conversionApi.writer.insert( viewPosition, viewElement );
 * } );
 * ```
 */
declare class DowncastDispatcher{
    
    /**
     * Creates a downcast dispatcher instance.
     *
     * @see module:engine/conversion/downcastdispatcher~DowncastConversionApi
     *
     * @param conversionApi Additional properties for an interface that will be passed to events fired
     * by the downcast dispatcher.
     */
    constructor(conversionApi:{mapper:any,schema:any});
    /**
     * Converts changes buffered in the given {@link module:engine/model/differ~Differ model differ}
     * and fires conversion events based on it.
     *
     * @fires insert
     * @fires remove
     * @fires attribute
     * @fires addMarker
     * @fires removeMarker
     * @fires reduceChanges
     * @param differ The differ object with buffered changes.
     * @param markers Markers related to the model fragment to convert.
     * @param writer The view writer that should be used to modify the view document.
     */
    convertChanges(differ: Differ, markers: MarkerCollection, writer: DowncastWriter): void;
    /**
     * Starts a conversion of a model range and the provided markers.
     *
     * @fires insert
     * @fires attribute
     * @fires addMarker
     * @param range The inserted range.
     * @param markers The map of markers that should be down-casted.
     * @param writer The view writer that should be used to modify the view document.
     * @param options Optional options object passed to `convertionApi.options`.
     */
    convert(range: Range, markers: Map<string, Range>, writer: DowncastWriter, options?: DowncastConversionApi['options']): void;
    /**
     * Starts the model selection conversion.
     *
     * Fires events for a given {@link module:engine/model/selection~Selection selection} to start the selection conversion.
     *
     * @fires selection
     * @fires addMarker
     * @fires attribute
     * @param selection The selection to convert.
     * @param markers Markers connected with the converted model.
     * @param writer View writer that should be used to modify the view document.
     */
    convertSelection(selection: Selection | DocumentSelection, markers: MarkerCollection, writer: DowncastWriter): void;
}


declare interface DiffItemReinsert {
    type: 'reinsert';
    name: string;
    position: Position;
    length: number;
}

/**
 * Conversion interface that is registered for given {@link module:engine/conversion/downcastdispatcher~DowncastDispatcher}
 * and is passed as one of parameters when {@link module:engine/conversion/downcastdispatcher~DowncastDispatcher dispatcher}
 * fires its events.
 */
declare interface DowncastConversionApi {
    /**
     * The {@link module:engine/conversion/downcastdispatcher~DowncastDispatcher} instance.
     */
    dispatcher: DowncastDispatcher;
    /**
     * Stores the information about what parts of a processed model item are still waiting to be handled. After a piece of a model item was
     * converted, an appropriate consumable value should be {@link module:engine/conversion/modelconsumable~ModelConsumable#consume
     * consumed}.
     */
    consumable: any;
    /**
     * The {@link module:engine/conversion/mapper~Mapper} instance.
     */
    mapper: any;
    /**
     * The {@link module:engine/model/schema~Schema} instance set for the model that is downcast.
     */
    schema: Schema;
    /**
     * The {@link module:engine/view/downcastwriter~DowncastWriter} instance used to manipulate the data during conversion.
     */
    writer: DowncastWriter;
    /**
     * An object with an additional configuration which can be used during the conversion process.
     * Available only for data downcast conversion.
     */
    options: any;
    /**
     * Triggers conversion of a specified item.
     * This conversion is triggered within (as a separate process of) the parent conversion.
     *
     * @param item The model item to trigger nested insert conversion on.
     */
    convertItem(item: Item): void;
    /**
     * Triggers conversion of children of a specified element.
     *
     * @param element The model element to trigger children insert conversion on.
     */
    convertChildren(element: Element): void;
    /**
     * Triggers conversion of attributes of a specified item.
     *
     * @param item The model item to trigger attribute conversion on.
     */
    convertAttributes(item: Item): void;
    canReuseView(element: any): boolean;
}

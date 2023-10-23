package ckeditor.model;

/**
 * The collection of all {@link module:engine/model/markercollection~Marker markers} attached to the document.
 * It lets you {@link module:engine/model/markercollection~MarkerCollection#get get} markers or track them using
 * {@link module:engine/model/markercollection~MarkerCollection#event:update} event.
 *
 * To create, change or remove makers use {@link module:engine/model/writer~Writer model writers'} methods:
 * {@link module:engine/model/writer~Writer#addMarker} or {@link module:engine/model/writer~Writer#removeMarker}. Since
 * the writer is the only proper way to change the data model it is not possible to change markers directly using this
 * collection. All markers created by the writer will be automatically added to this collection.
 *
 * By default there is one marker collection available as {@link module:engine/model/model~Model#markers model property}.
 *
 * @see module:engine/model/markercollection~Marker
 */
declare class MarkerCollection implements Iterator<Marker> {
    
    /**
     * Checks if given {@link ~Marker marker} or marker name is in the collection.
     *
     * @param markerOrName Name of marker or marker instance to check.
     * @returns `true` if marker is in the collection, `false` otherwise.
     */
    has(markerOrName: string | Marker): boolean;
    /**
     * Returns {@link ~Marker marker} with given `markerName`.
     *
     * @param markerName Name of marker to get.
     * @returns Marker with given name or `null` if such marker was
     * not added to the collection.
     */
    get(markerName: string): Marker | null;
    
    /**
     * Returns iterator that iterates over all markers, which ranges contain given {@link module:engine/model/position~Position position}.
     */
    getMarkersAtPosition(position: Position):Iterator<Marker>;
    /**
     * Returns iterator that iterates over all markers, which intersects with given {@link module:engine/model/range~Range range}.
     */
    getMarkersIntersectingRange(range: Range): Iterator<Marker>;
    /**
     * Destroys marker collection and all markers inside it.
     */
    destroy(): void;
    /**
     * Iterates over all markers that starts with given `prefix`.
     *
     * ```ts
     * const markerFooA = markersCollection.set( 'foo:a', rangeFooA );
     * const markerFooB = markersCollection.set( 'foo:b', rangeFooB );
     * const markerBarA = markersCollection.set( 'bar:a', rangeBarA );
     * const markerFooBarA = markersCollection.set( 'foobar:a', rangeFooBarA );
     * Array.from( markersCollection.getMarkersGroup( 'foo' ) ); // [ markerFooA, markerFooB ]
     * Array.from( markersCollection.getMarkersGroup( 'a' ) ); // []
     * ```
     */
    getMarkersGroup(prefix: string): Iterator<Marker>;
   
}
declare interface MarkerData {
    /**
     * Marker range. `null` if the marker was removed.
     */
    range: Range | null;
    /**
     * A property defining if the marker affects data.
     */
    affectsData: boolean;
    /**
     * A property defining if the marker is managed using operations.
     */
    managedUsingOperations: boolean;
}


/**
 * `Marker` is a continuous part of the model (like a range), is named and represents some kind of information about the
 * marked part of the model document. In contrary to {@link module:engine/model/node~Node nodes}, which are building blocks of
 * the model document tree, markers are not stored directly in the document tree but in the
 * {@link module:engine/model/model~Model#markers model markers' collection}. Still, they are document data, by giving
 * additional meaning to the part of a model document between marker start and marker end.
 *
 * In this sense, markers are similar to adding and converting attributes on nodes. The difference is that attribute is
 * connected with a given node (e.g. a character is bold no matter if it gets moved or content around it changes).
 * Markers on the other hand are continuous ranges and are characterized by their start and end position. This means that
 * any character in the marker is marked by the marker. For example, if a character is moved outside of marker it stops being
 * "special" and the marker is shrunk. Similarly, when a character is moved into the marker from other place in document
 * model, it starts being "special" and the marker is enlarged.
 *
 * Another upside of markers is that finding marked part of document is fast and easy. Using attributes to mark some nodes
 * and then trying to find that part of document would require traversing whole document tree. Marker gives instant access
 * to the range which it is marking at the moment.
 *
 * Markers are built from a name and a range.
 *
 * Range of the marker is updated automatically when document changes, using
 * {@link module:engine/model/liverange~LiveRange live range} mechanism.
 *
 * Name is used to group and identify markers. Names have to be unique, but markers can be grouped by
 * using common prefixes, separated with `:`, for example: `user:john` or `search:3`. That's useful in term of creating
 * namespaces for custom elements (e.g. comments, highlights). You can use this prefixes in
 * {@link module:engine/model/markercollection~MarkerCollection#event:update} listeners to listen on changes in a group of markers.
 * For instance: `model.markers.on( 'update:user', callback );` will be called whenever any `user:*` markers changes.
 *
 * There are two types of markers.
 *
 * 1. Markers managed directly, without using operations. They are added directly by {@link module:engine/model/writer~Writer}
 * to the {@link module:engine/model/markercollection~MarkerCollection} without any additional mechanism. They can be used
 * as bookmarks or visual markers. They are great for showing results of the find, or select link when the focus is in the input.
 *
 * 1. Markers managed using operations. These markers are also stored in {@link module:engine/model/markercollection~MarkerCollection}
 * but changes in these markers is managed the same way all other changes in the model structure - using operations.
 * Therefore, they are handled in the undo stack and synchronized between clients if the collaboration plugin is enabled.
 * This type of markers is useful for solutions like spell checking or comments.
 *
 * Both type of them should be added / updated by {@link module:engine/model/writer~Writer#addMarker}
 * and removed by {@link module:engine/model/writer~Writer#removeMarker} methods.
 *
 * ```ts
 * model.change( ( writer ) => {
 * 	const marker = writer.addMarker( name, { range, usingOperation: true } );
 *
 * 	// ...
 *
 * 	writer.removeMarker( marker );
 * } );
 * ```
 *
 * See {@link module:engine/model/writer~Writer} to find more examples.
 *
 * Since markers need to track change in the document, for efficiency reasons, it is best to create and keep as little
 * markers as possible and remove them as soon as they are not needed anymore.
 *
 * Markers can be downcasted and upcasted.
 *
 * Markers downcast happens on {@link module:engine/conversion/downcastdispatcher~DowncastDispatcher#event:addMarker} and
 * {@link module:engine/conversion/downcastdispatcher~DowncastDispatcher#event:removeMarker} events.
 * Use {@link module:engine/conversion/downcasthelpers downcast converters} or attach a custom converter to mentioned events.
 * For {@link module:engine/controller/datacontroller~DataController data pipeline}, marker should be downcasted to an element.
 * Then, it can be upcasted back to a marker. Again, use {@link module:engine/conversion/upcasthelpers upcast converters} or
 * attach a custom converter to {@link module:engine/conversion/upcastdispatcher~UpcastDispatcher#event:element}.
 *
 * `Marker` instances are created and destroyed only by {@link ~MarkerCollection MarkerCollection}.
 */
declare class Marker{
    /**
     * Marker's name.
     */
    const name: string;
    
    /**
     * Creates a marker instance.
     *
     * @param name Marker name.
     * @param liveRange Range marked by the marker.
     * @param managedUsingOperations Specifies whether the marker is managed using operations.
     * @param affectsData Specifies whether the marker affects the data produced by the data pipeline (is persisted in the editor's data).
     */
    constructor(name: string, liveRange: LiveRange, managedUsingOperations: boolean, affectsData: boolean);
    /**
     * A value indicating if the marker is managed using operations.
     * See {@link ~Marker marker class description} to learn more about marker types.
     * See {@link module:engine/model/writer~Writer#addMarker}.
     */
    get managedUsingOperations(): boolean;
    /**
     * A value indicating if the marker changes the data.
     */
    get affectsData(): boolean;
    /**
     * Returns the marker data (properties defining the marker).
     */
    getData(): MarkerData;
    /**
     * Returns current marker start position.
     */
    getStart(): Position;
    /**
     * Returns current marker end position.
     */
    getEnd(): Position;
    /**
     * Returns a range that represents the current state of the marker.
     *
     * Keep in mind that returned value is a {@link module:engine/model/range~Range Range}, not a
     * {@link module:engine/model/liverange~LiveRange LiveRange}. This means that it is up-to-date and relevant only
     * until next model document change. Do not store values returned by this method. Instead, store {@link ~Marker#name}
     * and get `Marker` instance from {@link module:engine/model/markercollection~MarkerCollection MarkerCollection} every
     * time there is a need to read marker properties. This will guarantee that the marker has not been removed and
     * that it's data is up-to-date.
     */
    getRange(): Range;
    
}
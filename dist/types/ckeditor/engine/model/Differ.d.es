package ckeditor.model;

/**
 * Calculates the difference between two model states.
 *
 * Receives operations that are to be applied on the model document. Marks parts of the model document tree which
 * are changed and saves the state of these elements before the change. Then, it compares saved elements with the
 * changed elements, after all changes are applied on the model document. Calculates the diff between saved
 * elements and new ones and returns a change set.
 */
declare class Differ {
   
    /**
     * Creates a `Differ` instance.
     *
     * @param markerCollection Model's marker collection.
     */
    constructor(markerCollection: MarkerCollection);
    /**
     * Informs whether there are any changes buffered in `Differ`.
     */
    get isEmpty(): boolean;
    /**
     * Buffers the given operation. An operation has to be buffered before it is executed.
     *
     * @param operationToBuffer An operation to buffer.
     */
    bufferOperation(operationToBuffer: Operation): void;
    /**
     * Buffers a marker change.
     *
     * @param markerName The name of the marker that changed.
     * @param oldMarkerData Marker data before the change.
     * @param newMarkerData Marker data after the change.
     */
    bufferMarkerChange(markerName: string, oldMarkerData: MarkerData, newMarkerData: MarkerData): void;
    /**
     * Returns all markers that should be removed as a result of buffered changes.
     *
     * @returns Markers to remove. Each array item is an object containing the `name` and `range` properties.
     */
    getMarkersToRemove(): Array<{
        name: string,
        range: Range
    }>;
    /**
     * Returns all markers which should be added as a result of buffered changes.
     *
     * @returns Markers to add. Each array item is an object containing the `name` and `range` properties.
     */
    getMarkersToAdd(): Array<{
        name: string,
        range: Range
    }>;
    /**
     * Returns all markers which changed.
     */
    getChangedMarkers(): Array<{
        name: string,
        data: {
            oldRange: Range | null,
            newRange: Range | null
        }
    }>;
    /**
     * Checks whether some of the buffered changes affect the editor data.
     *
     * Types of changes which affect the editor data:
     *
     * * model structure changes,
     * * attribute changes,
     * * a root is added or detached,
     * * changes of markers which were defined as `affectsData`,
     * * changes of markers' `affectsData` property.
     */
    hasDataChanges(): boolean;
    /**
     * Calculates the diff between the old model tree state (the state before the first buffered operations since the last {@link #reset}
     * call) and the new model tree state (actual one). It should be called after all buffered operations are executed.
     *
     * The diff set is returned as an array of {@link module:engine/model/differ~DiffItem diff items}, each describing a change done
     * on the model. The items are sorted by the position on which the change happened. If a position
     * {@link module:engine/model/position~Position#isBefore is before} another one, it will be on an earlier index in the diff set.
     *
     * **Note**: Elements inside inserted element will not have a separate diff item, only the top most element change will be reported.
     *
     * Because calculating the diff is a costly operation, the result is cached. If no new operation was buffered since the
     * previous {@link #getChanges} call, the next call will return the cached value.
     *
     * @param options Additional options.
     * @param options.includeChangesInGraveyard If set to `true`, also changes that happened
     * in the graveyard root will be returned. By default, changes in the graveyard root are not returned.
     * @returns Diff between the old and the new model tree state.
     */
    getChanges(options?: {
        includeChangesInGraveyard?: boolean
    }): Array<DiffItem>;
    /**
     * Returns all roots that have changed (either were attached, or detached, or their attributes changed).
     *
     * @returns Diff between the old and the new roots state.
     */
    getChangedRoots(): Array<DiffItemRoot>;
    /**
     * Returns a set of model items that were marked to get refreshed.
     */
    getRefreshedItems(): Set<Item>;
    /**
     * Resets `Differ`. Removes all buffered changes.
     */
    reset(): void;
}

/**
 * The single diff item.
 *
 * Could be one of:
 *
 * * {@link module:engine/model/differ~DiffItemInsert `DiffItemInsert`},
 * * {@link module:engine/model/differ~DiffItemRemove `DiffItemRemove`},
 * * {@link module:engine/model/differ~DiffItemAttribute `DiffItemAttribute`}.
 */
declare type DiffItem = DiffItemInsert | DiffItemRemove | DiffItemAttribute;
/**
 * A single diff item for inserted nodes.
 */
declare interface DiffItemInsert {
    /**
     * The type of diff item.
     */
    type: 'insert';
    /**
     * The name of the inserted elements or `'$text'` for a text node.
     */
    name: string;
    /**
     * Map of attributes that were set on the item while it was inserted.
     */
    attributes: Map<string, any>;
    /**
     * The position where the node was inserted.
     */
    position: Position;
    /**
     * The length of an inserted text node. For elements, it is always 1 as each inserted element is counted as a one.
     */
    length: number;
}
/**
 * A single diff item for removed nodes.
 */
declare interface DiffItemRemove {
    /**
     * The type of diff item.
     */
    type: 'remove';
    /**
     * The name of the removed element or `'$text'` for a text node.
     */
    name: string;
    /**
     * Map of attributes that were set on the item while it was removed.
     */
    attributes: Map<string, any>;
    /**
     * The position where the node was removed.
     */
    position: Position;
    /**
     * The length of a removed text node. For elements, it is always 1, as each removed element is counted as a one.
     */
    length: number;
}
/**
 * A single diff item for attribute change.
 */
declare interface DiffItemAttribute {
    /**
     * The type of diff item.
     */
    type: 'attribute';
    /**
     * The name of the changed attribute.
     */
    attributeKey: string;
    /**
     * An attribute previous value (before change).
     */
    attributeOldValue: any;
    /**
     * An attribute new value (after change).
     */
    attributeNewValue: any;
    /**
     * The range where the change happened.
     */
    range: Range;
}
/**
 * A single diff item for a changed root.
 */
declare interface DiffItemRoot {
    /**
     * Name of the changed root.
     */
    name: string;
    /**
     * Set accordingly if the root got attached or detached. Otherwise, not set.
     */
    state?: 'attached' | 'detached';
    /**
     * Keeps all attribute changes that happened on the root.
     *
     * The keys are keys of the changed attributes. The values are objects containing the attribute value before the change
     * (`oldValue`) and after the change (`newValue`).
     *
     * Note, that if the root state changed (`state` is set), then `attributes` property will not be set. All attributes should be
     * handled together with the root being attached or detached.
     */
    attributes?: {
        [key:string]:{
            oldValue: any,
            newValue: any
        }
    };
}

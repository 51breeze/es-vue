package ckeditor.model;


/**
 * Represents a range in the model tree.
 *
 * A range is defined by its {@link module:engine/model/range~Range#start} and {@link module:engine/model/range~Range#end}
 * positions.
 *
 * You can create range instances via its constructor or the `createRange*()` factory methods of
 * {@link module:engine/model/model~Model} and {@link module:engine/model/writer~Writer}.
 */
declare class Range extends TypeCheckable implements Iterator<TreeWalkerValue> {

    /**
     * Start position.
     */
    const start: Position;
    /**
     * End position.
     */
    const end: Position;
    /**
     * Creates a range spanning from `start` position to `end` position.
     *
     * @param start The start position.
     * @param end The end position. If not set, the range will be collapsed at the `start` position.
     */
    constructor(start: Position, end?: Position | null);

    /**
     * Describes whether the range is collapsed, that is if {@link #start} and
     * {@link #end} positions are equal.
     */
    get isCollapsed(): boolean;
    /**
     * Describes whether this range is flat, that is if {@link #start} position and
     * {@link #end} position are in the same {@link module:engine/model/position~Position#parent}.
     */
    get isFlat(): boolean;
    /**
     * Range root element.
     */
    get root(): Element | DocumentFragment;
    /**
     * Checks whether this range contains given {@link module:engine/model/position~Position position}.
     *
     * @param position Position to check.
     * @returns `true` if given {@link module:engine/model/position~Position position} is contained
     * in this range,`false` otherwise.
     */
    containsPosition(position: Position): boolean;
    /**
     * Checks whether this range contains given {@link ~Range range}.
     *
     * @param otherRange Range to check.
     * @param loose Whether the check is loose or strict. If the check is strict (`false`), compared range cannot
     * start or end at the same position as this range boundaries. If the check is loose (`true`), compared range can start, end or
     * even be equal to this range. Note that collapsed ranges are always compared in strict mode.
     * @returns {Boolean} `true` if given {@link ~Range range} boundaries are contained by this range, `false` otherwise.
     */
    containsRange(otherRange: Range, loose?: boolean): boolean;
    /**
     * Checks whether given {@link module:engine/model/item~Item} is inside this range.
     */
    containsItem(item: Item): boolean;
    /**
     * Two ranges are equal if their {@link #start} and {@link #end} positions are equal.
     *
     * @param otherRange Range to compare with.
     * @returns `true` if ranges are equal, `false` otherwise.
     */
    isEqual(otherRange: Range): boolean;
    /**
     * Checks and returns whether this range intersects with given range.
     *
     * @param otherRange Range to compare with.
     * @returns `true` if ranges intersect, `false` otherwise.
     */
    isIntersecting(otherRange: Range): boolean;
    /**
     * Computes which part(s) of this {@link ~Range range} is not a part of given {@link ~Range range}.
     * Returned array contains zero, one or two {@link ~Range ranges}.
     *
     * Examples:
     *
     * ```ts
     * let range = model.createRange(
     * 	model.createPositionFromPath( root, [ 2, 7 ] ),
     * 	model.createPositionFromPath( root, [ 4, 0, 1 ] )
     * );
     * let otherRange = model.createRange( model.createPositionFromPath( root, [ 1 ] ), model.createPositionFromPath( root, [ 5 ] ) );
     * let transformed = range.getDifference( otherRange );
     * // transformed array has no ranges because `otherRange` contains `range`
     *
     * otherRange = model.createRange( model.createPositionFromPath( root, [ 1 ] ), model.createPositionFromPath( root, [ 3 ] ) );
     * transformed = range.getDifference( otherRange );
     * // transformed array has one range: from [ 3 ] to [ 4, 0, 1 ]
     *
     * otherRange = model.createRange( model.createPositionFromPath( root, [ 3 ] ), model.createPositionFromPath( root, [ 4 ] ) );
     * transformed = range.getDifference( otherRange );
     * // transformed array has two ranges: from [ 2, 7 ] to [ 3 ] and from [ 4 ] to [ 4, 0, 1 ]
     * ```
     *
     * @param otherRange Range to differentiate against.
     * @returns The difference between ranges.
     */
    getDifference(otherRange: Range): Array<Range>;
    /**
     * Returns an intersection of this {@link ~Range range} and given {@link ~Range range}.
     * Intersection is a common part of both of those ranges. If ranges has no common part, returns `null`.
     *
     * Examples:
     *
     * ```ts
     * let range = model.createRange(
     * 	model.createPositionFromPath( root, [ 2, 7 ] ),
     * 	model.createPositionFromPath( root, [ 4, 0, 1 ] )
     * );
     * let otherRange = model.createRange( model.createPositionFromPath( root, [ 1 ] ), model.createPositionFromPath( root, [ 2 ] ) );
     * let transformed = range.getIntersection( otherRange ); // null - ranges have no common part
     *
     * otherRange = model.createRange( model.createPositionFromPath( root, [ 3 ] ), model.createPositionFromPath( root, [ 5 ] ) );
     * transformed = range.getIntersection( otherRange ); // range from [ 3 ] to [ 4, 0, 1 ]
     * ```
     *
     * @param otherRange Range to check for intersection.
     * @returns A common part of given ranges or `null` if ranges have no common part.
     */
    getIntersection(otherRange: Range): Range | null;
    /**
     * Returns a range created by joining this {@link ~Range range} with the given {@link ~Range range}.
     * If ranges have no common part, returns `null`.
     *
     * Examples:
     *
     * ```ts
     * let range = model.createRange(
     * 	model.createPositionFromPath( root, [ 2, 7 ] ),
     * 	model.createPositionFromPath( root, [ 4, 0, 1 ] )
     * );
     * let otherRange = model.createRange(
     * 	model.createPositionFromPath( root, [ 1 ] ),
     * 	model.createPositionFromPath( root, [ 2 ] )
     * );
     * let transformed = range.getJoined( otherRange ); // null - ranges have no common part
     *
     * otherRange = model.createRange(
     * 	model.createPositionFromPath( root, [ 3 ] ),
     * 	model.createPositionFromPath( root, [ 5 ] )
     * );
     * transformed = range.getJoined( otherRange ); // range from [ 2, 7 ] to [ 5 ]
     * ```
     *
     * @param otherRange Range to be joined.
     * @param loose Whether the intersection check is loose or strict. If the check is strict (`false`),
     * ranges are tested for intersection or whether start/end positions are equal. If the check is loose (`true`),
     * compared range is also checked if it's {@link module:engine/model/position~Position#isTouching touching} current range.
     * @returns A sum of given ranges or `null` if ranges have no common part.
     */
    getJoined(otherRange: Range, loose?: boolean): Range | null;
    /**
     * Computes and returns the smallest set of {@link #isFlat flat} ranges, that covers this range in whole.
     *
     * See an example of a model structure (`[` and `]` are range boundaries):
     *
     * ```
     * root                                                            root
     *  |- element DIV                         DIV             P2              P3             DIV
     *  |   |- element H                   H        P1        f o o           b a r       H         P4
     *  |   |   |- "fir[st"             fir[st     lorem                               se]cond     ipsum
     *  |   |- element P1
     *  |   |   |- "lorem"                                              ||
     *  |- element P2                                                   ||
     *  |   |- "foo"                                                    VV
     *  |- element P3
     *  |   |- "bar"                                                   root
     *  |- element DIV                         DIV             [P2             P3]             DIV
     *  |   |- element H                   H       [P1]       f o o           b a r        H         P4
     *  |   |   |- "se]cond"            fir[st]    lorem                               [se]cond     ipsum
     *  |   |- element P4
     *  |   |   |- "ipsum"
     * ```
     *
     * As it can be seen, letters contained in the range are: `stloremfoobarse`, spread across different parents.
     * We are looking for minimal set of flat ranges that contains the same nodes.
     *
     * Minimal flat ranges for above range `( [ 0, 0, 3 ], [ 3, 0, 2 ] )` will be:
     *
     * ```
     * ( [ 0, 0, 3 ], [ 0, 0, 5 ] ) = "st"
     * ( [ 0, 1 ], [ 0, 2 ] ) = element P1 ("lorem")
     * ( [ 1 ], [ 3 ] ) = element P2, element P3 ("foobar")
     * ( [ 3, 0, 0 ], [ 3, 0, 2 ] ) = "se"
     * ```
     *
     * **Note:** if an {@link module:engine/model/element~Element element} is not wholly contained in this range, it won't be returned
     * in any of the returned flat ranges. See in the example how `H` elements at the beginning and at the end of the range
     * were omitted. Only their parts that were wholly in the range were returned.
     *
     * **Note:** this method is not returning flat ranges that contain no nodes.
     *
     * @returns Array of flat ranges covering this range.
     */
    getMinimalFlatRanges(): Array<Range>;
    /**
     * Creates a {@link module:engine/model/treewalker~TreeWalker TreeWalker} instance with this range as a boundary.
     *
     * For example, to iterate over all items in the entire document root:
     *
     * ```ts
     * // Create a range spanning over the entire root content:
     * const range = editor.model.createRangeIn( editor.model.document.getRoot() );
     *
     * // Iterate over all items in this range:
     * for ( const value of range.getWalker() ) {
     * 	console.log( value.item );
     * }
     * ```
     *
     * @param options Object with configuration options. See {@link module:engine/model/treewalker~TreeWalker}.
     */
    getWalker(options?: TreeWalkerOptions): TreeWalker;
    /**
     * Returns an iterator that iterates over all {@link module:engine/model/item~Item items} that are in this range and returns
     * them.
     *
     * This method uses {@link module:engine/model/treewalker~TreeWalker} with `boundaries` set to this range and `ignoreElementEnd` option
     * set to `true`. However it returns only {@link module:engine/model/item~Item model items},
     * not {@link module:engine/model/treewalker~TreeWalkerValue}.
     *
     * You may specify additional options for the tree walker. See {@link module:engine/model/treewalker~TreeWalker} for
     * a full list of available options.
     *
     * @param options Object with configuration options. See {@link module:engine/model/treewalker~TreeWalker}.
     */
    getItems(options?: TreeWalkerOptions): Iterator<Item>;
    /**
     * Returns an iterator that iterates over all {@link module:engine/model/position~Position positions} that are boundaries or
     * contained in this range.
     *
     * This method uses {@link module:engine/model/treewalker~TreeWalker} with `boundaries` set to this range. However it returns only
     * {@link module:engine/model/position~Position positions}, not {@link module:engine/model/treewalker~TreeWalkerValue}.
     *
     * You may specify additional options for the tree walker. See {@link module:engine/model/treewalker~TreeWalker} for
     * a full list of available options.
     *
     * @param options Object with configuration options. See {@link module:engine/model/treewalker~TreeWalker}.
     */
    getPositions(options?: TreeWalkerOptions):Iterator<Position>;
    /**
     * Returns a range that is a result of transforming this range by given `operation`.
     *
     * **Note:** transformation may break one range into multiple ranges (for example, when a part of the range is
     * moved to a different part of document tree). For this reason, an array is returned by this method and it
     * may contain one or more `Range` instances.
     *
     * @param operation Operation to transform range by.
     * @returns Range which is the result of transformation.
     */
    getTransformedByOperation(operation: Operation): Array<Range>;
    /**
     * Returns a range that is a result of transforming this range by multiple `operations`.
     *
     * @see ~Range#getTransformedByOperation
     * @param operations Operations to transform the range by.
     * @returns Range which is the result of transformation.
     */
    getTransformedByOperations(operations: Iterator<Operation>): Array<Range>;
    /**
     * Returns an {@link module:engine/model/element~Element} or {@link module:engine/model/documentfragment~DocumentFragment}
     * which is a common ancestor of the range's both ends (in which the entire range is contained).
     */
    getCommonAncestor(): Element | DocumentFragment | null;
    /**
     * Returns an {@link module:engine/model/element~Element Element} contained by the range.
     * The element will be returned when it is the **only** node within the range and **fully–contained**
     * at the same time.
     */
    getContainedElement(): Element | null;
    /**
     * Converts `Range` to plain object and returns it.
     *
     * @returns `Node` converted to plain object.
     */
    toJSON(): any;
    /**
     * Returns a new range that is equal to current range.
     */
    clone(): this;
   
    /**
     * Creates a `Range` instance from given plain object (i.e. parsed JSON string).
     *
     * @param json Plain object to be converted to `Range`.
     * @param doc Document object that will be range owner.
     * @returns `Range` instance created using given plain object.
     */
    static fromJSON(json: any, doc: Document): Range;
}

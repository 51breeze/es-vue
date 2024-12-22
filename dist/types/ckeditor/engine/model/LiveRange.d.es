package ckeditor.model;

/**
 * `LiveRange` is a type of {@link module:engine/model/range~Range Range}
 * that updates itself as {@link module:engine/model/document~Document document}
 * is changed through operations. It may be used as a bookmark.
 *
 * **Note:** Be very careful when dealing with `LiveRange`. Each `LiveRange` instance bind events that might
 * have to be unbound. Use {@link module:engine/model/liverange~LiveRange#detach detach} whenever you don't need `LiveRange` anymore.
 */
declare class LiveRange  {
    /**
     * Creates a live range.
     *
     * @see module:engine/model/range~Range
     */
    constructor(start: Position, end?: Position | null);
    /**
     * Unbinds all events previously bound by `LiveRange`. Use it whenever you don't need `LiveRange` instance
     * anymore (i.e. when leaving scope in which it was declared or before re-assigning variable that was
     * referring to it).
     */
    detach(): void;
    /**
     * Creates a {@link module:engine/model/range~Range range instance} that is equal to this live range.
     */
    toRange(): Range;
    /**
     * Creates a `LiveRange` instance that is equal to the given range.
     */
    static fromRange(range: Range): LiveRange;
}
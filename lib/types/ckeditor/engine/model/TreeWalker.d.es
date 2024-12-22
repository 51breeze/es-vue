package ckeditor.model;

/**
 * Position iterator class. It allows to iterate forward and backward over the document.
 */
declare class TreeWalker implements Iterator<TreeWalkerValue> {
    /**
     * Walking direction. Defaults `'forward'`.
     */
    const direction: TreeWalkerDirection;
    /**
     * Iterator boundaries.
     *
     * When the iterator is walking `'forward'` on the end of boundary or is walking `'backward'`
     * on the start of boundary, then `{ done: true }` is returned.
     *
     * If boundaries are not defined they are set before first and after last child of the root node.
     */
    const boundaries: Range | null;
    /**
     * Flag indicating whether all consecutive characters with the same attributes should be
     * returned as one {@link module:engine/model/textproxy~TextProxy} (`true`) or one by one (`false`).
     */
    const singleCharacters: boolean;
    /**
     * Flag indicating whether iterator should enter elements or not. If the iterator is shallow child nodes of any
     * iterated node will not be returned along with `elementEnd` tag.
     */
    const shallow: boolean;
    /**
     * Flag indicating whether iterator should ignore `elementEnd` tags. If the option is true walker will not
     * return a parent node of the start position. If this option is `true` each {@link module:engine/model/element~Element} will
     * be returned once, while if the option is `false` they might be returned twice:
     * for `'elementStart'` and `'elementEnd'`.
     */
    const ignoreElementEnd: boolean;
    
    /**
     * Creates a range iterator. All parameters are optional, but you have to specify either `boundaries` or `startPosition`.
     *
     * @param options Object with configuration.
     */
    constructor(options: TreeWalkerOptions);
   
    /**
     * Iterator position. This is always static position, even if the initial position was a
     * {@link module:engine/model/liveposition~LivePosition live position}. If start position is not defined then position depends
     * on {@link #direction}. If direction is `'forward'` position starts form the beginning, when direction
     * is `'backward'` position starts from the end.
     */
    get position(): Position;
    /**
     * Moves {@link #position} in the {@link #direction} skipping values as long as the callback function returns `true`.
     *
     * For example:
     *
     * ```ts
     * walker.skip( value => value.type == 'text' ); // <paragraph>[]foo</paragraph> -> <paragraph>foo[]</paragraph>
     * walker.skip( () => true ); // Move the position to the end: <paragraph>[]foo</paragraph> -> <paragraph>foo</paragraph>[]
     * walker.skip( () => false ); // Do not move the position.
     * ```
     *
     * @param skip Callback function. Gets {@link module:engine/model/treewalker~TreeWalkerValue} and should
     * return `true` if the value should be skipped or `false` if not.
     */
    skip( fn: (value: TreeWalkerValue) => boolean): void;
    /**
     * Gets the next tree walker's value.
     */
    next(): IteratorReturnResult<TreeWalkerValue>;
  
}
/**
 * Type of the step made by {@link module:engine/model/treewalker~TreeWalker}.
 * Possible values: `'elementStart'` if walker is at the beginning of a node, `'elementEnd'` if walker is at the end of node,
 * or `'text'` if walker traversed over text.
 */
declare type TreeWalkerValueType = 'elementStart' | 'elementEnd' | 'text';
/**
 * Object returned by {@link module:engine/model/treewalker~TreeWalker} when traversing tree model.
 */
declare interface TreeWalkerValue {
    type: TreeWalkerValueType;
    /**
     * Item between old and new positions of {@link module:engine/model/treewalker~TreeWalker}.
     */
    item: Item;
    /**
     * Previous position of the iterator.
     * * Forward iteration: For `'elementEnd'` it is the last position inside the element. For all other types it is the
     * position before the item.
     * * Backward iteration: For `'elementStart'` it is the first position inside the element. For all other types it is
     * the position after item.
     */
    previousPosition: Position;
    /**
     * Next position of the iterator.
     * * Forward iteration: For `'elementStart'` it is the first position inside the element. For all other types it is
     * the position after the item.
     * * Backward iteration: For `'elementEnd'` it is last position inside element. For all other types it is the position
     * before the item.
     */
    nextPosition: Position;
    /**
     * Length of the item. For `'elementStart'` it is 1. For `'text'` it is the length of the text. For `'elementEnd'` it is `undefined`.
     */
    length?: number;
}
/**
 * Tree walking direction.
 */
declare type TreeWalkerDirection = 'forward' | 'backward';
/**
 * The configuration of TreeWalker.
 *
 * All parameters are optional, but you have to specify either `boundaries` or `startPosition`.
 */
declare interface TreeWalkerOptions {
    /**
     * Walking direction.
     *
     * @default 'forward'
     */
    direction?: TreeWalkerDirection;
    /**
     * Range to define boundaries of the iterator.
     */
    boundaries?: Range | null;
    /**
     * Starting position.
     */
    startPosition?: Position;
    /**
     * Flag indicating whether all consecutive characters with the same attributes
     * should be returned one by one as multiple {@link module:engine/model/textproxy~TextProxy} (`true`) objects or as one
     * {@link module:engine/model/textproxy~TextProxy} (`false`).
     */
    singleCharacters?: boolean;
    /**
     * Flag indicating whether iterator should enter elements or not. If the
     * iterator is shallow child nodes of any iterated node will not be returned along with `elementEnd` tag.
     */
    shallow?: boolean;
    /**
     * Flag indicating whether iterator should ignore `elementEnd` tags.
     * If the option is true walker will not return a parent node of start position. If this option is `true`
     * each {@link module:engine/model/element~Element} will be returned once, while if the option is `false` they might be returned
     * twice: for `'elementStart'` and `'elementEnd'`.
     */
    ignoreElementEnd?: boolean;
}

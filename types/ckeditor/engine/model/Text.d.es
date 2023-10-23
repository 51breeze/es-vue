package ckeditor.model;

/**
 * Model text node. Type of {@link module:engine/model/node~Node node} that contains {@link module:engine/model/text~Text#data text data}.
 *
 * **Important:** see {@link module:engine/model/node~Node} to read about restrictions using `Text` and `Node` API.
 *
 * **Note:** keep in mind that `Text` instances might indirectly got removed from model tree when model is changed.
 * This happens when {@link module:engine/model/writer~Writer model writer} is used to change model and the text node is merged with
 * another text node. Then, both text nodes are removed and a new text node is inserted into the model. Because of
 * this behavior, keeping references to `Text` is not recommended. Instead, consider creating
 * {@link module:engine/model/liveposition~LivePosition live position} placed before the text node.
 */
declare class Text extends Node {
   
    /**
     * Creates a text node.
     *
     * **Note:** Constructor of this class shouldn't be used directly in the code.
     * Use the {@link module:engine/model/writer~Writer#createText} method instead.
     *
     * @internal
     * @param data Node's text.
     * @param attrs Node's attributes. See {@link module:utils/tomap~toMap} for a list of accepted values.
     */
    constructor(data?: string, attrs?: NodeAttributes);
    /**
     * @inheritDoc
     */
    get offsetSize(): number;
    /**
     * Returns a text data contained in the node.
     */
    get data(): string;
    /**
     * Converts `Text` instance to plain object and returns it.
     *
     * @returns`Text` instance converted to plain object.
     */
    toJSON(): any;
   
    /**
     * Creates a `Text` instance from given plain object (i.e. parsed JSON string).
     *
     * @param json Plain object to be converted to `Text`.
     * @returns `Text` instance created using given plain object.
     */
    static fromJSON(json: any): Text;
}

package ckeditor.model;

/**
 * Type of {@link module:engine/model/element~Element} that is a root of a model tree.
 */
declare class RootElement extends Element {
    /**
     * Unique root name used to identify this root element by {@link module:engine/model/document~Document}.
     */
    const rootName: string;
    
    /**
     * Creates root element.
     *
     * @param document Document that is an owner of this root.
     * @param name Node name.
     * @param rootName Unique root name used to identify this root element by {@link module:engine/model/document~Document}.
     */
    constructor(document: Document, name: string, rootName?: string);
    /**
     * {@link module:engine/model/document~Document Document} that owns this root element.
     */
    get document(): Document;
    /**
     * Informs if the root element is currently attached to the document, or not.
     *
     * A detached root is equivalent to being removed and cannot contain any children or markers.
     *
     * By default, a newly added root is attached. It can be detached using
     * {@link module:engine/model/writer~Writer#detachRoot `Writer#detachRoot`}. A detached root can be re-attached again using
     * {@link module:engine/model/writer~Writer#addRoot `Writer#addRoot`}.
     */
    isAttached(): boolean;
    /**
     * Converts `RootElement` instance to `string` containing its name.
     *
     * @returns `RootElement` instance converted to `string`.
     */
    toJSON(): any;
}

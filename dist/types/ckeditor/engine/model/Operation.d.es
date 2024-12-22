package ckeditor.model;

/**
 * @module engine/model/operation/operation
 */
/**
 * Abstract base operation class.
 */

@abstract
declare class Operation {
    /**
     * {@link module:engine/model/document~Document#version} on which operation can be applied. If you try to
     * {@link module:engine/model/model~Model#applyOperation apply} operation with different base version than the
     * {@link module:engine/model/document~Document#version document version} the
     * {@link module:utils/ckeditorerror~CKEditorError model-document-applyOperation-wrong-version} error is thrown.
     */
    baseVersion: number | null;
    /**
     * Defines whether operation is executed on attached or detached {@link module:engine/model/item~Item items}.
     */
    const isDocumentOperation: boolean;
    /**
     * {@link module:engine/model/batch~Batch Batch} to which the operation is added or `null` if the operation is not
     * added to any batch yet.
     */
    batch: Batch | null;
    /**
     * Operation type.
     */
    const type: string;
    /**
     * Base operation constructor.
     *
     * @param baseVersion Document {@link module:engine/model/document~Document#version} on which operation
     * can be applied or `null` if the operation operates on detached (non-document) tree.
     */
    constructor(baseVersion: number | null);
    /**
     * A selectable that will be affected by the operation after it is executed.
     *
     * The exact returned parameter differs between operation types.
     */
    get affectedSelectable(): Selectable;
    /**
     * Creates and returns an operation that has the same parameters as this operation.
     *
     * @returns Clone of this operation.
     */
    clone(): Operation;
    /**
     * Creates and returns a reverse operation. Reverse operation when executed right after
     * the original operation will bring back tree model state to the point before the original
     * operation execution. In other words, it reverses changes done by the original operation.
     *
     * Keep in mind that tree model state may change since executing the original operation,
     * so reverse operation will be "outdated". In that case you will need to transform it by
     * all operations that were executed after the original operation.
     *
     * @returns Reversed operation.
     */
    getReversed(): Operation;
  
    /**
     * Custom toJSON method to solve child-parent circular dependencies.
     *
     * @returns Clone of this object with the operation property replaced with string.
     */
    toJSON(): any;
    /**
     * Name of the operation class used for serialization.
     */
    static get className(): string;
    /**
     * Creates `Operation` object from deserialized object, i.e. from parsed JSON string.
     *
     * @param json Deserialized JSON object.
     * @param doc Document on which this operation will be applied.
     */
    static fromJSON(json: any, document: Document): Operation;
}

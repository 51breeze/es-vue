package ckeditor.ui.boxed;

import ckeditor.utils.Locale
import ckeditor.ui.EditorUIView


/**
 * The boxed editor UI view class. This class represents an editor interface
 * consisting of a toolbar and an editable area, enclosed within a box.
 */

@abstract
declare class BoxedEditorUIView extends EditorUIView {

    /**
     * Collection of the child views located in the top (`.ck-editor__top`)
     * area of the UI.
     */
    const top: any;
    /**
     * Collection of the child views located in the main (`.ck-editor__main`)
     * area of the UI.
     */
    const main: any;
   
    /**
     * Creates an instance of the boxed editor UI view class.
     *
     * @param locale The locale instance..
     */
    constructor(locale: Locale);
}

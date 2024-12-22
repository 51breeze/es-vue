package ckeditor.ui;

import ckeditor.ui.View
import ckeditor.utils.Locale
import ckeditor.utils.LocaleTranslate

/**
 * The editor UI view class. Base class for the editor main views.
 */
@abstract
declare class EditorUIView extends View<Element> {
    /**
     * Collection of the child views, detached from the DOM
     * structure of the editor, like panels, icons etc.
     */
    const body: any;
    locale: Locale;
    t: LocaleTranslate;
    get editable(): any;
    /**
     * Creates an instance of the editor UI view class.
     *
     * @param locale The locale instance.
     */
    constructor(locale: Locale);
    /**
     * @inheritDoc
     */
    render(): void;
    /**
     * @inheritDoc
     */
    destroy(): void;
}

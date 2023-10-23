package ckeditor.core;

import ckeditor.utils.Locale
import ckeditor.ui.boxed.BoxedEditorUIView;

/**
 * Classic editor UI view. Uses an inline editable and a sticky toolbar, all
 * enclosed in a boxed UI view.
 */
declare class EditorUIView extends BoxedEditorUIView {
    /**
     * Sticky panel view instance. This is a parent view of a {@link #toolbar}
     * that makes toolbar sticky.
     */
    const stickyPanel: any;
    /**
     * Toolbar view instance.
     */
    const toolbar: any;
    /**
     * Editable UI view.
     */
    const editable: any;
    /**
     * Creates an instance of the classic editor UI view.
     *
     * @param locale The {@link module:core/editor/editor~Editor#locale} instance.
     * @param editingView The editing view instance this view is related to.
     * @param options Configuration options for the view instance.
     * @param options.shouldToolbarGroupWhenFull When set `true` enables automatic items grouping
     * in the main {@link module:editor-classic/classiceditoruiview~ClassicEditorUIView#toolbar toolbar}.
     * See {@link module:ui/toolbar/toolbarview~ToolbarOptions#shouldGroupWhenFull} to learn more.
     */
    constructor(locale: Locale, editingView: any, options?: {
        shouldToolbarGroupWhenFull?: boolean
    });
    /**
     * @inheritDoc
     */
    render(): void;
}

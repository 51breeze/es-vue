package ckeditor.ui;

import ckeditor.core.IEditor;


/**
* A class providing the minimal interface that is required to successfully bootstrap any editor UI.
*/
declare class EditorUI {
    /**
    * The editor that the UI belongs to.
    */
    const editor: IEditor;
    /**
    * An instance of the {@link module:ui/componentfactory~ComponentFactory}, a registry used by plugins
    * to register factories of specific UI components.
    */
    const componentFactory: any;
    /**
    * Stores the information about the editor UI focus and propagates it so various plugins and components
    * are unified as a focus group.
    */
    const focusTracker: any;
    /**
    * Manages the tooltips displayed on mouseover and focus across the UI.
    */
    const tooltipManager: any;
    /**
    * A helper that enables the "powered by" feature in the editor and renders a link to the project's webpage.
    */
    const poweredBy: any;
    /**
    * Indicates the UI is ready. Set `true` after {@link #event:ready} event is fired.
    *
    * @readonly
    * @default false
    */
    get isReady(): boolean;

    get view(): any;
    /**
    * Stores viewport offsets from every direction.
    *
    * Viewport offset can be used to constrain balloons or other UI elements into an element smaller than the viewport.
    * This can be useful if there are any other absolutely positioned elements that may interfere with editor UI.
    *
    * Example `editor.ui.viewportOffset` returns:
    *
    * ```js
    * {
    * 	top: 50,
    * 	right: 50,
    * 	bottom: 50,
    * 	left: 50
    * }
    * ```
    *
    * This property can be overriden after editor already being initialized:
    *
    * ```js
    * editor.ui.viewportOffset = {
    * 	top: 100,
    * 	right: 0,
    * 	bottom: 0,
    * 	left: 0
    * };
    * ```
    *
    * @observable
    */
    viewportOffset: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number
    };

    /**
    * Creates an instance of the editor UI class.
    *
    * @param editor The editor instance.
    */
    constructor(editor: IEditor);
    /**
    * The main (outermost) DOM element of the editor UI.
    *
    * For example, in {@link module:editor-classic/classiceditor~ClassicEditor} it is a `<div>` which
    * wraps the editable element and the toolbar. In {@link module:editor-inline/inlineeditor~InlineEditor}
    * it is the editable element itself (as there is no other wrapper). However, in
    * {@link module:editor-decoupled/decouplededitor~DecoupledEditor} it is set to `null` because this editor does not
    * come with a single "main" HTML element (its editable element and toolbar are separate).
    *
    * This property can be understood as a shorthand for retrieving the element that a specific editor integration
    * considers to be its main DOM element.
    */
    get element(): HTMLElement | null;
    /**
    * Fires the {@link module:ui/editorui/editorui~EditorUI#event:update `update`} event.
    *
    * This method should be called when the editor UI (e.g. positions of its balloons) needs to be updated due to
    * some environmental change which CKEditor 5 is not aware of (e.g. resize of a container in which it is used).
    */
    update(): void;
    /**
    * Destroys the UI.
    */
    destroy(): void;
    /**
    * Stores the native DOM editable element used by the editor under a unique name.
    *
    * Also, registers the element in the editor to maintain the accessibility of the UI. When the user is editing text in a focusable
    * editable area, they can use the <kbd>Alt</kbd> + <kbd>F10</kbd> keystroke to navigate over editor toolbars. See {@link #addToolbar}.
    *
    * @param rootName The unique name of the editable element.
    * @param domElement The native DOM editable element.
    */
    setEditableElement(rootName: string, domElement: HTMLElement): void;
    /**
    * Removes the editable from the editor UI. Removes all handlers added by {@link #setEditableElement}.
    *
    * @param rootName The name of the editable element to remove.
    */
    removeEditableElement(rootName: string): void;
    /**
    * Returns the editable editor element with the given name or null if editable does not exist.
    *
    * @param rootName The editable name.
    */
    getEditableElement(rootName?: string): HTMLElement|null;
    /**
    * Returns array of names of all editor editable elements.
    */
    getEditableElementsNames(): Iterator<string>;
    /**
    * Adds a toolbar to the editor UI. Used primarily to maintain the accessibility of the UI.
    *
    * Focusable toolbars can be accessed (focused) by users by pressing the <kbd>Alt</kbd> + <kbd>F10</kbd> keystroke.
    * Successive keystroke presses navigate over available toolbars.
    *
    * @param toolbarView A instance of the toolbar to be registered.
    */
    addToolbar(toolbarView: any, options?: any): void;
}
package ckeditor.utils;

/**
 * Information about the keystroke.
 */
declare interface KeystrokeInfo {
    /**
     * The [key code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode).
     */
    keyCode: number;
    /**
     * Whether the <kbd>Alt</kbd> modifier was pressed.
     */
    altKey: boolean;
    /**
     * Whether the <kbd>Cmd</kbd> modifier was pressed.
     */
    metaKey: boolean;
    /**
     * Whether the <kbd>Ctrl</kbd> modifier was pressed.
     */
    ctrlKey: boolean;
    /**
     * Whether the <kbd>Shift</kbd> modifier was pressed.
     */
    shiftKey: boolean;
}


declare interface ReadonlyKeystrokeInfo {
    /**
     * The [key code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode).
     */
    const keyCode: number;
    /**
     * Whether the <kbd>Alt</kbd> modifier was pressed.
     */
    const altKey: boolean;
    /**
     * Whether the <kbd>Cmd</kbd> modifier was pressed.
     */
    const metaKey: boolean;
    /**
     * Whether the <kbd>Ctrl</kbd> modifier was pressed.
     */
    const ctrlKey: boolean;
    /**
     * Whether the <kbd>Shift</kbd> modifier was pressed.
     */
    const shiftKey: boolean;
}

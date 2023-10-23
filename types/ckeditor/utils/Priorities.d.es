package ckeditor.utils;

/**
 * String representing a priority value.
 */
declare type PriorityString = 'highest' | 'high' | 'normal' | 'low' | 'lowest' | number;

/**
 * Provides group of constants to use instead of hardcoding numeric priority values.
 */
declare interface PrioritiesType {
    /**
     * Converts a string with priority name to it's numeric value. If `Number` is given, it just returns it.
     *
     * @param priority Priority to convert.
     * @returns Converted priority.
     */
    get(priority?: PriorityString): number;
    const highest: number;
    const high: number;
    const normal: number;
    const low: number;
    const lowest: number;
}
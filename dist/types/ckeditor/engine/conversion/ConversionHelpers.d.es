package ckeditor.engine;

/**
 * @module engine/conversion/conversionhelpers
 */
/**
 * Base class for conversion helpers.
 */
declare class ConversionHelpers<TDispatcher> {
 
    /**
     * Creates a conversion helpers instance.
     */
    constructor(dispatchers: Array<TDispatcher>);
    /**
     * Registers a conversion helper.
     *
     * **Note**: See full usage example in the `{@link module:engine/conversion/conversion~Conversion#for conversion.for()}`
     * method description.
     *
     * @param conversionHelper The function to be called on event.
     */
    add(conversionHelper: (dispatcher: TDispatcher) => void): this;
}

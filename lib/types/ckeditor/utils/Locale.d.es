package ckeditor.utils;
/**
* String representing a language direction.
*/
declare type LanguageDirection = 'ltr' | 'rtl';

/**
* Represents the localization services.
*/
declare class Locale {
    /**
    * The editor UI language code in the [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) format.
    *
    * If the {@link #contentLanguage content language} was not specified in the `Locale` constructor,
    * it also defines the language of the content.
    */
    const uiLanguage: string;

    /**
    * Text direction of the {@link #uiLanguage editor UI language}. Either `'ltr'` or `'rtl'`.
    */
    const uiLanguageDirection: LanguageDirection;

    /**
    * The editor content language code in the [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) format.
    *
    * Usually the same as the {@link #uiLanguage editor language}, it can be customized by passing an optional
    * argument to the `Locale` constructor.
    */
    const contentLanguage: string;

    /**
    * Text direction of the {@link #contentLanguage editor content language}.
    *
    * If the content language was passed directly to the `Locale` constructor, this property represents the
    * direction of that language.
    *
    * If the {@link #contentLanguage editor content language} was derived from the {@link #uiLanguage editor language},
    * the content language direction is the same as the {@link #uiLanguageDirection UI language direction}.
    *
    * The value is either `'ltr'` or `'rtl'`.
    */
    const contentLanguageDirection: LanguageDirection;

    /**
    * Translates the given message to the {@link #uiLanguage}. This method is also available in
    * {@link module:core/editor/editor~Editor#t `Editor`} and {@link module:ui/view~View#t `View`}.
    *
    * This method's context is statically bound to the `Locale` instance and **should always be called as a function**:
    *
    * ```ts
    * const t = locale.t;
    * t( 'Label' );
    * ```
    *
    * The message can be either a string or an object implementing the {@link module:utils/translation-service~Message} interface.
    *
    * The message may contain placeholders (`%<index>`) for value(s) that are passed as a `values` parameter.
    * For an array of values, the `%<index>` will be changed to an element of that array at the given index.
    * For a single value passed as the second argument, only the `%0` placeholders will be changed to the provided value.
    *
    * ```ts
    * t( 'Created file "%0" in %1ms.', [ fileName, timeTaken ] );
    * t( 'Created file "%0", fileName );
    * ```
    *
    * The message supports plural forms. To specify the plural form, use the `plural` property. Singular or plural form
    * will be chosen depending on the first value from the passed `values`. The value of the `plural` property is used
    * as a default plural translation when the translation for the target language is missing.
    *
    * ```ts
    * t( { string: 'Add a space', plural: 'Add %0 spaces' }, 1 ); // 'Add a space' for the English language.
    * t( { string: 'Add a space', plural: 'Add %0 spaces' }, 5 ); // 'Add 5 spaces' for the English language.
    * t( { string: '%1 a space', plural: '%1 %0 spaces' }, [ 2, 'Add' ] ); // 'Add 2 spaces' for the English language.
    *
    * t( { string: 'Add a space', plural: 'Add %0 spaces' }, 1 ); // 'Dodaj spację' for the Polish language.
    * t( { string: 'Add a space', plural: 'Add %0 spaces' }, 5 ); // 'Dodaj 5 spacji' for the Polish language.
    * t( { string: '%1 a space', plural: '%1 %0 spaces' }, [ 2, 'Add' ] ); // 'Dodaj 2 spacje' for the Polish language.
    * ```
    *
    *  * The message should provide an ID using the `id` property when the message strings are not unique and their
    * translations should be different.
    *
    * ```ts
    * translate( 'en', { string: 'image', id: 'ADD_IMAGE' } );
    * translate( 'en', { string: 'image', id: 'AN_IMAGE' } );
    * ```
    */
    const t: LocaleTranslate;

    /**
    * Creates a new instance of the locale class. Learn more about
    * {@glink features/ui-language configuring the language of the editor}.
    *
    * @param options Locale configuration.
    * @param options.uiLanguage The editor UI language code in the
    * [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) format. See {@link #uiLanguage}.
    * @param options.contentLanguage The editor content language code in the
    * [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) format. If not specified, the same as `options.language`.
    * See {@link #contentLanguage}.
    */
    constructor(props?:{ uiLanguage, contentLanguage, [key:string]:any });

    /**
    * The editor UI language code in the [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) format.
    *
    * **Note**: This property was deprecated. Please use {@link #uiLanguage} and {@link #contentLanguage}
    * properties instead.
    *
    * @deprecated
    */
    get language(): string;
}

/**
* @param message A message that will be localized (translated).
* @param values A value or an array of values that will fill message placeholders.
* For messages supporting plural forms the first value will determine the plural form.
*/
declare type LocaleTranslate = (message: string | Message, values?: number | string | Array<number | string>) => string;


declare interface Message {
    /**
    * The message string to translate. Acts as a default translation if the translation for a given language
    * is not defined. When the message is supposed to support plural forms, the string should be the English singular form of the message.
    */
    const string: string;
    /**
    * The message ID. If passed, the message ID is taken from this property instead of the `message.string`.
    * This property is useful when various messages share the same message string, for example, the `editor` string in `in the editor`
    * and `my editor` sentences.
    */
    const id?: string;
    /**
    * The plural form of the message. This property should be skipped when a message is not supposed
    * to support plural forms. Otherwise it should always be set to a string with the English plural form of the message.
    */
    const plural?: string;
}
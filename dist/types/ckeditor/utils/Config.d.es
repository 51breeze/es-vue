package ckeditor.utils;

declare class Config<Cfg> {

    /**
    * Creates an instance of the {@link ~Config} class.
    *
    * @param configurations The initial configurations to be set. Usually, provided by the user.
    * @param defaultConfigurations The default configurations. Usually, provided by the system.
    */
    constructor(configurations?: Cfg, defaultConfigurations?: Cfg);
    /**
    * Set configuration values.
    *
    * It also accepts setting a "deep configuration" by using dots in the name. For example, `'resize.width'` sets
    * the value for the `width` configuration in the `resize` subset.
    *
    * ```ts
    * config.set( 'resize.width', 500 );
    * ```
    *
    * It accepts both a name/value pair or an object, which properties and values will be used to set
    * configurations. See {@link #set:CONFIG_OBJECT}.
    *
    * @label KEY_VALUE
    * @param name The configuration name. Configuration names are case-sensitive.
    * @param value The configuration value.
    */
    set<K extends string>(name: K, value: Cfg): void;
    /**
    * Set configuration values.
    *
    * It accepts an object, which properties and values will be used to set configurations.
    *
    * ```ts
    * config.set( {
    * 	width: 500
    * 	toolbar: {
    * 		collapsed: true
    * 	}
    * } );
    *
    * // Equivalent to:
    * config.set( 'width', 500 );
    * config.set( 'toolbar.collapsed', true );
    * ```
    *
    * Passing an object as the value will amend the configuration, not replace it.
    *
    * ```ts
    * config.set( 'toolbar', {
    * 	collapsed: true,
    * } );
    *
    * config.set( 'toolbar', {
    * 	color: 'red',
    * } );
    *
    * config.get( 'toolbar.collapsed' ); // true
    * config.get( 'toolbar.color' ); // 'red'
    * ```
    *
    * It accepts both a name/value pair or an object, which properties and values will be used to set
    * configurations. See {@link #set:KEY_VALUE}.
    *
    * @label CONFIG_OBJECT
    * @param config The configuration object from which take properties as
    * configuration entries. Configuration names are case-sensitive.
    */
    set(config: Cfg): void;
    /**
    * Does exactly the same as {@link #set:KEY_VALUE} with one exception – passed configuration extends
    * existing one, but does not overwrite already defined values.
    *
    * This method is supposed to be called by plugin developers to setup plugin's configurations. It would be
    * rarely used for other needs.
    *
    * @label KEY_VALUE
    * @param name The configuration name. Configuration names are case-sensitive.
    * @param value The configuration value.
    */
    define<K extends string>(name: K, value: Cfg): void;
    /**
    * Does exactly the same as {@link #set:CONFIG_OBJECT} with one exception – passed configuration extends
    * existing one, but does not overwrite already defined values.
    *
    * This method is supposed to be called by plugin developers to setup plugin's configurations. It would be
    * rarely used for other needs.
    *
    * @label CONFIG_OBJECT
    * @param config The configuration object from which take properties as
    * configuration entries. Configuration names are case-sensitive.
    */
    define(config: Cfg): void;
    /**
    * Gets the value for a configuration entry.
    *
    * ```ts
    * config.get( 'name' );
    * ```
    *
    * Deep configurations can be retrieved by separating each part with a dot.
    *
    * ```ts
    * config.get( 'toolbar.collapsed' );
    * ```
    *
    * @param name The configuration name. Configuration names are case-sensitive.
    * @returns The configuration value or `undefined` if the configuration entry was not found.
    */
    get<K extends string>(name: K): Cfg;
    /**
    * Iterates over all top level configuration names.
    */
    names(): Iterator<string>;
}
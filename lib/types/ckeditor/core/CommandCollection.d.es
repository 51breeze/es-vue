package ckeditor.core;

/**
* Collection of commands. Its instance is available in {@link module:core/editor/editor~Editor#commands `editor.commands`}.
*/
declare class CommandCollection implements Iterator<[string, Command]> {

    /**
    * Creates collection instance.
    */
    constructor();
    /**
    * Registers a new command.
    *
    * @param commandName The name of the command.
    */
    add<TName extends string>(commandName: TName, command: CommandsMap[TName]): void;
    /**
    * Retrieves a command from the collection.
    *
    * @param commandName The name of the command.
    */
    get<TName extends string>(commandName: TName): CommandsMap[TName];
    /**
    * Executes a command.
    *
    * @param commandName The name of the command.
    * @param commandParams Command parameters.
    * @returns The value returned by the {@link module:core/command~Command#execute `command.execute()`}.
    */
    execute(commandName: string, ...commandParams: any[]): any;
    /**
    * Returns iterator of command names.
    */
    names(): Iterator<string>;
    /**
    * Returns iterator of command instances.
    */
    commands(): Iterator<Command>;

    /**
    * Destroys all collection commands.
    */
    destroy(): void;
}


/**
 * Helper type that maps command names to their types.
 * It is meant to be extended with module augmentation.
 *
 * ```ts
 * class MyCommand extends Command {
 * 	public execute( parameter: A ): B {
 * 		// ...
 * 	}
 * }
 *
 * declare module '@ckeditor/ckeditor5-core' {
 * 	interface CommandsMap {
 * 		myCommand: MyCommand;
 * 	}
 * }
 *
 * // Returns `MyCommand | undefined`.
 * const myCommand = editor.commands.get( 'myCommand' );
 *
 * // Expects `A` type as parameter and returns `B`.
 * const value = editor.commands.execute( 'myCommand', new A() );
 * ```
 */
declare interface CommandsMap {
    [name: string]: Command;
}
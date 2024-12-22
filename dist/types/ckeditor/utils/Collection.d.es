package ckeditor.utils;

import ckeditor.core.IEditor;

declare class CollectionFactory<S,T>{
    constructor(items:S):T
}

declare interface CollectionBindToChain<S, T> {
    /**
    * Creates the class factory binding in which items of the source collection are passed to
    * the constructor of the specified class.
    *
    * @param Class The class constructor used to create instances in the factory.
    */
    as(classObject: class<CollectionFactory<S,T>>): void;
    /**
    * Creates a callback or a property binding.
    *
    * @param callbackOrProperty When the function is passed, it should return
    * the collection items. When the string is provided, the property value is used to create the bound collection items.
    */
    using(callbackOrProperty: keyof S): void;
    using(callbackOrProperty: (item: S) => T | null): void;
}

/**
* Collections are ordered sets of objects. Items in the collection can be retrieved by their indexes
* in the collection (like in an array) or by their ids.
*
* If an object without an `id` property is being added to the collection, the `id` property will be generated
* automatically. Note that the automatically generated id is unique only within this single collection instance.
*
* By default an item in the collection is identified by its `id` property. The name of the identifier can be
* configured through the constructor of the collection.
*
* @typeParam T The type of the collection element.
*/
declare class Collection<T> implements Iterator<T> {

    /**
    * Creates a new Collection instance.
    *
    * You can pass a configuration object as the argument of the constructor:
    *
    * ```ts
    * const emptyCollection = new Collection<{ name: string }>( { idProperty: 'name' } );
    * emptyCollection.add( { name: 'John' } );
    * console.log( collection.get( 'John' ) ); // -> { name: 'John' }
    * ```
    *
    * The collection is empty by default. You can add new items using the {@link #add} method:
    *
    * ```ts
    * const collection = new Collection<{ id: string }>();
    *
    * collection.add( { id: 'John' } );
    * console.log( collection.get( 0 ) ); // -> { id: 'John' }
    * ```
    *
    * @label NO_ITEMS
    * @param options The options object.
    * @param options.idProperty The name of the property which is used to identify an item.
    * Items that do not have such a property will be assigned one when added to the collection.
    */
    constructor(options?: {
        idProperty?: string
    });

    /**
    * Creates a new Collection instance with specified initial items.
    *
    * ```ts
    * const collection = new Collection<{ id: string }>( [ { id: 'John' }, { id: 'Mike' } ] );
    *
    * console.log( collection.get( 0 ) ); // -> { id: 'John' }
    * console.log( collection.get( 1 ) ); // -> { id: 'Mike' }
    * console.log( collection.get( 'Mike' ) ); // -> { id: 'Mike' }
    * ```
    *
    * You can always pass a configuration object as the last argument of the constructor:
    *
    * ```ts
    * const nonEmptyCollection = new Collection<{ name: string }>( [ { name: 'John' } ], { idProperty: 'name' } );
    * nonEmptyCollection.add( { name: 'George' } );
    * console.log( collection.get( 'George' ) ); // -> { name: 'George' }
    * console.log( collection.get( 'John' ) ); // -> { name: 'John' }
    * ```
    *
    * @label INITIAL_ITEMS
    * @param initialItems The initial items of the collection.
    * @param options The options object.
    * @param options.idProperty The name of the property which is used to identify an item.
    * Items that do not have such a property will be assigned one when added to the collection.
    */
    constructor(initialItems: Iterator<T>, options?: {
        idProperty?: string
    });

    /**
    * The number of items available in the collection.
    */
    get length(): number;
    /**
    * Returns the first item from the collection or null when collection is empty.
    */
    get first(): T | null;
    /**
    * Returns the last item from the collection or null when collection is empty.
    */
    get last(): T | null;
    /**
    * Adds an item into the collection.
    *
    * If the item does not have an id, then it will be automatically generated and set on the item.
    *
    * @param item
    * @param index The position of the item in the collection. The item
    * is pushed to the collection when `index` not specified.
    * @fires add
    * @fires change
    */
    add(item: T, index?: number): this;
    /**
    * Adds multiple items into the collection.
    *
    * Any item not containing an id will get an automatically generated one.
    *
    * @param items
    * @param index The position of the insertion. Items will be appended if no `index` is specified.
    * @fires add
    * @fires change
    */
    addMany(items: Iterator<T>, index?: number): this;
    /**
    * Gets an item by its ID or index.
    *
    * @param idOrIndex The item ID or index in the collection.
    * @returns The requested item or `null` if such item does not exist.
    */
    get(idOrIndex: string | number): T | null;
    /**
    * Returns a Boolean indicating whether the collection contains an item.
    *
    * @param itemOrId The item or its ID in the collection.
    * @returns `true` if the collection contains the item, `false` otherwise.
    */
    has(itemOrId: T | string): boolean;
    /**
    * Gets an index of an item in the collection.
    * When an item is not defined in the collection, the index will equal -1.
    *
    * @param itemOrId The item or its ID in the collection.
    * @returns The index of a given item.
    */
    getIndex(itemOrId: T | string): number;
    /**
    * Removes an item from the collection.
    *
    * @param subject The item to remove, its ID or index in the collection.
    * @returns The removed item.
    * @fires remove
    * @fires change
    */
    remove(subject: T | number | string): T;
    /**
    * Executes the callback for each item in the collection and composes an array or values returned by this callback.
    *
    * @typeParam U The result type of the callback.
    * @param callback
    * @param ctx Context in which the `callback` will be called.
    * @returns The result of mapping.
    */
    map<U>(callback: (item: T, index: number) => U, ctx?: any): Array<U>;
    /**
    * Finds the first item in the collection for which the `callback` returns a true value.
    *
    * @param callback
    * @param ctx Context in which the `callback` will be called.
    * @returns The item for which `callback` returned a true value.
    */
    find(callback: (item: T, index: number) => boolean, ctx?: any): T;
    /**
    * Returns an array with items for which the `callback` returned a true value.
    *
    * @param callback
    * @param ctx Context in which the `callback` will be called.
    * @returns The array with matching items.
    */
    filter(callback: (item: T, index: number) => boolean, ctx?: any): Array<T>;
    /**
    * Removes all items from the collection and destroys the binding created using
    * {@link #bindTo}.
    *
    * @fires remove
    * @fires change
    */
    clear(): void;
    /**
    * Binds and synchronizes the collection with another one.
    *
    * The binding can be a simple factory:
    *
    * ```ts
    * class FactoryClass {
    * 	public label: string;
    *
    * 	constructor( data: { label: string } ) {
    * 		this.label = data.label;
    * 	}
    * }
    *
    * const source = new Collection<{ label: string }>( { idProperty: 'label' } );
    * const target = new Collection<FactoryClass>();
    *
    * target.bindTo( source ).as( FactoryClass );
    *
    * source.add( { label: 'foo' } );
    * source.add( { label: 'bar' } );
    *
    * console.log( target.length ); // 2
    * console.log( target.get( 1 ).label ); // 'bar'
    *
    * source.remove( 0 );
    * console.log( target.length ); // 1
    * console.log( target.get( 0 ).label ); // 'bar'
    * ```
    *
    * or the factory driven by a custom callback:
    *
    * ```ts
    * class FooClass {
    * 	public label: string;
    *
    * 	constructor( data: { label: string } ) {
    * 		this.label = data.label;
    * 	}
    * }
    *
    * class BarClass {
    * 	public label: string;
    *
    * 	constructor( data: { label: string } ) {
    * 		this.label = data.label;
    * 	}
    * }
    *
    * const source = new Collection<{ label: string }>( { idProperty: 'label' } );
    * const target = new Collection<FooClass | BarClass>();
    *
    * target.bindTo( source ).using( ( item ) => {
    * 	if ( item.label == 'foo' ) {
    * 		return new FooClass( item );
    * 	} else {
    * 		return new BarClass( item );
    * 	}
    * } );
    *
    * source.add( { label: 'foo' } );
    * source.add( { label: 'bar' } );
    *
    * console.log( target.length ); // 2
    * console.log( target.get( 0 ) instanceof FooClass ); // true
    * console.log( target.get( 1 ) instanceof BarClass ); // true
    * ```
    *
    * or the factory out of property name:
    *
    * ```ts
    * const source = new Collection<{ nested: { value: string } }>();
    * const target = new Collection<{ value: string }>();
    *
    * target.bindTo( source ).using( 'nested' );
    *
    * source.add( { nested: { value: 'foo' } } );
    * source.add( { nested: { value: 'bar' } } );
    *
    * console.log( target.length ); // 2
    * console.log( target.get( 0 ).value ); // 'foo'
    * console.log( target.get( 1 ).value ); // 'bar'
    * ```
    *
    * It's possible to skip specified items by returning null value:
    *
    * ```ts
    * const source = new Collection<{ hidden: boolean }>();
    * const target = new Collection<{ hidden: boolean }>();
    *
    * target.bindTo( source ).using( item => {
    * 	if ( item.hidden ) {
    * 		return null;
    * 	}
    *
    * 	return item;
    * } );
    *
    * source.add( { hidden: true } );
    * source.add( { hidden: false } );
    *
    * console.log( source.length ); // 2
    * console.log( target.length ); // 1
    * ```
    *
    * **Note**: {@link #clear} can be used to break the binding.
    *
    * @typeParam S The type of `externalCollection` element.
    * @param externalCollection A collection to be bound.
    * @returns The binding chain object.
    */
    bindTo<S extends {[key:string]:any}>(externalCollection: Collection<S>): CollectionBindToChain<S, T>;

}
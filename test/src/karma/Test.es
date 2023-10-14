import karma.Index;

//const classObject = System.getDefinitionByName( System.getQualifiedClassName(Index) )

const classObject = System.getDefinitionByName<Index>('karma.Index')

console.log( Index )

//Index.main()

classObject.main();
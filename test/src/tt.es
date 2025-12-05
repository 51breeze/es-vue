(e:MouseEvent,scope:web.ui.ColumnDefaultScope<DataRow>)=>{

  scope.column.sortMethod=(a, b)=>{
       const aa = a;

		
	    
    
      return 1;
  }

}

declare type FieldType = 'string' | 'number' | 'boolean'
declare type DataColumn = {type:FieldType, raw:string, kind:'input'}
declare type DataRow = {
	"mf81zca83ct7":DataColumn,
	"mf81zca83ct6":DataColumn
}
declare type ScopeType={
	$index:number,
	cellIndex:number,
	row:DataRow,
	column:Record<any, string>,
	store:Record<Function, string>
}
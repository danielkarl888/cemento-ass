export interface Column {
    id: string;
    ordinalNo: number;
    title: string;
    type: string;
    width?: number;
  }
  
  export interface Row {
    id: string;
    [columnId: string]: any;
  }
  
  export interface TableData {
    columns: Column[];
    data: Row[];
  }
  
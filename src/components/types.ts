export type Column = {
    id: string;
    ordinalNo: number;
    title: string;
    type: string;
    width?: number;
    hidden?: boolean;
    options?: string[];
  };
  
  export type Row = {
    id: string;
    [columnId: string]: any;
  };
  
  export type TableData = {
    columns: Column[];
    data: Row[];
  };
  
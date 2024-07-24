import React from "react";
import { Form } from "react-bootstrap";
import { Column } from "./types";

type ColumnFilterProps = {
  columns: Column[];
  handleFilterChange: (columnId: string, checked: boolean) => void;
};

const ColumnFilter: React.FC<ColumnFilterProps> = ({
  columns,
  handleFilterChange,
}) => {
  return (
    <Form>
      {columns.map((column) => (
        <Form.Switch
          key={column.id}
          type="checkbox"
          label={column.title}
          checked={!column.hidden}
          onChange={(e) => handleFilterChange(column.id, e.target.checked)}
        />
      ))}
    </Form>
  );
};

export default ColumnFilter;

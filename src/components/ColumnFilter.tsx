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
      {/* Loop through each column to create filter switches */}
      {columns.map((column) => (
        <Form.Switch
          key={column.id}
          type="checkbox"
          label={column.title}
          checked={!column.hidden} // Show the column if not hidden
          onChange={
            (e) => handleFilterChange(column.id, e.target.checked) // Handle filter change
          }
        />
      ))}
    </Form>
  );
};

export default ColumnFilter;

import React from "react";
import { Dropdown, DropdownButton, Form } from "react-bootstrap";
import { Column } from "../type/table_types";

type ColumnFilterProps = {
  columns: Column[];
  handleFilterChange: (columnId: string, checked: boolean) => void;
};

const ColumnFilter: React.FC<ColumnFilterProps> = ({
  columns,
  handleFilterChange,
}) => {
  return (
    <DropdownButton id="column-filter-dropdown" title="Filter Columns">
      {columns.map((column) => (
        <Dropdown.ItemText
          key={column.id}
          as="div"
          className="dropdown-item-no-click"
        >
          <Form.Switch
            type="checkbox"
            label={column.title}
            checked={!column.hidden}
            onChange={(e) => handleFilterChange(column.id, e.target.checked)}
          />
        </Dropdown.ItemText>
      ))}
    </DropdownButton>
  );
};

export default ColumnFilter;

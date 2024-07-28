import React from "react";
import { Column } from "../type/table_types";
import "../style/table.css";
type TableHeaderProps = {
  columns: Column[];
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  handleSort: (columnId: string) => void;
};

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  sortConfig,
  handleSort,
}) => {
  return (
    <thead>
      <tr>
        {/* Map through each column to create table headers */}
        {columns
          .filter((column) => !column.hidden) // Filter out hidden columns
          .map((column) => (
            <th
              className="header-filter"
              key={column.id}
              style={{ width: column.width }} // Set column width and cursor style
              onClick={() => handleSort(column.id)} // Handle sorting when header is clicked
            >
              {column.title}
              {/* Display sorting indicator based on current sort configuration */}
              {sortConfig && sortConfig.key === column.id
                ? sortConfig.direction === "asc"
                  ? " 🔼" // Ascending sort indicator
                  : " 🔽" // Descending sort indicator
                : " ⇵"}{" "}
              {/* Default sort indicator when no sorting is applied */}
            </th>
          ))}
      </tr>
    </thead>
  );
};

export default TableHeader;

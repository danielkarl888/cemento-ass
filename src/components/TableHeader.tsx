import React from "react";
import { Column } from "./types";

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
        {columns
          .filter((column) => !column.hidden)
          .map((column) => (
            <th
              key={column.id}
              style={{ width: column.width, cursor: "pointer" }}
              onClick={() => handleSort(column.id)}
            >
              {column.title}
              {sortConfig && sortConfig.key === column.id
                ? sortConfig.direction === "asc"
                  ? " 🔼"
                  : " 🔽"
                : " ↕"}
            </th>
          ))}
      </tr>
    </thead>
  );
};

export default TableHeader;

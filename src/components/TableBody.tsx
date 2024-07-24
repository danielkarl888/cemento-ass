import React from "react";
import { Table, Form } from "react-bootstrap";
import { Column, Row } from "./types";

type TableBodyProps = {
  columns: Column[];
  data: Row[];
  editMode: { [key: string]: boolean };
  handleEdit: (rowId: string, columnId: string) => void;
  handleSave: (rowId: string, columnId: string, value: any) => void;
  renderCellValue: (value: any, type: string, options?: string[]) => string;
};

const TableBody: React.FC<TableBodyProps> = ({
  columns,
  data,
  editMode,
  handleEdit,
  handleSave,
  renderCellValue,
}) => {
  return (
    <tbody>
      {/* Map through each row of data */}
      {data.map((row) => (
        <tr key={row.id}>
          {columns
            .filter((column) => !column.hidden) // Filter out hidden columns
            .map((column) => (
              <td key={column.id}>
                {/* Check if the cell is in edit mode */}
                {editMode[`${row.id}-${column.id}`] ? (
                  column.type === "boolean" ? (
                    // Render a checkbox for boolean type columns
                    <Form.Check
                      type="checkbox"
                      checked={row[column.id] || false}
                      onChange={(e) =>
                        handleSave(row.id, column.id, e.target.checked)
                      }
                    />
                  ) : column.type === "select" ? (
                    // Render a select dropdown for select type columns
                    <Form.Control
                      as="select"
                      value={row[column.id] || "None"}
                      onChange={(e) =>
                        handleSave(row.id, column.id, e.target.value)
                      }
                    >
                      <option value="None">Select...</option>
                      {column.options &&
                        column.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                    </Form.Control>
                  ) : (
                    // Render an input field for text and number type columns
                    <Form.Control
                      type={column.type === "number" ? "number" : "text"}
                      defaultValue={renderCellValue(
                        row[column.id],
                        column.type
                      )}
                      onBlur={(e) =>
                        handleSave(
                          row.id,
                          column.id,
                          column.type === "boolean"
                            ? e.target.value === "Yes"
                            : e.target.value
                        )
                      }
                    />
                  )
                ) : (
                  // Render cell value as plain text and enable editing on double-click
                  <span onDoubleClick={() => handleEdit(row.id, column.id)}>
                    {renderCellValue(
                      row[column.id],
                      column.type,
                      column.options
                    )}
                  </span>
                )}
              </td>
            ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;

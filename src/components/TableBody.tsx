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
  const handleKeyDown = (
    e: React.KeyboardEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    rowId: string,
    columnId: string,
    value: any
  ) => {
    if (e.key === "Enter") {
      handleSave(rowId, columnId, value);
    }
  };

  return (
    <tbody>
      {data.map((row) => (
        <tr key={row.id}>
          {columns
            .filter((column) => !column.hidden)
            .map((column) => (
              <td
                key={column.id}
                onDoubleClick={() => handleEdit(row.id, column.id)}
              >
                {editMode[`${row.id}-${column.id}`] ? (
                  column.type === "boolean" ? (
                    <Form.Switch
                      type="checkbox"
                      checked={row[column.id] || false}
                      onChange={(e) =>
                        handleSave(row.id, column.id, e.target.checked)
                      }
                    />
                  ) : column.type === "select" ? (
                    <Form.Control
                      as="select"
                      value={row[column.id] || "None"}
                      onChange={(e) =>
                        handleSave(row.id, column.id, e.target.value)
                      }
                      onBlur={(e) =>
                        handleSave(row.id, column.id, e.target.value)
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(
                          e as unknown as React.KeyboardEvent<HTMLSelectElement>,
                          row.id,
                          column.id,
                          (e.target as HTMLSelectElement).value
                        )
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
                      onKeyDown={(e) =>
                        handleKeyDown(
                          e as React.KeyboardEvent<HTMLInputElement>,
                          row.id,
                          column.id,
                          e.currentTarget.value
                        )
                      }
                    />
                  )
                ) : (
                  <span>
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

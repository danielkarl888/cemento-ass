import React, { useState } from "react";
import {
  Table,
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import "./EditableTable.css"; // Import custom CSS file

type Column = {
  id: string;
  ordinalNo: number;
  title: string;
  type: string;
  width?: number;
  hidden?: boolean;
};

type Row = {
  id: string;
  [columnId: string]: any;
};

type TableData = {
  columns: Column[];
  data: Row[];
};

type Props = {
  tableData: TableData;
};

const EditableTable: React.FC<Props> = ({ tableData }) => {
  const [data, setData] = useState<Row[]>(tableData.data);
  const [columns, setColumns] = useState<Column[]>(tableData.columns);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [newRow, setNewRow] = useState<{ [key: string]: any }>({});
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (rowId: string, columnId: string) => {
    setEditMode({ ...editMode, [`${rowId}-${columnId}`]: true });
  };

  const handleSave = (rowId: string, columnId: string, value: any) => {
    const newData = data.map((row) =>
      row.id === rowId ? { ...row, [columnId]: value } : row
    );
    setData(newData);
    setEditMode({ ...editMode, [`${rowId}-${columnId}`]: false });
  };

  const handleFilterChange = (columnId: string, checked: boolean) => {
    const newColumns = columns.map((col) =>
      col.id === columnId ? { ...col, hidden: !checked } : col
    );
    setColumns(newColumns);
  };

  const handleAddRow = () => {
    // Validate new row data
    if (
      columns.every((column) => column.type === "boolean" || newRow[column.id])
    ) {
      const newRowId = (data.length + 1).toString();
      const newRowData = { id: newRowId, ...newRow };
      setData([...data, newRowData]);
      setNewRow({}); // Clear new row data
      setError(null);
    } else {
      setError("Please fill all fields before adding a new row.");
    }
  };

  const handleInputChange = (columnId: string, value: any) => {
    setNewRow({ ...newRow, [columnId]: value });
  };

  const renderCellValue = (value: any, type: string) => {
    if (type === "boolean") {
      return value ? "Yes" : "No";
    }
    return value;
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <Form>
            {columns.map((column) => (
              <Form.Check
                key={column.id}
                type="checkbox"
                label={column.title}
                checked={!column.hidden}
                onChange={(e) =>
                  handleFilterChange(column.id, e.target.checked)
                }
              />
            ))}
          </Form>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-3">
        <Col>
          <Form>
            <Row>
              {columns.map((column) => (
                <Col key={column.id} xs={12} sm={6} md={4} lg={3}>
                  <Form.Group>
                    <Form.Label>{column.title}</Form.Label>
                    {column.type === "boolean" ? (
                      <Form.Check
                        type="checkbox"
                        checked={newRow[column.id] || false}
                        onChange={(e) =>
                          handleInputChange(column.id, e.target.checked)
                        }
                      />
                    ) : (
                      <Form.Control
                        type={column.type === "number" ? "number" : "text"}
                        value={newRow[column.id] || ""}
                        onChange={(e) =>
                          handleInputChange(column.id, e.target.value)
                        }
                      />
                    )}
                  </Form.Group>
                </Col>
              ))}
            </Row>
            <Button className="mt-3" onClick={handleAddRow}>
              Add Row
            </Button>
          </Form>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {columns
              .filter((column) => !column.hidden)
              .map((column) => (
                <th key={column.id} style={{ width: column.width }}>
                  {column.title}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns
                .filter((column) => !column.hidden)
                .map((column) => (
                  <td key={column.id}>
                    {editMode[`${row.id}-${column.id}`] ? (
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
                    ) : (
                      <span onDoubleClick={() => handleEdit(row.id, column.id)}>
                        {renderCellValue(row[column.id], column.type)}
                      </span>
                    )}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default EditableTable;

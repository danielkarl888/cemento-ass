import React, { useState } from "react";
import { Table,Form,Button,Alert,Container,Row,Col,Modal } from "react-bootstrap";
import "./EditableTable.css"; // Import custom CSS file

type Column = {
  id: string;
  ordinalNo: number;
  title: string;
  type: string;
  width?: number;
  hidden?: boolean;
  options?: string[]; // Add options for select type columns
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
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

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
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setError(null);
  };

  const handleModalSave = () => {
    if (
      columns.every(
        (column) =>
          column.type === "boolean" ||
          column.type === "select" ||
          newRow[column.id]
      )
    ) {
      const newRowId = (data.length + 1).toString();
      const newRowData = { id: newRowId, ...newRow };
      setData([...data, newRowData]);
      setNewRow({});
      setShowModal(false);
      setError(null);
    } else {
      setError("Please fill all fields before adding a new row.");
    }
  };

  const handleInputChange = (columnId: string, value: any) => {
    setNewRow({ ...newRow, [columnId]: value });
  };

  const renderCellValue = (value: any, type: string, options?: string[]) => {
    if (type === "boolean") {
      return value ? "✔️" : "❌";
    } else if (type === "select") {
      return value;
    }
    return value;
  };

  const handleSort = (columnId: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === columnId &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    } else if (
      sortConfig &&
      sortConfig.key === columnId &&
      sortConfig.direction === "desc"
    ) {
      setSortConfig(null); // Reset sorting if already sorted in descending
      return;
    }
    setSortConfig({ key: columnId, direction });
  };

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      const sortedArray = [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
      return sortedArray;
    }
    return data;
  }, [data, sortConfig]);

  return (
    <Container className="mt-4 ">
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
          <Button className="mt-3" onClick={handleAddRow}>
            Add Row
          </Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Row</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                    ) : column.type === "select" ? (
                      <Form.Control
                        as="select"
                        value={newRow[column.id] || ""}
                        onChange={(e) =>
                          handleInputChange(column.id, e.target.value)
                        }
                      >
                        <option value="">Select...</option>
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
          </Form>
          {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Table striped bordered hover responsive className="table-primary">
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
        <tbody>
          {sortedData.map((row) => (
            <tr key={row.id}>
              {columns
                .filter((column) => !column.hidden)
                .map((column) => (
                  <td key={column.id}>
                    {editMode[`${row.id}-${column.id}`] ? (
                      column.type === "boolean" ? (
                        <Form.Check
                          type="checkbox"
                          checked={row[column.id] || false}
                          onChange={(e) =>
                            handleSave(row.id, column.id, e.target.checked)
                          }
                        />
                      ) : column.type === "select" ? (
                        <Form.Control
                          as="select"
                          value={row[column.id] || ""}
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
      </Table>
    </Container>
  );
};

export default EditableTable;

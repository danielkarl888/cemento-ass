import React, { useState } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import "./EditableTable.css";
import { Column, Row as DataRow, TableData } from "./types";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import ColumnFilter from "./ColumnFilter";
import AddRowModal from "./AddRowModal";

type Props = {
  tableData: TableData;
};

const EditableTable: React.FC<Props> = ({ tableData }) => {
  // State to manage table data rows
  const [data, setData] = useState<DataRow[]>(tableData.data);
  // State to manage table columns
  const [columns, setColumns] = useState<Column[]>(tableData.columns);
  // State to manage edit mode for specific cells
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  // State to manage new row being added
  const [newRow, setNewRow] = useState<{ [key: string]: any }>({ id: "" });
  // State to manage any error messages
  const [error, setError] = useState<string | null>(null);
  // State to manage sort configuration
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  // State to manage the visibility of the Add Row modal
  const [showModal, setShowModal] = useState<boolean>(false);

  // Function to handle edit mode for a specific cell
  const handleEdit = (rowId: string, columnId: string) => {
    setEditMode({ ...editMode, [`${rowId}-${columnId}`]: true });
  };

  // Function to handle saving edited cell data
  const handleSave = (rowId: string, columnId: string, value: any) => {
    const newData = data.map((row) =>
      row.id === rowId ? { ...row, [columnId]: value } : row
    );
    setData(newData);
    setEditMode({ ...editMode, [`${rowId}-${columnId}`]: false });
  };

  // Function to handle column filter changes
  const handleFilterChange = (columnId: string, checked: boolean) => {
    const newColumns = columns.map((col) =>
      col.id === columnId ? { ...col, hidden: !checked } : col
    );
    setColumns(newColumns);
  };

  // Function to handle the addition of a new row
  const handleAddRow = () => {
    setShowModal(true);
  };

  // Function to handle closing the Add Row modal
  const handleModalClose = () => {
    setShowModal(false);
    setError(null);
  };

  // Function to handle saving the new row data
  const handleModalSave = () => {
    // Create a new row with the data from newRow, adding an ID based on the current length of the data array
    const newRowData: DataRow = { ...newRow, id: (data.length + 1).toString() };

    // Ensure all columns of type "select" have a value, defaulting to "None" if not specified
    columns.forEach((column) => {
      if (!newRowData[column.id] && column.type === "select") {
        newRowData[column.id] = "None";
      }
    });

    // Check that all fields are filled in for columns that are not of type "boolean" or "select"
    if (
      columns.every(
        (column) =>
          column.type === "boolean" ||
          column.type === "select" ||
          newRowData[column.id]
      )
    ) {
      setData([...data, newRowData]);
      setNewRow({ id: "" });
      setShowModal(false);
      setError(null);
    } else {
      setError("Please fill all fields before adding a new row.");
    }
  };

  // Function to handle changes to input fields in the Add Row modal
  const handleInputChange = (columnId: string, value: any) => {
    setNewRow({ ...newRow, [columnId]: value });
  };

  // Function to render cell values based on their type
  const renderCellValue = (value: any, type: string) => {
    if (type === "boolean") {
      return value ? "✔️" : "❌";
    } else if (type === "select") {
      return value;
    }
    return value;
  };

  // Function to handle sorting of columns
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
      setSortConfig(null);
      return;
    }
    setSortConfig({ key: columnId, direction });
  };

  // Memoized sorted data based on sort configuration
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
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <ColumnFilter
            columns={columns}
            handleFilterChange={handleFilterChange}
          />
        </Col>
      </Row>

      <AddRowModal
        columns={columns}
        newRow={newRow}
        error={error}
        showModal={showModal}
        handleModalClose={handleModalClose}
        handleModalSave={handleModalSave}
        handleInputChange={handleInputChange}
      />

      <Table striped bordered hover responsive className="table-primary">
        <TableHeader
          columns={columns}
          sortConfig={sortConfig}
          handleSort={handleSort}
        />
        <TableBody
          columns={columns}
          data={sortedData}
          editMode={editMode}
          handleEdit={handleEdit}
          handleSave={handleSave}
          renderCellValue={renderCellValue}
        />
      </Table>
      <Row>
        <Col>
          <Button
            variant="primary"
            size="lg"
            className="mt-3"
            onClick={handleAddRow}
          >
            Add Row{"  "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-plus-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
            </svg>
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default EditableTable;

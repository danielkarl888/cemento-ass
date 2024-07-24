import React, { useState } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import "./EditableTable.css"; // Import custom CSS file
import { Column, Row as DataRow, TableData } from "./types";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import ColumnFilter from "./ColumnFilter";
import AddRowModal from "./AddRowModal";

type Props = {
  tableData: TableData;
};

const EditableTable: React.FC<Props> = ({ tableData }) => {
  // State for table data
  const [data, setData] = useState<DataRow[]>(tableData.data);
  // State for table columns
  const [columns, setColumns] = useState<Column[]>(tableData.columns);
  // State to manage edit mode for cells
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  // State for managing new row data
  const [newRow, setNewRow] = useState<{ [key: string]: any }>({ id: "" });
  // State for error messages
  const [error, setError] = useState<string | null>(null);
  // State for sorting configuration
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  // State to control modal visibility
  const [showModal, setShowModal] = useState<boolean>(false);

  // Function to handle cell double-click to enable edit mode
  const handleEdit = (rowId: string, columnId: string) => {
    setEditMode({ ...editMode, [`${rowId}-${columnId}`]: true });
  };

  // Function to handle saving the edited cell value
  const handleSave = (rowId: string, columnId: string, value: any) => {
    const newData = data.map((row) =>
      row.id === rowId ? { ...row, [columnId]: value } : row
    );
    setData(newData);
    setEditMode({ ...editMode, [`${rowId}-${columnId}`]: false });
  };

  // Function to handle column visibility change
  const handleFilterChange = (columnId: string, checked: boolean) => {
    const newColumns = columns.map((col) =>
      col.id === columnId ? { ...col, hidden: !checked } : col
    );
    setColumns(newColumns);
  };

  // Function to handle adding a new row
  const handleAddRow = () => {
    setShowModal(true);
  };

  // Function to handle closing the modal
  const handleModalClose = () => {
    setShowModal(false);
    setError(null);
  };

  // Function to handle saving the new row from the modal
  const handleModalSave = () => {
    const newRowData: DataRow = { ...newRow, id: (data.length + 1).toString() };

    // Set default value for select columns
    columns.forEach((column) => {
      if (!newRowData[column.id] && column.type === "select") {
        newRowData[column.id] = "None";
      }
    });

    // Validate that all required fields are filled
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

  // Function to handle input change in the modal
  const handleInputChange = (columnId: string, value: any) => {
    setNewRow({ ...newRow, [columnId]: value });
  };

  // Function to render cell value based on column type
  const renderCellValue = (value: any, type: string, options?: string[]) => {
    if (type === "boolean") {
      return value ? "✔️" : "❌";
    } else if (type === "select") {
      return value;
    }
    return value;
  };

  // Function to handle sorting
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

  // Function to get sorted data
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
          <Button
            variant="primary"
            size="lg"
            className="mt-3"
            onClick={handleAddRow}
          >
            Add Row
          </Button>
        </Col>
      </Row>
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
    </Container>
  );
};

export default EditableTable;

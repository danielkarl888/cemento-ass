import React from "react";
import { Modal, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { Column } from "./types";

type AddRowModalProps = {
  columns: Column[];
  newRow: { [key: string]: any };
  error: string | null;
  showModal: boolean;
  handleModalClose: () => void;
  handleModalSave: () => void;
  handleInputChange: (columnId: string, value: any) => void;
};

const AddRowModal: React.FC<AddRowModalProps> = ({
  columns,
  newRow,
  error,
  showModal,
  handleModalClose,
  handleModalSave,
  handleInputChange,
}) => {
  return (
    <Modal show={showModal} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Row</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            {/* Loop through each column to create form inputs */}
            {columns.map((column) => (
              <Col key={column.id} xs={12} sm={6} md={4} lg={3}>
                <Form.Group>
                  <Form.Label>{column.title}</Form.Label>
                  {column.type === "boolean" ? (
                    // Checkbox for boolean columns
                    <Form.Check
                      type="checkbox"
                      checked={newRow[column.id] || false}
                      onChange={(e) =>
                        handleInputChange(column.id, e.target.checked)
                      }
                    />
                  ) : column.type === "select" ? (
                    // Select dropdown for select columns
                    <Form.Control
                      as="select"
                      value={newRow[column.id] || ""}
                      onChange={(e) =>
                        handleInputChange(column.id, e.target.value)
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
                    // Text or number input for other column types
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
        {/* Display error message if any */}
        {error && <Alert variant="danger">{error}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        {/* Buttons to close the modal or save the new row */}
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleModalSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRowModal;

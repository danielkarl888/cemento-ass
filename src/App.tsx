import React from "react";
import EditableTable from "./components/EditableTable";
import { Container, Navbar, Nav } from "react-bootstrap";

// Define sample data
const tableData = {
  columns: [
    { id: "name", ordinalNo: 1, title: "Name", type: "text" },
    { id: "age", ordinalNo: 2, title: "Age", type: "number" },
    { id: "active", ordinalNo: 3, title: "Active", type: "boolean" },
    {
      id: "role",
      ordinalNo: 4,
      title: "Role",
      type: "select",
      options: ["Admin", "User", "Guest"],
    },
  ],
  data: [
    { id: "1", name: "John", age: 30, active: true, role: "Admin" },
    { id: "2", name: "Jane", age: 25, active: false, role: "User" },
  ],
};

const App: React.FC = () => {
  return (
    <>
      <Navbar bg="" data-bs-theme="dark" sticky="top" />

      <div className="container">
        <div className="row">
          <div className="col-2"></div>
          <div className="col">
            <div className="App">
              <h1 className="m-3 text-center">Cemento Table 🏗</h1>
              <EditableTable tableData={tableData} />
            </div>
          </div>
          <div className="col-2"></div>
        </div>
      </div>
    </>
  );
};

export default App;

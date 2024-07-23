import React from "react";
import EditableTable from "./components/EditableTable";

// Define sample data
const tableData = {
  columns: [
    { id: "name", ordinalNo: 1, title: "Name", type: "string" },
    { id: "age", ordinalNo: 2, title: "Age", type: "number" },
    { id: "isStudent", ordinalNo: 3, title: "Student", type: "boolean" },
  ],
  data: [
    { id: "1", name: "John Doe", age: 25, isStudent: true },
    { id: "2", name: "Jane Smith", age: 30, isStudent: false },
    { id: "3", name: "Alice Johnson", age: 22, isStudent: true },
    { id: "4", name: "Bob Brown", age: 28, isStudent: false },
  ],
};

const App: React.FC = () => {
  return (
    <div className="App">
      <h1 className="m-3">Editable Table</h1>
      <EditableTable tableData={tableData} />
    </div>
  );
};

export default App;

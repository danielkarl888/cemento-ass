# Editable Table React Component

This project is a React component for an editable table, allowing users to add, edit, and filter table rows dynamically. The component is built using React and Bootstrap for a clean and responsive UI.

## Features

- Add new rows with a modal form
- Edit individual cell values
- Sort columns
- Filter columns visibility using a dropdown menu
- Responsive design

## Demo

![image](https://github.com/user-attachments/assets/c3b00913-3ae5-4221-b767-f4c9f1678af3)


## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [Props](#props)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/danielkarl888/cemento-ass.git
    ```
2. Navigate to the project directory:
    ```sh
    cd cemento-ass
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Usage

1. Import the `EditableTable` component into your React application:
    ```jsx
    import EditableTable from './path-to-your-component/EditableTable';
    import { TableData } from './path-to-your-component/types';
    ```

2. Define your table data:
    ```jsx
    const tableData: TableData = {
      columns: [
        { id: 'name', title: 'Name', type: 'text', hidden: false },
        { id: 'age', title: 'Age', type: 'number', hidden: false },
        { id: 'isActive', title: 'Active', type: 'boolean', hidden: false },
        { id: 'role', title: 'Role', type: 'select', options: ['Admin', 'User', 'Guest'], hidden: false }
      ],
      data: [
        { id: '1', name: 'John Doe', age: 28, isActive: true, role: 'Admin' },
        { id: '2', name: 'Jane Smith', age: 34, isActive: false, role: 'User' }
      ]
    };
    ```

3. Render the `EditableTable` component:
    ```jsx
    function App() {
      return (
        <div className="App">
          <EditableTable tableData={tableData} />
        </div>
      );
    }

    export default App;
    ```

## Components

### EditableTable

This is the main component that includes the table and handles all operations such as adding, editing, sorting, and filtering rows.

#### Props

- `tableData`: An object containing columns and data for the table.

### AddRowModal

A modal form to add new rows to the table.

#### Props

- `columns`: Array of column definitions.
- `newRow`: Object representing the new row being added.
- `error`: Error message for validation.
- `showModal`: Boolean to control the visibility of the modal.
- `handleModalClose`: Function to handle closing the modal.
- `handleModalSave`: Function to handle saving the new row.
- `handleInputChange`: Function to handle input changes in the form.

### ColumnFilter

A dropdown menu to filter the visibility of columns.

#### Props

- `columns`: Array of column definitions.
- `handleFilterChange`: Function to handle column visibility changes.

### TableHeader

Renders the table header with sortable columns.

#### Props

- `columns`: Array of column definitions.
- `sortConfig`: Object containing sorting configuration.
- `handleSort`: Function to handle sorting of columns.

### TableBody

Renders the table body with editable cells.

#### Props

- `columns`: Array of column definitions.
- `data`: Array of row data.
- `editMode`: Object tracking which cells are in edit mode.
- `handleEdit`: Function to handle editing of cells.
- `handleSave`: Function to handle saving of cell values.
- `renderCellValue`: Function to render the cell value based on its type.

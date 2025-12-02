import { Routes, Route, Link } from "react-router-dom";
import EmployeeList from "./pages/EmployeeList";
import CreateEmployee from "./pages/CreateEmployee";
import EditEmployee from "./pages/EditEmployee";

function App() {
  return (
    <div>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/employees" style={{ marginRight: "1rem" }}>
          Employee List
        </Link>
        <Link to="/employees/new">Add Employee</Link>
      </nav>

      <div style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/new" element={<CreateEmployee />} />
          <Route path="/employees/:id/edit" element={<EditEmployee />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

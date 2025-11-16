import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "/api";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/employees`);
        if (!res.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await res.json();
        console.log(data);
        setEmployees(data); // [{ id, name, phone_number, email, salary }, ...]
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Employees</h1>

      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.phone_number}</td>
                <td>{emp.email}</td>
                <td>{emp.salary}</td>
                <td>
                  <Link to={`/employees/${emp.id}/edit`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: "1rem" }}>
        <Link to="/employees/new">+ Add New Employee</Link>
      </div>
    </div>
  );
}

export default EmployeeList;

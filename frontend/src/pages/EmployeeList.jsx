import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../UserContext";

const API_BASE_URL = "/api";

function EmployeeList() {
  const { currentUser } = useUser();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/employees`, {
          credentials: 'include'
        });
        if (!res.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!currentUser || currentUser.role !== "admin") return;

    const confirmed = window.confirm(
      `Are you sure you want to delete employee #${id}?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/employee/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete employee");
      }
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      setError(err.message || "Error deleting employee");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let list = [...employees];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((emp) => {
        return (
          String(emp.id).includes(term) ||
          (emp.name && emp.name.toLowerCase().includes(term)) ||
          (emp.email && emp.email.toLowerCase().includes(term))
        );
      });
    }

    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [employees, searchTerm, sortField, sortDirection]);

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Employees</h1>

      <div className="filters-row">
        <div>
          <label>
            Search (ID, name, email)
            <br />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Sort by
            <br />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="salary">Salary</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Direction
            <br />
            <select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table>
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
            {filteredAndSorted.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.phone_number}</td>
                <td>{emp.email}</td>
                <td>{emp.salary}</td>
                <td>
                  <Link to={`/employees/${emp.id}/edit`}>Edit</Link>
                  {currentUser && currentUser.role === "admin" && (
                    <>
                      {" | "}
                      <button
                        type="button"
                        onClick={() => handleDelete(emp.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
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

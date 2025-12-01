import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

function Login() {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (role === "employee" && !employeeId.trim()) {
      setError("Employee ID is required for employee login.");
      return;
    }

    const user = {
      name: name.trim(),
      role,
      id: role === "employee" ? Number(employeeId) : null,
    };

    login(user);

    if (role === "admin") {
      navigate("/employees");
    } else {
      navigate("/profile");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name
            <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Role
            <br />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </label>
        </div>

        {role === "employee" && (
          <div>
            <label>
              Employee ID
              <br />
              <input
                type="number"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </label>
          </div>
        )}

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;

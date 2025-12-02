import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");
  const { currentUser, login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("In Handle Submit!");

    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!password) {
      setError("Employee ID is required for employee login.");
      return;
    }

    const credentials = {
      username: name.trim(),
      password: password
    };

    // const response = await fetch("/login", {
    //   method: "POST",
    //   credentials: "include",
    //   headers: {"Content-Type":"application/json"},
    //   body: JSON.stringify(credentials)
    // });

    const user = await login(credentials);

    if( user !== null ) {
      console.log("Login Successful");
    }
    else {
      console.log("Login Failed");
      return;
    }

    console.log(`Determining role!....... ${user.role}`);

    if (user.role === "admin") {
      console.log("Navigating to employees!");
      navigate("/employees");
    } else {
      console.log("Navigating to profile!");
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
            UserName
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
            Password
            <br />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>

        {/* <div>
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
        )} */}

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;

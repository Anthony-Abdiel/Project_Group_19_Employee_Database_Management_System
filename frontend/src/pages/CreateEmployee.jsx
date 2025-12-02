import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";

const API_BASE_URL = "/api";

function CreateEmployee() {
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      setError("");
      setSuccessMsg("");

      const res = await fetch(`${API_BASE_URL}/employees`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create employee");
      }

      setSuccessMsg("Employee created successfully!");
      navigate("/employees");
    } catch (err) {
      setError(err.message || "Error creating employee");
    }
  };

  return (
    <div>
      <h1>Create Employee</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      <EmployeeForm onSubmit={handleCreate} submitLabel="Create Employee" />
    </div>
  );
}

export default CreateEmployee;

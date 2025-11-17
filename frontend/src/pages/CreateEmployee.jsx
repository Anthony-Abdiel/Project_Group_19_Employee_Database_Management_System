import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../../components/EmployeeForm";

const API_BASE_URL = "/api";

function CreateEmployee() {
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      setError(null);
      setSuccessMsg("");

      const res = await fetch(`${API_BASE_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // { name, phone, email, salary }
      });

      if (!res.ok) {
        let message = "Failed to create employee";
        try {
          const text = await res.text();
          if (text) message = text;
        } catch {}
        throw new Error(message);
      }

      setSuccessMsg("Employee created successfully!");
      navigate("/employees");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div>
      <h1>Add New Employee</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      <EmployeeForm onSubmit={handleCreate} submitLabel="Create Employee" />
    </div>
  );
}

export default CreateEmployee;

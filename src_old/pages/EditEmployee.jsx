import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmployeeForm from "../../components/EmployeeForm";

const API_BASE_URL = "/api";

function EditEmployee() {
  const { id } = useParams(); // from /employees/:id/edit
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Load current employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/employees`);
        if (!res.ok) {
          throw new Error("Failed to load employees");
        }
        const data = await res.json();

        const numericId = Number(id);
        const found = data.find((emp) => emp.id === numericId);

        if (!found) {
          setLoadError("Employee not found");
        } else {
          setEmployee(found);
        }
      } catch (err) {
        setLoadError(err.message || "Error loading employee");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setSaveError(null);
      setSuccessMsg("");

      const res = await fetch(`${API_BASE_URL}/employee/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // { name, phone, email, salary }
      });

      if (!res.ok) {
        let message = "Failed to update employee";
        try {
          const text = await res.text();
          if (text) message = text;
        } catch {}
        throw new Error(message);
      }

      setSuccessMsg("Employee updated successfully!");
      navigate("/employees");
    } catch (err) {
      setSaveError(err.message || "Error updating employee");
    }
  };

  if (loading) return <p>Loading employee...</p>;
  if (loadError) return <p style={{ color: "red" }}>{loadError}</p>;
  if (!employee) return <p>Employee not found.</p>;

  return (
    <div>
      <h1>Edit Employee #{employee.id}</h1>
      {saveError && <p style={{ color: "red" }}>{saveError}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      <EmployeeForm
        initialData={employee}
        onSubmit={handleUpdate}
        submitLabel="Update Employee"
      />
    </div>
  );
}

export default EditEmployee;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";
import { useUser } from "../UserContext";

const API_BASE_URL = "http://localhost:3000";

function EmployeeProfile() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "employee") {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoadError("");
        setLoading(true);

        const res = await fetch(`${API_BASE_URL}/employees`);
        if (!res.ok) {
          throw new Error("Failed to load employees");
        }
        const data = await res.json();
        const numericId = Number(currentUser.id);
        const found = data.find((emp) => Number(emp.id) === numericId);

        if (!found) {
          setLoadError("Employee record not found for your account.");
        } else {
          setEmployee(found);
        }
      } catch (err) {
        setLoadError(err.message || "Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, navigate]);

  const handleUpdate = async (formData) => {
    if (!currentUser || currentUser.role !== "employee") return;

    try {
      setSaveError("");
      setSuccessMsg("");

      const res = await fetch(
        `${API_BASE_URL}/employee/${currentUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccessMsg("Profile updated successfully!");
    } catch (err) {
      setSaveError(err.message || "Error updating profile");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (loadError) return <p style={{ color: "red" }}>{loadError}</p>;
  if (!employee) return <p>No profile data available.</p>;

  return (
    <div>
      <h1>My Profile</h1>
      {saveError && <p style={{ color: "red" }}>{saveError}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      <EmployeeForm
        initialData={employee}
        onSubmit={handleUpdate}
        submitLabel="Update Profile"
      />
    </div>
  );
}

export default EmployeeProfile;

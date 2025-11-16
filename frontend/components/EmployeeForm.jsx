import { useEffect, useState } from "react";

function EmployeeForm({ initialData, onSubmit, submitLabel = "Save" }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPhone(initialData.phone_number || "");
      setEmail(initialData.email || "");
      setSalary(
        initialData.salary !== undefined && initialData.salary !== null
          ? String(initialData.salary)
          : ""
      );
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      name,
      phone,
      email,
      salary: salary === "" ? null : Number(salary),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Name:
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Phone:
          <br />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Email:
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Salary:
          <br />
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </label>
      </div>

      <button type="submit">{submitLabel}</button>
    </form>
  );
}

export default EmployeeForm;

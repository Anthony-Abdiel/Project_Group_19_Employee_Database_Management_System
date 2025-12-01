import React, { useEffect, useState } from "react";

function EmployeeForm({ initialData, onSubmit, submitLabel }) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPhoneNumber(initialData.phone_number || "");
      setEmail(initialData.email || "");
      setSalary(initialData.salary ?? "");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      phone_number: phoneNumber,
      email,
      salary: Number(salary),
    });
  };

  return (
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
          Phone Number
          <br />
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Email
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Salary
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

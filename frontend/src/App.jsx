import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import EmployeeList from "./pages/EmployeeList";
import CreateEmployee from "./pages/CreateEmployee";
import EditEmployee from "./pages/EditEmployee";
import Login from "./pages/Login";
import EmployeeProfile from "./pages/EmployeeProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { useUser } from "./UserContext";

function App() {
  const { currentUser, logout } = useUser();

  return (
    <div className="app-shell">
      <nav className="top-nav">
        <div className="nav-left">
          <span className="brand">EDMS</span>

          {currentUser && currentUser.role === "admin" && (
            <>
              <Link to="/employees">Employee List</Link>
              <Link to="/employees/new">Add Employee</Link>
            </>
          )}

          {currentUser && currentUser.role === "employee" && (
            <Link to="/profile">My Profile</Link>
          )}
        </div>

        <div className="nav-right">
          {!currentUser && <Link to="/login">Login</Link>}

          {currentUser && (
            <>
              <span className="user-pill">
                {currentUser.name} ({currentUser.role})
              </span>
              <button type="button" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="page-content">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/employees"
            element={
              <AdminRoute>
                <EmployeeList />
              </AdminRoute>
            }
          />
          <Route
            path="/employees/new"
            element={
              <AdminRoute>
                <CreateEmployee />
              </AdminRoute>
            }
          />
          <Route
            path="/employees/:id/edit"
            element={
              <AdminRoute>
                <EditEmployee />
              </AdminRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              currentUser ? (
                currentUser.role === "admin" ? (
                  <AdminRoute>
                    <EmployeeList />
                  </AdminRoute>
                ) : (
                  <ProtectedRoute>
                    <EmployeeProfile />
                  </ProtectedRoute>
                )
              ) : (
                <Login />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;

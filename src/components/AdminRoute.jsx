import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../UserContext";

function AdminRoute({ children }) {
  const { currentUser } = useUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "admin") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export default AdminRoute;

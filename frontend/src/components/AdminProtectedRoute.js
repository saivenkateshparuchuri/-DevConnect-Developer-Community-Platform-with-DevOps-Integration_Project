import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    return <Navigate to="/admin" />;
  }

  return children;
}

export default AdminProtectedRoute;

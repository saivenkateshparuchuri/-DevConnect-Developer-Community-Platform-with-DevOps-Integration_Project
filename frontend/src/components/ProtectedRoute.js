import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");

  if (!token && !adminToken) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
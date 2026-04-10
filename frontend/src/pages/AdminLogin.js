import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin } from "../services/api";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const data = await adminLogin(email, password);

      if (data.adminToken) {
        localStorage.removeItem("token"); // Clear existing user session
        localStorage.setItem("adminToken", data.adminToken);
        // Navigate to home after admin login as requested
        navigate("/home");
      } else {
        setError(data.message || "Invalid Admin Credentials");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light text-dark">
      <div className="card border-0 shadow-lg" style={{ width: "400px", borderRadius: "10px", backgroundColor: "#ffffff" }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-1">Admin Portal</h3>
            <p className="text-muted small">Access strictly restricted</p>
          </div>
          
          {error && <div className="alert alert-danger p-2 small">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small text-muted">Administrator Email</label>
              <input
                type="email"
                className="form-control bg-white text-dark border-light shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
              />
            </div>
            
            <div className="mb-4">
              <label className="form-label small text-muted">Password</label>
              <input
                type="password"
                className="form-control bg-white text-dark border-light shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-100 fw-bold py-2 mb-3"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none" }}
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Admin Login"}
            </button>
          </form>

          <div className="text-center">
             <Link to="/" className="text-muted small text-decoration-none hover-move" style={{ color: "#a5b4fc !important" }}>
               &larr; Return to Public Site
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

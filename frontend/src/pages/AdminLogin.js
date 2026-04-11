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
        localStorage.removeItem("token");
        localStorage.setItem("adminToken", data.adminToken);
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
    <div className="admin-login-page vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden">
      <div className="position-fixed top-0 start-0 w-100 h-100 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="floating position-absolute" style={{ top: '12%', left: '12%', fontSize: '2rem', opacity: 0.08 }}>✨</div>
        <div className="floating delay-1 position-absolute" style={{ top: '18%', right: '14%', fontSize: '1.4rem', opacity: 0.08 }}>🌟</div>
        <div className="floating delay-2 position-absolute" style={{ bottom: '28%', left: '18%', fontSize: '1.9rem', opacity: 0.08 }}>💫</div>
        <div className="floating position-absolute" style={{ bottom: '18%', right: '12%', fontSize: '1.1rem', opacity: 0.08 }}>⭐</div>
      </div>

      <div className="auth-card glass-panel p-5 admin-login-card" style={{ width: "420px", maxWidth: "92vw", zIndex: 10 }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="fw-bold mb-1 text-white" style={{ letterSpacing: "-0.4px", fontSize: "1.85rem" }}>Admin Portal</h2>
            <p className="text-muted small mb-0" style={{ color: "#a5b4fc" }}>Secure access for administrators only.</p>
          </div>
          <span className="badge admin-badge">ADMIN</span>
        </div>

        {error && (
          <div className="alert alert-danger p-3 mb-4 text-center" style={{ background: "rgba(248, 113, 113, 0.12)", border: "1px solid rgba(248, 113, 113, 0.3)", color: "#fecaca" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-semibold" style={{ color: "#cbd5e1" }}>Administrator Email</label>
            <input
              type="email"
              className="form-control auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@devconnect.com"
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold" style={{ color: "#cbd5e1" }}>Access Password</label>
            <input
              type="password"
              className="form-control auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter secure password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-glass w-100 fw-semibold py-3 mb-3"
            style={{ background: "linear-gradient(135deg, #f97316, #dc2626)", border: "none", fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Authenticating...
              </>
            ) : (
              "Admin Access"
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-decoration-none hover-move" style={{ color: "#93c5fd", fontSize: "0.92rem", fontWeight: 500 }}>
            ← Return to Public Platform
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

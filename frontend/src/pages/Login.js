import { useState } from "react";
import { login } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login({ email, password });

      if (data.token) {
        localStorage.removeItem("adminToken"); // Clear existing admin session
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light text-dark">
      <div className="card border-0 shadow-lg" style={{ width: "420px", borderRadius: "10px", backgroundColor: "#ffffff" }}>
        
        <div className="card-body p-5">
          <div className="text-center mb-5">
            <h2 className="text-dark fw-bold mb-1 animated-text">Welcome Back 👋</h2>
            <p className="text-muted small mt-2">Log in to your developer dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            {error && <div className="alert alert-danger py-2 small border-0">{error}</div>}

            <div className="mb-4">
              <label className="form-label small text-muted">Developer Email</label>
              <input
                className="form-control bg-white text-dark border-light shadow-sm"
                placeholder="developer@mail.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <label className="form-label small text-muted">Password</label>
              <input
                type="password"
                className="form-control bg-white text-dark border-light shadow-sm"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary w-100 fw-bold py-2 mb-3"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none" }}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
            
            <Link to="/signup" className="btn w-100 btn-outline-secondary d-block text-center text-decoration-none rounded-pill small" style={{ fontSize: "0.85rem" }}>
              Create an Account
            </Link>
          </form>
          <div className="mt-4 pt-3 border-top border-secondary border-opacity-10 text-center">
             <Link to="/admin" className="text-muted small text-decoration-none hover-move d-inline-block">
               <span className="me-1">🛡️</span> Admin Console Access
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
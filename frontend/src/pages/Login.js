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
    <div className="vh-100 d-flex align-items-center justify-content-center text-light position-relative overflow-hidden">
      {/* Background Particles */}
      <div className="position-absolute top-0 start-0 w-100 h-100">
        <div className="floating position-absolute" style={{ top: '15%', left: '20%', fontSize: '3rem', opacity: 0.05 }}>⚡</div>
        <div className="floating delay-1 position-absolute" style={{ top: '60%', right: '25%', fontSize: '2.5rem', opacity: 0.05 }}>🔥</div>
        <div className="floating delay-2 position-absolute" style={{ bottom: '20%', left: '70%', fontSize: '2rem', opacity: 0.05 }}>💻</div>
      </div>
      
      <div className="auth-card glass-glow glow-border slide-in-up" style={{ width: "420px", borderRadius: "1.5rem" }}>
        
        <div className="card-body p-5">
          <div className="text-center mb-5">
            <h2 className="text-light fw-bold mb-1 animated-text text-glow" style={{ fontSize: '2.2rem' }}>Welcome Back 👋</h2>
            <p className="text-muted small mt-2 slide-in-left delay-1">Log in to your developer dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            {error && <div className="alert alert-danger py-2 small border-0 slide-in-up delay-2" style={{ background: 'rgba(220, 53, 69, 0.1)', color: '#ff6b6b' }}>{error}</div>}

            <div className="mb-4 slide-in-left delay-1">
              <label className="form-label small text-light">Developer Email</label>
              <input
                className="auth-input form-control"
                placeholder="developer@mail.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-5 slide-in-left delay-2">
              <label className="form-label small text-light">Password</label>
              <input
                type="password"
                className="auth-input form-control"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-glass w-100 fw-bold py-2 mb-3 slide-in-up delay-3"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
            
            <Link to="/signup" className="btn w-100 btn-outline-glass d-block text-center text-decoration-none rounded-pill small slide-in-up delay-4" style={{ fontSize: "0.85rem" }}>
              Create an Account
            </Link>
          </form>
          <div className="mt-4 pt-3 border-top border-secondary border-opacity-10 text-center slide-in-up delay-1">
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
import { useState } from "react";
import { signup } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = await signup({ name, email, password });

      if (data.message === "User registered successfully") {
        navigate("/");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center text-light py-5 position-relative overflow-hidden">
      {/* Background Particles */}
      <div className="position-absolute top-0 start-0 w-100 h-100">
        <div className="floating position-absolute" style={{ top: '25%', left: '15%', fontSize: '2.8rem', opacity: 0.05 }}>🚀</div>
        <div className="floating delay-1 position-absolute" style={{ top: '70%', right: '20%', fontSize: '2.2rem', opacity: 0.05 }}>💡</div>
        <div className="floating delay-2 position-absolute" style={{ bottom: '15%', left: '75%', fontSize: '1.8rem', opacity: 0.05 }}>⚙️</div>
      </div>
      
      <div className="auth-card glass-glow glow-border slide-in-up" style={{ width: "450px", borderRadius: "1.5rem" }}>
        
        <div className="card-body p-5">
          <div className="text-center mb-5">
            <h2 className="text-light fw-bold mb-1 animated-text text-glow" style={{ fontSize: '2.2rem' }}>Join Dev Community 🚀</h2>
            <p className="text-muted small slide-in-left delay-1">Code, Connect & Create together.</p>
          </div>

          <form onSubmit={handleSignup}>
            {error && <div className="alert alert-danger py-2 small border-0 slide-in-up delay-2" style={{ background: 'rgba(220, 53, 69, 0.1)', color: '#ff6b6b' }}>{error}</div>}

            <div className="mb-3 slide-in-left delay-1">
              <label className="form-label small text-light">Full Name</label>
              <input
                className="auth-input form-control"
                placeholder="Full Name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3 slide-in-left delay-2">
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

            <div className="mb-3 slide-in-left delay-3">
              <label className="form-label small text-light">Secure Password</label>
              <input
                type="password"
                className="auth-input form-control"
                placeholder="Secure Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4 slide-in-left delay-4">
              <label className="form-label small text-light">Confirm Password</label>
              <input
                type="password"
                className="auth-input form-control"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-glass w-100 fw-bold py-2 mb-3 slide-in-up delay-1"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>

            <Link to="/" className="btn w-100 btn-outline-glass d-block text-center text-decoration-none rounded-pill small slide-in-up delay-2" style={{ fontSize: "0.85rem" }}>
              Back to Sign In
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
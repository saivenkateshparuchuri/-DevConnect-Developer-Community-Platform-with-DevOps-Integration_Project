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
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light text-dark py-5">
      <div className="card border-0 shadow-lg" style={{ width: "450px", borderRadius: "10px", backgroundColor: "#ffffff" }}>
        
        <div className="card-body p-5">
          <div className="text-center mb-5">
            <h2 className="text-dark fw-bold mb-1 animated-text">Join Dev Community 🚀</h2>
            <p className="text-muted small">Code, Connect & Create together.</p>
          </div>

          <form onSubmit={handleSignup}>
            {error && <div className="alert alert-danger py-2 small border-0">{error}</div>}

            <div className="mb-3">
              <label className="form-label small text-muted">Full Name</label>
              <input
                className="form-control bg-white text-dark border-light shadow-sm"
                placeholder="Full Name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
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

            <div className="mb-3">
              <label className="form-label small text-muted">Secure Password</label>
              <input
                type="password"
                className="form-control bg-white text-dark border-light shadow-sm"
                placeholder="Secure Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label small text-muted">Confirm Password</label>
              <input
                type="password"
                className="form-control bg-white text-dark border-light shadow-sm"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary w-100 fw-bold py-2 mb-3"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none" }}
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>

            <Link to="/" className="btn w-100 btn-outline-secondary d-block text-center text-decoration-none rounded-pill small" style={{ fontSize: "0.85rem" }}>
              Back to Sign In
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
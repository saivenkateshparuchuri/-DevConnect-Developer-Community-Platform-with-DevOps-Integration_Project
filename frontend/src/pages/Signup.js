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
    <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden py-5" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', minHeight: '100vh' }}>
      {/* Animated Background Orbs */}
      <div className="position-absolute" style={{ 
        top: '-5%', 
        right: '-10%', 
        width: '400px', 
        height: '400px', 
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      <div className="position-absolute" style={{ 
        bottom: '-10%', 
        left: '-5%', 
        width: '350px', 
        height: '350px', 
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite reverse'
      }}></div>

      {/* Main Container */}
      <div className="container" style={{ maxWidth: '520px', position: 'relative', zIndex: 10 }}>
        <div className="slide-in-up" style={{ 
          background: 'rgba(30, 27, 75, 0.4)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          overflow: 'hidden'
        }}>
          {/* Header Section */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
            padding: '3rem 2rem 2rem',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🚀</div>
            <h1 className="text-light fw-bold mb-2" style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>Join Our Community</h1>
            <p className="text-light-emphasis mb-0" style={{ fontSize: '0.95rem', opacity: 0.8 }}>
              Create your account and start connecting with developers
            </p>
          </div>

          {/* Form Section */}
          <div style={{ padding: '2.5rem' }}>
            <form onSubmit={handleSignup}>
              {/* Error Alert */}
              {error && (
                <div className="slide-in-up delay-1" style={{ 
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '0.75rem',
                  padding: '0.875rem 1rem',
                  marginBottom: '1.5rem',
                  color: '#fca5a5',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              {/* Full Name Field */}
              <div className="mb-3 slide-in-left delay-1">
                <label className="form-label text-light fw-500 mb-2" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  <span style={{ marginRight: '0.5rem' }}>👤</span>Full Name
                </label>
                <input
                  placeholder="John Doe"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    padding: '0.875rem 1rem',
                    color: 'white',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    width: '100%'
                  }}
                  className="form-control"
                  onFocus={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.border = '1px solid rgba(99, 102, 241, 0.5)';
                    e.target.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Email Field */}
              <div className="mb-3 slide-in-left delay-2">
                <label className="form-label text-light fw-500 mb-2" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  <span style={{ marginRight: '0.5rem' }}>📧</span>Email Address
                </label>
                <input
                  placeholder="developer@example.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    padding: '0.875rem 1rem',
                    color: 'white',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    width: '100%'
                  }}
                  className="form-control"
                  onFocus={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.border = '1px solid rgba(99, 102, 241, 0.5)';
                    e.target.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Password Field */}
              <div className="mb-3 slide-in-left delay-3">
                <label className="form-label text-light fw-500 mb-2" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  <span style={{ marginRight: '0.5rem' }}>🔐</span>Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    padding: '0.875rem 1rem',
                    color: 'white',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    width: '100%'
                  }}
                  className="form-control"
                  onFocus={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.border = '1px solid rgba(99, 102, 241, 0.5)';
                    e.target.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Confirm Password Field */}
              <div className="mb-5 slide-in-left delay-4">
                <label className="form-label text-light fw-500 mb-2" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  <span style={{ marginRight: '0.5rem' }}>✓</span>Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    padding: '0.875rem 1rem',
                    color: 'white',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    width: '100%'
                  }}
                  className="form-control"
                  onFocus={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.border = '1px solid rgba(99, 102, 241, 0.5)';
                    e.target.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Sign Up Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="btn w-100 fw-bold py-2 mb-3 slide-in-up delay-3"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  color: 'white',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.5)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span style={{ marginRight: '0.5rem' }}>→</span>
                    Create Account
                  </>
                )}
              </button>
              
              {/* Sign In Link */}
              <Link 
                to="/" 
                className="btn w-100 d-block text-center text-decoration-none fw-500 py-2 slide-in-up delay-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.75rem',
                  color: '#e0e7ff',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                ← Back to Sign In
              </Link>
            </form>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-4 text-light-emphasis" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
          Secure & encrypted registration
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
      `}</style>
    </div>
  );
}

export default Signup;
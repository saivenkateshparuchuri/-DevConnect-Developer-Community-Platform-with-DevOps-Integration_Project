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
        navigate("/login");
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
    <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden py-5" style={{
      background: 'linear-gradient(130deg, #071c26 0%, #0c2d3a 34%, #134e4a 72%, #3f6212 100%)',
      minHeight: '100vh'
    }}>
      {/* Aurora glow layers */}
      <div className="position-absolute" style={{
        top: '-15%',
        left: '-18%',
        width: '44vw',
        maxWidth: '520px',
        minWidth: '260px',
        aspectRatio: '1 / 1',
        background: 'radial-gradient(circle, rgba(45, 212, 191, 0.28) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'drift 14s ease-in-out infinite'
      }}></div>
      <div className="position-absolute" style={{
        bottom: '-18%',
        right: '-14%',
        width: '48vw',
        maxWidth: '560px',
        minWidth: '280px',
        aspectRatio: '1 / 1',
        background: 'radial-gradient(circle, rgba(163, 230, 53, 0.24) 0%, transparent 72%)',
        borderRadius: '50%',
        animation: 'drift 18s ease-in-out infinite reverse'
      }}></div>
      <div className="position-absolute" style={{
        top: '12%',
        right: '20%',
        width: '20vw',
        maxWidth: '240px',
        minWidth: '140px',
        aspectRatio: '1 / 1',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251, 191, 36, 0.16) 0%, transparent 72%)',
        animation: 'pulseGlow 10s ease-in-out infinite'
      }}></div>
      <div className="position-absolute" style={{
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 48%, rgba(0,0,0,0.12) 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 48%, rgba(0,0,0,0.12) 100%)',
        opacity: 0.3,
        pointerEvents: 'none'
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
                  placeholder="Enter your full name"
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
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
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
                  placeholder="Confirm your password"
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
                to="/login" 
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
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 28px) scale(1.08); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.65; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
          opacity: 1;
        }
        input::-webkit-input-placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
          opacity: 1;
        }
        input:-moz-placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
          opacity: 1;
        }
        input::-moz-placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

export default Signup;
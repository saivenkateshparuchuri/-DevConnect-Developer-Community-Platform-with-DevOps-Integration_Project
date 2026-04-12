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
    <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', minHeight: '100vh' }}>
      {/* Animated Background Orbs - Red/Orange theme for admin */}
      <div className="position-absolute" style={{ 
        top: '-5%', 
        right: '-10%', 
        width: '400px', 
        height: '400px', 
        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      <div className="position-absolute" style={{ 
        bottom: '-10%', 
        left: '-5%', 
        width: '350px', 
        height: '350px', 
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite reverse'
      }}></div>

      {/* Main Container */}
      <div className="container" style={{ maxWidth: '480px', position: 'relative', zIndex: 10 }}>
        <div className="slide-in-up" style={{ 
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          overflow: 'hidden'
        }}>
          {/* Header Section - Admin Specific */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
            padding: '2.5rem 2rem 1.5rem',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Custom Logo Design */}
            <div style={{ 
              fontSize: '3.5rem',
              marginBottom: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem'
            }}>
              <svg width="55" height="55" viewBox="0 0 65 65" style={{ filter: 'drop-shadow(0 2px 8px rgba(99, 102, 241, 0.3))' }}>
                {/* Background circle */}
                <circle cx="32.5" cy="32.5" r="30" fill="rgba(99, 102, 241, 0.1)" stroke="url(#logoGradient)" strokeWidth="1.5"/>
                
                {/* Top node */}
                <circle cx="32.5" cy="15" r="3.5" fill="url(#logoGradient)"/>
                
                {/* Left node */}
                <circle cx="15" cy="40" r="3.5" fill="url(#logoGradient)"/>
                
                {/* Right node */}
                <circle cx="50" cy="40" r="3.5" fill="url(#logoGradient)"/>
                
                {/* Center node */}
                <circle cx="32.5" cy="32.5" r="4" fill="url(#logoGradient)"/>
                
                {/* Connection lines */}
                <line x1="32.5" y1="18.5" x2="32.5" y2="28.5" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.7"/>
                <line x1="32.5" y1="18.5" x2="18" y2="37.5" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.7"/>
                <line x1="32.5" y1="18.5" x2="47" y2="37.5" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.7"/>
                <line x1="18" y1="40" x2="29" y2="32.5" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.6"/>
                <line x1="47" y1="40" x2="36" y2="32.5" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.6"/>
                
                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#a78bfa', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
              <span style={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '700',
                fontSize: '1.5rem',
                letterSpacing: '0.5px'
              }}>
                CodeVerse
              </span>
            </div>
            <h2 className="text-light fw-bold mb-1" style={{ fontSize: '1.1rem', letterSpacing: '-0.3px', opacity: 0.9 }}>
              Admin Console
            </h2>
            <p className="mb-0" style={{ 
              fontSize: '0.85rem', 
              background: 'linear-gradient(135deg, #a78bfa 0%, #e0e7ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '500'
            }}>
              Connect, collaborate, and grow with developers worldwide
            </p>
          </div>

          {/* Form Section */}
          <div style={{ padding: '2.5rem' }}>
            <form onSubmit={handleLogin}>
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

              {/* Email Field */}
              <div className="mb-4 slide-in-left delay-1">
                <label className="form-label text-light fw-500 mb-2" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  <span style={{ marginRight: '0.5rem' }}>📧</span>Administrator Email
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
                    e.target.style.border = '1px solid rgba(239, 68, 68, 0.5)';
                    e.target.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Password Field */}
              <div className="mb-5 slide-in-left delay-2">
                <label className="form-label text-light fw-500 mb-2" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  <span style={{ marginRight: '0.5rem' }}>🔐</span>Access Password
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
                    e.target.style.border = '1px solid rgba(239, 68, 68, 0.5)';
                    e.target.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Admin Access Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="btn w-100 fw-bold py-2 mb-3 slide-in-up delay-3"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  color: 'white',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.5)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <span style={{ marginRight: '0.3rem' }}>→</span>
                    Sign In
                  </>
                )}
              </button>

              {/* Return Link */}
              <Link 
                to="/" 
                className="btn w-100 d-block text-center text-decoration-none fw-500 py-2 slide-in-up delay-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.75rem',
                  color: '#e0e7ff',
                  fontSize: '0.9rem',
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
                ← Back to Login
              </Link>
            </form>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-4 text-light-emphasis" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
          <span style={{ marginRight: '0.5rem' }}>🔒</span>This area is restricted to administrators only
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
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

export default AdminLogin;

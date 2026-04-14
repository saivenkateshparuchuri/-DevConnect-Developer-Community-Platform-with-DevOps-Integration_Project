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
    <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden" style={{
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
      <div className="container" style={{ maxWidth: '480px', position: 'relative', zIndex: 10 }}>
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
            {/* Custom Logo Design */}
            <div style={{ 
              fontSize: '3.5rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem'
            }}>
              <svg width="65" height="65" viewBox="0 0 65 65" style={{ filter: 'drop-shadow(0 2px 8px rgba(99, 102, 241, 0.3))' }}>
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
                fontSize: '2rem',
                letterSpacing: '0.5px'
              }}>
                CodeVerse
              </span>
            </div>
            <h1 className="text-light fw-bold mb-2" style={{ fontSize: '1.75rem', letterSpacing: '-0.5px' }}>
              Welcome to CodeVerse
            </h1>
            <p className="mb-0" style={{ 
              fontSize: '0.95rem', 
              background: 'linear-gradient(135deg, #a78bfa 0%, #e0e7ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '500',
              letterSpacing: '0.3px'
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
              <div className="mb-5 slide-in-left delay-2">
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

              {/* Sign In Button */}
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
                    Authenticating...
                  </>
                ) : (
                  <>
                    <span style={{ marginRight: '0.5rem' }}>→</span>
                    Sign In
                  </>
                )}
              </button>
              
              {/* Sign Up Link */}
              <Link 
                to="/signup" 
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
                Create an Account
              </Link>
            </form>

            {/* Admin Link */}
            <div style={{ 
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <Link 
                to="/admin" 
                className="text-decoration-none fw-500 slide-in-up delay-1"
                style={{
                  color: '#a78bfa',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#c4b5fd';
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#a78bfa';
                  e.target.style.textDecoration = 'none';
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>🛡️</span>Admin Console
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-4 text-light-emphasis" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
          Secure authentication powered by JWT
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

export default Login;
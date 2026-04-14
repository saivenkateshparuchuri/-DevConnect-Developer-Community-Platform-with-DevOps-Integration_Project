import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, getTopUsers } from "../services/api";

// --- Minimal, Professional Inline SVG Icons ---
const SvgHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const SvgGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
);
const SvgTag = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
);
const SvgUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const SvgCompany = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22"></line><line x1="15" y1="22" x2="15" y2="22"></line><line x1="9" y1="6" x2="9" y2="6"></line><line x1="15" y1="6" x2="15" y2="6"></line><line x1="9" y1="10" x2="9" y2="10"></line><line x1="15" y1="10" x2="15" y2="10"></line><line x1="9" y1="14" x2="9" y2="14"></line><line x1="15" y1="14" x2="15" y2="14"></line><line x1="9" y1="18" x2="9" y2="18"></line><line x1="15" y1="18" x2="15" y2="18"></line></svg>
);
const SvgChallenge = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-1.02.9C6.46 17.5 4 15 4 12V9h16v3c0 3-2.46 5.5-4.98 5.9-.55.08-1.02-.35-1.02-.9v-2.34"></path></svg>
);
const SvgCode = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);
const SvgChat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);
const SvgRobot = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><rect x="4" y="4" width="16" height="14" rx="3"></rect><path d="M9 8h.01"></path><path d="M15 8h.01"></path><path d="M8 16c1.333-1 2.667-1 4 0"></path><path d="M7 4v-2"></path><path d="M17 4v-2"></path><path d="M9 20v2"></path><path d="M15 20v2"></path></svg>
);
const SvgArticle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const SvgZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
const SvgShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12h6"></path><path d="M12 9v6"></path></svg>
);

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1200;
      setIsMobile(mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getCurrentUser();
        if (userRes && userRes.user) setCurrentUser(userRes.user);
        
        const topRes = await getTopUsers();
        if (topRes && Array.isArray(topRes)) setTopUsers(topRes);
      } catch (err) {
        console.error("Error fetching layout data:", err);
      }
    };
    fetchData();

    const handleProfileUpdated = (event) => {
      if (event.detail) setCurrentUser(event.detail);
    };

    window.addEventListener("profileUpdated", handleProfileUpdated);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdated);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  // Modern sidebar link renderer with a pill-style active state
  const renderLink = (name, path, Icon) => {
    const isActive = location.pathname === path;

    return (
      <Link
        key={path}
        to={path}
        className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
      >
        <span className="sidebar-link-icon">{Icon}</span>
        <span style={{ fontSize: "0.95rem", fontWeight: isActive ? 700 : 500 }}>{name}</span>
      </Link>
    );
  };

  return (
    <div className="container-fluid" style={{ fontFamily: "Inter, sans-serif", padding: 0, margin: 0, minHeight: '100vh', background: 'transparent' }}>
      {/* Floating Particles */}
      <div className="position-fixed top-0 start-0 w-100 h-100 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="floating position-absolute" style={{ top: '10%', left: '10%', fontSize: '2rem', opacity: 0.1 }}>✨</div>
        <div className="floating delay-1 position-absolute" style={{ top: '20%', right: '15%', fontSize: '1.5rem', opacity: 0.1 }}>🌟</div>
        <div className="floating delay-2 position-absolute" style={{ bottom: '30%', left: '20%', fontSize: '1.8rem', opacity: 0.1 }}>💫</div>
        <div className="floating position-absolute" style={{ bottom: '20%', right: '10%', fontSize: '1.2rem', opacity: 0.1 }}>⭐</div>
      </div>

      {/* Animated Background Text */}
      <div className="position-fixed top-0 start-0 w-100 h-100 pointer-events-none" style={{ zIndex: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '15rem',
          fontWeight: 'bold',
          color: 'rgba(99, 102, 241, 0.05)',
          textShadow: '0 0 60px rgba(99, 102, 241, 0.1)',
          whiteSpace: 'nowrap',
          animation: 'floatBackground 20s ease-in-out infinite',
          letterSpacing: '-5px'
        }}>
          CodeVerse
        </div>
      </div>
      <div className="row" style={{ margin: 0, minHeight: '100vh' }}>
        
        {/* Left Panel - Navigation Sidebar */}
        <div className="layout-left-panel p-4 position-fixed" style={{ zIndex: 1000, overflowY: "auto", left: "0", width: "280px", top: "0", height: '100vh', background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(10px)', borderRight: '1px solid rgba(255, 255, 255, 0.05)' }}>
          {/* Logo */}
          <div className="d-flex align-items-center mb-4 px-3 py-2" style={{ cursor: "pointer", borderRadius: "12px", transition: "all 0.3s ease", background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)' }} onClick={() => navigate('/home')}
               onMouseEnter={(e) => {
                 e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)';
                 e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)';
                 e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
               }}>
             <div className="me-3">
               <svg width="36" height="36" viewBox="0 0 65 65" style={{ filter: 'drop-shadow(0 2px 8px rgba(99, 102, 241, 0.2))' }}>
                 {/* Background circle */}
                 <circle cx="32.5" cy="32.5" r="30" fill="rgba(99, 102, 241, 0.1)" stroke="url(#logoGradientLayout)" strokeWidth="1.5"/>
                 
                 {/* Top node */}
                 <circle cx="32.5" cy="15" r="3.5" fill="url(#logoGradientLayout)"/>
                 
                 {/* Left node */}
                 <circle cx="15" cy="40" r="3.5" fill="url(#logoGradientLayout)"/>
                 
                 {/* Right node */}
                 <circle cx="50" cy="40" r="3.5" fill="url(#logoGradientLayout)"/>
                 
                 {/* Center node */}
                 <circle cx="32.5" cy="32.5" r="4" fill="url(#logoGradientLayout)"/>
                 
                 {/* Connection lines */}
                 <line x1="32.5" y1="18.5" x2="32.5" y2="28.5" stroke="url(#logoGradientLayout)" strokeWidth="1.5" opacity="0.7"/>
                 <line x1="32.5" y1="18.5" x2="18" y2="37.5" stroke="url(#logoGradientLayout)" strokeWidth="1.5" opacity="0.7"/>
                 <line x1="32.5" y1="18.5" x2="47" y2="37.5" stroke="url(#logoGradientLayout)" strokeWidth="1.5" opacity="0.7"/>
                 <line x1="18" y1="40" x2="29" y2="32.5" stroke="url(#logoGradientLayout)" strokeWidth="1.5" opacity="0.6"/>
                 <line x1="47" y1="40" x2="36" y2="32.5" stroke="url(#logoGradientLayout)" strokeWidth="1.5" opacity="0.6"/>
                 
                 {/* Gradient definitions */}
                 <defs>
                   <linearGradient id="logoGradientLayout" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                     <stop offset="100%" style={{ stopColor: '#a78bfa', stopOpacity: 1 }} />
                   </linearGradient>
                 </defs>
               </svg>
             </div>
             <div>
               <h5 className="fw-bold m-0 animated-text text-glow" style={{ letterSpacing: "0.5px", fontSize: "1.3rem", background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CodeVerse</h5>
             </div>
          </div>

          {/* Navigation Links */}
          <div className="d-flex flex-column pe-2">
            {renderLink("Home", "/home", <SvgHome />)}
            <div className="mt-4 mb-3 px-3">
              <div className="sidebar-section-divider">
                <span className="sidebar-section-title">PUBLIC</span>
              </div>
            </div>
            {renderLink("Questions", "/questions", <SvgGlobe />)}
            {renderLink("Tags", "/tags", <SvgTag />)}
            {renderLink("Users", "/users", <SvgUsers />)}
            {renderLink("Companies", "/companies", <SvgCompany />)}
            <div className="mt-4 mb-3 px-3">
              <div className="sidebar-section-divider">
                <span className="sidebar-section-title">ENGAGEMENT</span>
              </div>
            </div>
            {renderLink("Challenges", "/challenges", <SvgChallenge />)}
            {renderLink("Practice", "/practice", <SvgCode />)}
            <div className="mt-4 mb-3 px-3">
              <div className="sidebar-section-divider">
                <span className="sidebar-section-title">RESOURCES</span>
              </div>
            </div>
            {renderLink("Chat", "/chat", <SvgChat />)}
            {renderLink("AI", "/ai", <SvgRobot />)}
            {renderLink("Articles", "/articles", <SvgArticle />)}
            {localStorage.getItem("adminToken") && (
              <>
                <div className="mt-4 mb-2 px-3 text-uppercase fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "1px", color: "#a78bfa" }}>Admin Console</div>
                {renderLink("Admin Dashboard", "/admin/dashboard", <SvgShield />)}
              </>
            )}
          </div>
        </div>

        {/* Center Main Content */}
        <div className="layout-main p-0" style={{ 
          backgroundColor: "transparent",
          minHeight: "100vh",
          marginLeft: "280px", 
          marginRight: sidebarOpen ? "280px" : "0",
          width: sidebarOpen ? "calc(100% - 560px)" : "calc(100% - 280px)",
          transition: "all 0.3s ease",
          boxSizing: "border-box"
        }}>
          {/* Top Search Bar / Header */}
          <div className="sticky-top border-bottom px-4 py-3 d-flex align-items-center justify-content-between" style={{ zIndex: 900, backdropFilter: "blur(20px)", background: 'rgba(15, 23, 42, 0.2)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
             <div className="input-group search-bar flex-grow-1" style={{ maxWidth: "600px" }}>
                <span className="input-group-text glass-panel border-end-0 d-flex align-items-center justify-content-center" style={{ background: "rgba(96, 165, 250, 0.1)", border: "none", borderRadius: "12px 0 0 12px" }}>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <circle cx="11" cy="11" r="8"></circle>
                     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                   </svg>
                </span>
                <input 
                  type="text" 
                  className="form-control glass-panel border-start-0 ps-0 text-light" 
                  placeholder="Search questions, tags, or users..." 
                  style={{ fontSize: "0.95rem", background: "rgba(30, 41, 59, 0.6)", border: "none", borderRadius: "0 12px 12px 0", fontWeight: "500" }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                       navigate(`/questions?q=${e.target.value}`);
                    }
                  }}
                />
             </div>
             <button
               className="btn btn-glass ms-3"
               onClick={() => setSidebarOpen(!sidebarOpen)}
               style={{
                 background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                 border: 'none',
                 borderRadius: '999px',
                 width: '52px',
                 height: '52px',
                 padding: 0,
                 cursor: 'pointer',
                 transition: 'all 0.3s ease',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center'
               }}
               title="Toggle sidebar"
             >
               {currentUser?.photoUrl ? (
                 <img
                   src={currentUser.photoUrl}
                   alt="Profile"
                   style={{
                     width: '44px',
                     height: '44px',
                     borderRadius: '50%',
                     objectFit: 'cover',
                     border: '2px solid rgba(255, 255, 255, 0.35)'
                   }}
                 />
               ) : (
                 <span
                   style={{
                     width: '44px',
                     height: '44px',
                     borderRadius: '50%',
                     background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                     border: '2px solid rgba(255, 255, 255, 0.35)',
                     color: 'white',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     fontWeight: 700,
                     fontSize: '1rem'
                   }}
                 >
                   {(currentUser?.name || 'D').charAt(0).toUpperCase()}
                 </span>
               )}
             </button>
          </div>
          <div className="p-4" style={{ maxWidth: "100%", width: "100%" }}>
            {children}
          </div>
        </div>

        {/* Right Panel - User Actions */}
        <div className="layout-right-panel p-4 position-fixed" style={{ 
          zIndex: 1000, 
          overflowY: "auto", 
          right: "0", 
          width: "280px", 
          top: "0",
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.3)',
          backdropFilter: 'blur(10px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          boxShadow: sidebarOpen ? '-2px 0 15px rgba(0,0,0,0.3)' : 'none'
        }}>
          {/* User Profile Section */}
          {currentUser && (
            <div className="mb-4">
              <div className="glass-glow p-3 rounded-3 profile-card">
                <div className="d-flex align-items-start mb-3">
                  <div className="profile-avatar me-3">
                    {currentUser.photoUrl ? (
                      <img src={currentUser.photoUrl} alt="Profile" className="img-fluid rounded-circle" />
                    ) : (
                      currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "D"
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <p className="text-white-50 mb-1" style={{ fontSize: '0.82rem', letterSpacing: '0.3px' }}>Welcome back</p>
                    <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                      <h5 className="text-white fw-bold mb-0 profile-name">{currentUser.name || "Developer"}</h5>
                      {localStorage.getItem("adminToken") && (
                        <span className="admin-badge">ADMIN</span>
                      )}
                    </div>
                    <p className="profile-email mb-0">{currentUser.email}</p>
                  </div>
                </div>
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <button className="btn btn-glass btn-sm flex-fill" style={{ minHeight: '42px' }} onClick={() => navigate(`/profile/${currentUser._id}`)}>
                    Profile
                  </button>
                  <button className="btn btn-glass btn-sm flex-fill" style={{ minHeight: '42px', background: 'linear-gradient(135deg, #f97316, #fb7185)' }} onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Top Users Section */}
          {topUsers.length > 0 && (
            <div className="mb-4">
              <h6 className="text-light fw-bold mb-3">🏆 Top Contributors</h6>
              <div className="glass-glow p-3 rounded-3">
                {topUsers.slice(0, 5).map((user, index) => (
                  <div key={user._id} className="d-flex align-items-center mb-2">
                    <span className="badge bg-primary me-2" style={{ minWidth: '24px' }}>#{index + 1}</span>
                    <div className="avatar-circle me-2" style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <small className="text-light fw-medium">{user.name}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-4">
            <h6 className="text-light fw-bold mb-3">⚡ Quick Actions</h6>
            <div className="d-grid gap-2">
              <button className="btn btn-glass btn-sm text-start" onClick={() => navigate('/questions')}>
                <SvgZap /> Ask Question
              </button>
              <button className="btn btn-glass btn-sm text-start" onClick={() => navigate('/challenges')}>
                <SvgChallenge /> View Challenges
              </button>
              <button className="btn btn-glass btn-sm text-start" onClick={() => navigate('/chat')}>
                <SvgChat /> Start Chat
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Overlay - Closes sidebar when clicked */}
        {sidebarOpen && isMobile && (
          <div
            className="position-fixed"
            onClick={() => setSidebarOpen(false)}
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 999,
              animation: 'fadeIn 0.3s ease',
              backdropFilter: 'blur(2px)'
            }}
          ></div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes floatBackground {
          0%, 100% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
            opacity: 0.05;
          }
          25% {
            transform: translate(calc(-50% + 30px), calc(-50% - 20px)) rotate(5deg) scale(1.05);
            opacity: 0.08;
          }
          50% {
            transform: translate(calc(-50% - 20px), calc(-50% + 30px)) rotate(0deg) scale(1);
            opacity: 0.05;
          }
          75% {
            transform: translate(calc(-50% + 20px), calc(-50% - 40px)) rotate(-5deg) scale(0.95);
            opacity: 0.07;
          }
        }

        @media (max-width: 1200px) {
          .layout-main {
            width: calc(100% - 280px) !important;
            margin-left: 280px !important;
          }
          .layout-right-panel {
            position: fixed !important;
          }
        }

        @media (max-width: 768px) {
          .layout-main {
            width: 100% !important;
            margin-left: 0 !important;
          }
          .layout-left-panel {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
        }
      `}</style>
    </div>
  );
}

export default Layout;

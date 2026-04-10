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
const SvgChat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);
const SvgArticle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const SvgZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [topUsers, setTopUsers] = useState([]);

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  // StackOverflow style link renderer
  const renderLink = (name, path, Icon) => {
    const isActive = location.pathname === path;
    const baseClasses = "d-flex align-items-center py-2 px-3 text-decoration-none rounded-end-pill mb-1";
    
    const activeClasses = isActive 
      ? "bg-light border-start border-3 border-primary text-dark fw-bold" 
      : "text-secondary hover-bg-subtle border-start border-3 border-transparent";
      
    return (
      <Link
        key={path}
        to={path}
        className={`${baseClasses} ${activeClasses}`}
        style={{
          borderLeftColor: isActive ? '#6366f1' : 'transparent',
          backgroundColor: isActive ? '#f5f3ff' : 'transparent',
          transition: "all 0.2s"
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.backgroundColor = "#f5f3ff";
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <span className={isActive ? "text-dark" : "text-secondary"}>{Icon}</span>
        <span style={{ fontSize: "0.95rem" }}>{name}</span>
      </Link>
    );
  };

  return (
    <div className="container-fluid" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="row">
        
        {/* Left Sidebar */}
        <div className="col-md-2 vh-100 py-3 position-fixed bg-white border-end" style={{ zIndex: 1000, overflowY: "auto", paddingRight: 0 }}>
          
          <div className="d-flex align-items-center mb-4 px-3" style={{ cursor: "pointer" }} onClick={() => navigate('/home')}>
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="me-2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
             <h5 className="fw-bold m-0 text-dark" style={{ letterSpacing: "-0.5px" }}>DevCommunity</h5>
          </div>

          <div className="d-flex flex-column pe-2">
            
            {renderLink("Home", "/home", <SvgHome />)}
            
            <div className="mt-4 mb-2 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>Public</div>
            {renderLink("Questions", "/questions", <SvgGlobe />)}
            {renderLink("Tags", "/tags", <SvgTag />)}
            {renderLink("Users", "/users", <SvgUsers />)}
            {renderLink("Companies", "/companies", <SvgCompany />)}

            <div className="mt-4 mb-2 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>Engagement</div>
            {renderLink("Challenges", "/challenges", <SvgChallenge />)}
            
            <div className="mt-4 mb-2 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>Resources</div>
            {renderLink("Chat", "/chat", <SvgChat />)}
            {renderLink("Articles", "/articles", <SvgArticle />)}

            {localStorage.getItem("adminToken") && (
              <>
                <div className="mt-4 mb-2 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "1px", color: "#6366f1" }}>Admin</div>
                {renderLink("Admin Dashboard", "/admin/dashboard", <SvgGlobe />)}
              </>
            )}
          </div>
        </div>

        {/* Center Main Content */}
        <div className="col-md-7 p-0 offset-md-2 min-vh-100" style={{ backgroundColor: "#fdfdfd" }}>
          {/* Top Search Bar / Header */}
          <div className="sticky-top bg-white border-bottom px-4 py-2 d-flex align-items-center" style={{ zIndex: 900 }}>
             <div className="input-group search-bar" style={{ maxWidth: "600px" }}>
                <span className="input-group-text bg-light border-end-0">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </span>
                <input 
                  type="text" 
                  className="form-control bg-light border-start-0 ps-0" 
                  placeholder="Search questions, tags, or users..." 
                  style={{ fontSize: "0.9rem" }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                       navigate(`/questions?q=${e.target.value}`);
                    }
                  }}
                />
             </div>
          </div>
          <div className="p-4">
            {children}
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-md-3 vh-100 p-4 position-fixed end-0 bg-white border-start" style={{ zIndex: 1000, overflowY: "auto" }}>
          
          {/* Header Action Row (Profile Edit + Logout) */}
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
            {currentUser ? (
              <div 
                className="d-flex align-items-center gap-2" 
                style={{ cursor: "pointer", padding: "4px", borderRadius: "8px" }} 
                onClick={() => navigate(`/profile/${currentUser._id}`)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <div 
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" 
                  style={{ width: "36px", height: "36px" }}
                  title="View Profile"
                >
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="d-flex flex-column lh-1">
                  <span className="fw-bold small text-dark">{currentUser.name || "My Profile"}</span>
                  <span className="text-muted" style={{ fontSize: "0.65rem" }}>View &amp; Edit</span>
                </div>
              </div>
            ) : (
              <div></div>
            )}
            
            <button onClick={handleLogout} className="btn btn-light border btn-sm rounded-pill px-3 fw-semibold text-secondary hover-move" style={{ transition: "all 0.2s" }}>
              Logout
            </button>
          </div>

          {/* Context-aware Right Widgets */}
          {location.pathname === "/companies" ? (
            <>
              {/* Industry Filter Widget */}
              <div className="card border p-3 mb-4 rounded-3 shadow-none bg-light pt-2 pb-2">
                <h6 className="fw-bold text-dark mb-3 mt-2 d-flex align-items-center">
                  <span className="me-2">🏭</span> Filter by Industry
                </h6>
                <div className="d-flex flex-column gap-1">
                  {[
                    { name: "All Industries", icon: "🌐", filter: "" },
                    { name: "Technology", icon: "💻", filter: "Technology" },
                    { name: "Social Media", icon: "📱", filter: "Social Media" },
                    { name: "E-Commerce / Cloud", icon: "☁️", filter: "E-Commerce / Cloud" },
                    { name: "Streaming", icon: "🎬", filter: "Streaming / Entertainment" },
                    { name: "Consumer Tech", icon: "📦", filter: "Consumer Technology" }
                  ].map((ind) => {
                    const activeInd = new URLSearchParams(location.search).get('industry') || "";
                    const isActiveInd = activeInd === ind.filter;
                    return (
                      <Link
                        key={ind.name}
                        to={`/companies${ind.filter ? `?industry=${encodeURIComponent(ind.filter)}` : ""}`}
                        className={`text-decoration-none small p-2 rounded d-flex align-items-center ${ isActiveInd ? "bg-primary text-white fw-bold" : "text-secondary" }`}
                        style={{ cursor: "pointer" }}
                      >
                        <span className="me-2">{ind.icon}</span>{ind.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Job Type Widget */}
              <div className="card border p-3 mb-4 rounded-3 shadow-none">
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center">
                  <span className="me-2">🎯</span> Job Types
                </h6>
                <div className="d-flex flex-column gap-2">
                  {[
                    { label: "Full-time", color: "success", count: 14 },
                    { label: "Remote", color: "primary", count: 8 },
                    { label: "Internship", color: "warning", count: 5 }
                  ].map(jt => (
                    <div key={jt.label} className="d-flex justify-content-between align-items-center small">
                      <span className={`badge bg-${jt.color} bg-opacity-10 text-${jt.color} border border-${jt.color} border-opacity-25`}>
                        {jt.label}
                      </span>
                      <span className="text-muted fw-semibold">{jt.count} roles</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Hiring Now */}
              <div className="card border p-3 rounded-3 shadow-none bg-dark text-white">
                <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: "#a5b4fc" }}>
                  <span className="me-2">🔥</span> Actively Hiring
                </h6>
                <div className="d-flex flex-column gap-2">
                  {[
                    { name: "Google", color: "#4285F4", jobs: 3 },
                    { name: "Microsoft", color: "#00A4EF", jobs: 3 },
                    { name: "Meta", color: "#1877F2", jobs: 3 },
                    { name: "Amazon", color: "#FF9900", jobs: 3 }
                  ].map(c => (
                    <div key={c.name} className="d-flex justify-content-between align-items-center small opacity-90">
                      <span className="d-flex align-items-center gap-2">
                        <span className="rounded-circle d-inline-block" style={{ width: "8px", height: "8px", background: c.color }}></span>
                        {c.name}
                      </span>
                      <span className="badge bg-light text-dark">{c.jobs} jobs</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : location.pathname === "/challenges" ? (
             <>
               <div className="card border p-3 mb-4 rounded-3 shadow-none bg-light pt-2 pb-2">
                 <h6 className="fw-bold text-dark mb-3 mt-2 d-flex align-items-center">
                   <span className="me-2">🎯</span> Categories
                 </h6>
                 <div className="d-flex flex-column gap-1">
                   {[
                     { name: "All Challenges", filter: "" },
                     { name: "Frontend UI", filter: "Frontend" },
                     { name: "Backend Logic", filter: "Backend" },
                     { name: "AI & Data", filter: "AI" },
                     { name: "Practice Labs", filter: "Practice" }
                   ].map((cat) => {
                      const isActive = (new URLSearchParams(location.search).get('cat') || "") === cat.filter;
                      return (
                        <Link 
                          key={cat.name} 
                          to={`/challenges${cat.filter ? `?cat=${cat.filter}` : ""}`}
                          className={`small p-2 rounded text-decoration-none transition-all ${isActive ? "bg-primary text-white fw-bold shadow-sm" : "text-secondary hover-bg-light"}`}
                          style={{ cursor: "pointer" }}
                        >
                           {cat.name}
                        </Link>
                      );
                   })}
                 </div>
               </div>

               <div className="card border p-3 mb-4 rounded-3 shadow-none">
                 <h6 className="fw-bold text-dark mb-3 d-flex align-items-center">
                   <span className="me-2"><SvgZap /></span> My Stats
                 </h6>
                 <div className="d-flex justify-content-around text-center py-2">
                    <div>
                       <div className="fw-bold text-primary">12</div>
                       <div className="text-muted" style={{ fontSize: "0.65rem" }}>Solved</div>
                    </div>
                    <div className="border-start"></div>
                    <div>
                       <div className="fw-bold text-success">350</div>
                       <div className="text-muted" style={{ fontSize: "0.65rem" }}>Points</div>
                    </div>
                    <div className="border-start"></div>
                    <div>
                       <div className="fw-bold text-warning">4</div>
                       <div className="text-muted" style={{ fontSize: "0.65rem" }}>Streak</div>
                    </div>
                 </div>
               </div>

               {/* 🏆 Top Challengers — REAL DB USERS */}
               <div className="card border p-3 rounded-3 shadow-none bg-dark text-white">
                 <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: "#a5b4fc" }}>
                   <span className="me-2">🏆</span> Top Challengers
                 </h6>
                 <div className="d-flex flex-column gap-2">
                    {topUsers.length > 0 ? topUsers.slice(0, 5).map((u, idx) => (
                      <div key={u._id} className="d-flex justify-content-between align-items-center small opacity-90">
                         <span className="d-flex align-items-center gap-2">
                           <span className="text-muted fw-bold" style={{ minWidth: "14px" }}>{idx + 1}.</span>
                           <span
                             className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center text-white fw-bold"
                             style={{ width: "22px", height: "22px", fontSize: "0.65rem", flexShrink: 0 }}
                           >
                             {u.name.charAt(0).toUpperCase()}
                           </span>
                           {u.name}
                         </span>
                         <span className="badge bg-light text-dark">#{idx + 1}</span>
                      </div>
                    )) : (
                      <div className="small opacity-75">Loading users...</div>
                    )}
                 </div>
               </div>
             </>
          ) : (
            <>
              <div className="card border p-3 mb-4 rounded-3 shadow-none bg-light pt-2 pb-2">
                <h6 className="fw-bold text-dark mb-3 mt-2 d-flex align-items-center">
                  <span className="me-2">📢</span> Announcements
                </h6>
                <div className="small text-secondary">
                  <p className="mb-2 fw-semibold text-dark border-start border-2 border-primary ps-2">Welcome to Dev Community</p>
                  <p className="mb-0">Start asking questions, connect with top developers, and build your reputation today!</p>
                </div>
              </div>

              <div className="card border p-3 rounded-3 shadow-none">
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center">
                  <span className="me-2">👥</span> Top Users
                </h6>
                <div className="d-flex flex-column gap-2">
                  {topUsers.length > 0 ? topUsers.map((u) => (
                    <Link 
                        key={u._id} 
                        to={`/profile/${u._id}`} 
                        className="d-flex align-items-center gap-2 text-decoration-none p-1 rounded"
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                      <div 
                        className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                        style={{ width: "28px", height: "28px", fontSize: "0.8rem" }}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="small fw-semibold text-dark">{u.name}</span>
                    </Link>
                  )) : (
                    <div className="text-muted small">Loading top users...</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Layout;

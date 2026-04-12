import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";
import { getPosts, getCurrentUser, getTopUsers } from "../services/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, userData, topUsersData] = await Promise.all([
          getPosts(),
          getCurrentUser(),
          getTopUsers()
        ]);
        
        setPosts(postsData);
        if (userData && userData.user) {
          setCurrentUser(userData.user);
        }
        if (topUsersData && Array.isArray(topUsersData)) {
          setTopUsers(topUsersData);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <Layout>
      {/* Title Section */}
      <div className="mb-4 d-flex justify-content-between align-items-start flex-wrap gap-3 slide-in-down">
        <div style={{ maxWidth: '760px' }}>
          <h4 className="fw-bold text-light mb-1 text-glow" style={{ fontSize: '2rem', lineHeight: '1.15', maxWidth: '100%', wordBreak: 'break-word' }}>
             Hey {currentUser ? currentUser.name : "Developer"}, what do you want to learn today?
          </h4>
          <p className="text-white-50 small mb-0 slide-in-left delay-1" style={{ maxWidth: '680px' }}>
             Get instant answers from the community, grounded in verified knowledge.
          </p>
        </div>
        <button 
          type="button"
          className="btn btn-glass shadow-sm hover-move slide-in-right delay-2"
          style={{ minWidth: '170px', padding: '0.9rem 1.4rem' }}
          onClick={() => navigate('/questions')}
        >
          Ask Question
        </button>
      </div>



      {/* Metrics Row */}
      <div className="row g-3 mb-5">
        
        {/* Reputation */}
        <div className="col-md-4 slide-in-left delay-1">
          <div className="card glass-glow border-0 h-100 p-3 rounded-3 hover-move glow-border">
            <h6 className="fw-bold mb-3 text-light">Reputation</h6>
            <div className="d-flex align-items-end mb-3">
              <span className="display-4 fw-light me-3 lh-1 text-light floating">1</span>
              <div 
                className="w-100" 
                style={{ height: "40px", background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(96, 165, 250, 0.1) 10px, rgba(96, 165, 250, 0.1) 20px)" }}
              >
                {/* Visual dotted Graph Mockup */}
                <svg viewBox="0 0 100 20" className="w-100 h-100">
                  <polyline fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4" points="0,15 20,10 40,12 60,5 80,8 100,2" />
                </svg>
              </div>
            </div>
            <p className="small text-white-50 mb-0">
              Earn reputation by <a href="#ask" className="text-decoration-none text-info">Asking</a>, <a href="#answer" className="text-decoration-none text-info">Answering</a> & <a href="#edit" className="text-decoration-none text-info">Editing</a>.
            </p>
          </div>
        </div>

        {/* Badge Progress */}
        <div className="col-md-4 fade-in-scale delay-2">
          <div className="card glass-glow border-0 h-100 p-3 rounded-3 hover-move glow-border">
            <h6 className="fw-bold mb-3 text-light">Badge progress</h6>
            <p className="small text-white-50 mb-4 mt-2">
              Take the tour to earn your first badge!
            </p>
            <button className="btn btn-glass btn-sm rounded-pill mt-auto w-75 py-2" onClick={() => navigate('/questions')}>
              Get started here
            </button>
          </div>
        </div>

        {/* Watched Tags */}
        <div className="col-md-4 slide-in-right delay-3">
          <div className="card glass-glow border-0 h-100 p-3 rounded-3 position-relative hover-move glow-border">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0 text-light">Watched tags</h6>
              <span
                className="text-muted settings-icon"
                title="Manage watched tags"
                style={{ cursor: "pointer" }}
                onClick={() => navigate('/tags')}
              >
                ⚙️
              </span>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <span className="tag-badge slide-in-up delay-4">css</span>
              <span className="tag-badge slide-in-up delay-1">html</span>
              <span className="tag-badge slide-in-up delay-2">javascript</span>
              <span className="tag-badge slide-in-up delay-3">python</span>
            </div>
          </div>
        </div>

      </div>

      {/* Top Contributors Section */}
      {topUsers.length > 0 && (
        <div className="mb-5 slide-in-up delay-2">
          <h5 className="fw-bold text-light mb-3 text-glow">🏆 Top Contributors</h5>
          <div className="row g-3">
            {topUsers.slice(0, 6).map((user, index) => (
              <div key={user._id} className="col-md-6 col-lg-4 slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card glass-glow border-0 h-100 p-3 rounded-3 hover-move glow-border" style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${user._id}`)}>
                  <div className="d-flex align-items-center mb-3">
                    <div className="badge bg-primary me-2" style={{ minWidth: '32px', padding: '0.5rem' }}>#{index + 1}</div>
                    <div className="avatar-circle me-2" style={{ 
                      width: '40px', 
                      height: '40px', 
                      background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.9rem', 
                      fontWeight: 'bold', 
                      color: 'white',
                      flexShrink: 0
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0 text-light fw-bold">{user.name}</h6>
                      <small className="text-white-50">{user.email}</small>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between text-center">
                    <div>
                      <p className="mb-0 text-light fw-bold">⭐ {user.reputation || 0}</p>
                      <small className="text-white-50">Reputation</small>
                    </div>
                    <div>
                      <p className="mb-0 text-light fw-bold">📝 {user.postsCount || 0}</p>
                      <small className="text-white-50">Posts</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feed Section */}
      <div className="mb-3 slide-in-up delay-1">
        <h5 className="fw-bold text-light mb-1 text-glow">Interesting posts for you</h5>
        <p className="text-secondary small mb-3">Based on your viewing history and watched tags. <a href="#feed" className="text-decoration-none text-info">Customize your feed</a></p>
      </div>

      {loading ? (
        <div className="text-center py-5">
           <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-light py-5 card glass-panel border-0 bg-transparent">
           No matching posts found based on your history. Let's ask a question!
        </div>
      ) : (
        <div className="d-flex flex-column gap-1">
          {posts.map(post => (
             <PostCard key={post._id} post={post} onAnswerAdded={() => { /* re-fetch posts if answering from dash */ window.location.reload() }} />
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Home;

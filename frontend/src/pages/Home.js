import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";
import { getPosts, getCurrentUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, userData] = await Promise.all([
          getPosts(),
          getCurrentUser()
        ]);
        
        setPosts(postsData);
        if (userData && userData.user) {
          setCurrentUser(userData.user);
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
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold text-dark mb-1">
             Hey {currentUser ? currentUser.name : "Developer"}, what do you want to learn today?
          </h4>
          <p className="text-secondary small mb-0">
             Get instant answers from the community, grounded in verified knowledge.
          </p>
        </div>
        <button 
          className="btn btn-outline-primary shadow-sm"
          onClick={() => navigate('/questions')}
        >
          Ask Question
        </button>
      </div>



      {/* Metrics Row */}
      <div className="row g-3 mb-5">
        
        {/* Reputation */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100 p-3 rounded-3">
            <h6 className="fw-bold mb-3">Reputation</h6>
            <div className="d-flex align-items-end mb-3">
              <span className="display-4 fw-light me-3 lh-1">1</span>
              <div 
                className="w-100" 
                style={{ height: "40px", background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(13, 110, 253, 0.1) 10px, rgba(13, 110, 253, 0.1) 20px)" }}
              >
                {/* Visual dotted Graph Mockup */}
                <svg viewBox="0 0 100 20" className="w-100 h-100">
                  <polyline fill="none" stroke="#0d6efd" strokeWidth="2" strokeDasharray="4" points="0,15 20,10 40,12 60,5 80,8 100,2" />
                </svg>
              </div>
            </div>
            <p className="small text-muted mb-0">
              Earn reputation by <a href="#ask" className="text-decoration-none">Asking</a>, <a href="#answer" className="text-decoration-none">Answering</a> & <a href="#edit" className="text-decoration-none">Editing</a>.
            </p>
          </div>
        </div>

        {/* Badge Progress */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100 p-3 rounded-3">
            <h6 className="fw-bold mb-3">Badge progress</h6>
            <p className="small text-muted mb-4 mt-2">
              Take the tour to earn your first badge!
            </p>
            <button className="btn btn-primary btn-sm rounded-pill mt-auto w-75 py-2" onClick={() => navigate('/questions')}>
              Get started here
            </button>
          </div>
        </div>

        {/* Watched Tags */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100 p-3 rounded-3 position-relative">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Watched tags</h6>
              <span className="text-muted" style={{ cursor: "pointer" }}>⚙️</span>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-light text-dark border p-2 text-lowercase">css</span>
              <span className="badge bg-light text-dark border p-2 text-lowercase">html</span>
              <span className="badge bg-light text-dark border p-2 text-lowercase">javascript</span>
              <span className="badge bg-light text-dark border p-2 text-lowercase">python</span>
            </div>
          </div>
        </div>

      </div>

      {/* Feed Section */}
      <div className="mb-3">
        <h5 className="fw-bold text-dark mb-1">Interesting posts for you</h5>
        <p className="text-secondary small mb-3">Based on your viewing history and watched tags. <a href="#feed" className="text-decoration-none">Customize your feed</a></p>
      </div>

      {loading ? (
        <div className="text-center py-5">
           <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-muted py-5 card shadow-sm border-0 bg-light">
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

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
  const [typedGreeting, setTypedGreeting] = useState("");
  const [nowTs, setNowTs] = useState(Date.now());
  const navigate = useNavigate();
  const fullGreeting = `Hey ${currentUser ? currentUser.name : "Developer"}, what do you want to learn today?`;
  const reputationScore = currentUser?.reputation || 0;
  const streakDays = Math.max(1, reputationScore);
  const streakStep = 7;
  const streakSegment = streakDays % streakStep;
  const activeSegments = streakSegment === 0 ? streakStep : streakSegment;
  const streakProgress = (activeSegments / streakStep) * 100;
  const nextStreakMilestone = streakDays + (streakStep - activeSegments);
  const lastActivityDate = currentUser?.lastActivityAt ? new Date(currentUser.lastActivityAt) : null;
  const isLastActivityValid = lastActivityDate && !Number.isNaN(lastActivityDate.getTime());
  const msSinceLastActivity = isLastActivityValid ? (Date.now() - lastActivityDate.getTime()) : null;
  const hoursSinceLastActivity = msSinceLastActivity !== null ? msSinceLastActivity / (1000 * 60 * 60) : null;
  const streakBroken = hoursSinceLastActivity !== null ? hoursSinceLastActivity >= 48 : false;
  const streakAtRisk = hoursSinceLastActivity !== null ? (hoursSinceLastActivity >= 24 && hoursSinceLastActivity < 48) : false;
  const flameSpeed = streakBroken ? '3s' : (streakAtRisk ? '1s' : '2.2s');
  const streakResetWindowMs = 48 * 60 * 60 * 1000;
  const resetAtTs = isLastActivityValid ? lastActivityDate.getTime() + streakResetWindowMs : null;
  const resetCountdownMs = resetAtTs ? Math.max(0, resetAtTs - nowTs) : null;
  const countdownHours = resetCountdownMs !== null ? Math.floor(resetCountdownMs / (1000 * 60 * 60)) : 0;
  const countdownMinutes = resetCountdownMs !== null ? Math.floor((resetCountdownMs % (1000 * 60 * 60)) / (1000 * 60)) : 0;
  const countdownSeconds = resetCountdownMs !== null ? Math.floor((resetCountdownMs % (1000 * 60)) / 1000) : 0;
  const resetCountdownLabel = `${String(countdownHours).padStart(2, "0")}:${String(countdownMinutes).padStart(2, "0")}:${String(countdownSeconds).padStart(2, "0")}`;

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

  useEffect(() => {
    if (!streakAtRisk) return undefined;

    const ticker = setInterval(() => {
      setNowTs(Date.now());
    }, 1000);

    return () => clearInterval(ticker);
  }, [streakAtRisk]);

  useEffect(() => {
    setTypedGreeting("");
    let index = 0;

    const typeTimer = setInterval(() => {
      index += 1;
      setTypedGreeting(fullGreeting.slice(0, index));

      if (index >= fullGreeting.length) {
        clearInterval(typeTimer);
      }
    }, 32);

    return () => clearInterval(typeTimer);
  }, [fullGreeting]);

  return (
    <Layout>
      {/* Title Section */}
      <div className="mb-4 d-flex justify-content-between align-items-start flex-wrap gap-3 slide-in-down">
        <div style={{ maxWidth: '760px' }}>
          <h4 className="fw-bold text-light mb-1 text-glow" style={{ fontSize: '2rem', lineHeight: '1.15', maxWidth: '100%', wordBreak: 'break-word' }}>
             {typedGreeting}
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
      <div className="row g-4 mb-5 justify-content-center">
        
        {/* Reputation Streak */}
        <div className="col-xl-4 col-lg-5 col-md-6 slide-in-left delay-1">
          <div
            className={`card glass-glow border-0 h-100 p-4 rounded-3 hover-move glow-border streak-card-snap ${streakAtRisk ? 'streak-card-risk' : ''} ${streakBroken ? 'streak-card-broken' : ''}`}
            style={{ minHeight: '260px' }}
          >
            <h5 className="fw-bold mb-3 text-light" style={{ fontSize: '1.3rem' }}>Streak</h5>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-end">
                <span className={`me-3 streak-flame ${streakBroken ? 'streak-flame-broken' : ''}`} style={{ fontSize: '2.3rem', lineHeight: 1, '--streak-flame-speed': flameSpeed }} role="img" aria-label="Streak">🔥</span>
                <div>
                  <p className="mb-0 text-light fw-bold" style={{ fontSize: '2.4rem', lineHeight: 1 }}>{streakDays}</p>
                  <small className="text-white-50 text-uppercase" style={{ letterSpacing: '0.08em' }}>days in a row</small>
                </div>
              </div>
              <span className="badge rounded-pill" style={{ background: streakBroken ? 'rgba(248, 113, 113, 0.2)' : 'rgba(255, 252, 0, 0.12)', color: streakBroken ? '#fecaca' : '#ffc34d', padding: '0.5rem 0.8rem' }}>
                +{reputationScore} rep
              </span>
            </div>

            {streakBroken && (
              <div className="streak-broken-alert mb-3">
                Streak broken: post or answer now to start a fresh streak.
              </div>
            )}

            {streakAtRisk && (
              <div className="streak-risk-alert mb-3">
                Streak at risk: post or answer today to avoid reset. Resets in <span className="fw-semibold text-light">{resetCountdownLabel}</span>.
              </div>
            )}

            <div className="mb-3" style={{
              background: 'rgba(15, 23, 42, 0.55)',
              border: '1px solid rgba(148, 163, 184, 0.18)',
              borderRadius: '999px',
              padding: '0.55rem 0.6rem'
            }}>
              <div className="d-flex gap-2">
                {Array.from({ length: streakStep }).map((_, index) => (
                  <span
                    key={index}
                    className={index < activeSegments ? `streak-segment-active ${streakBroken ? 'streak-segment-broken' : ''}` : ''}
                    style={{
                      height: '10px',
                      flex: 1,
                      borderRadius: '999px',
                      background: index < activeSegments
                        ? (streakBroken ? 'linear-gradient(90deg, #fb7185, #ef4444)' : 'linear-gradient(90deg, #fffc00, #ff7a00)')
                        : 'rgba(148, 163, 184, 0.24)',
                      boxShadow: index < activeSegments ? (streakBroken ? '0 0 12px rgba(239, 68, 68, 0.5)' : '0 0 14px rgba(255, 122, 0, 0.5)') : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
              <div className="mt-2" style={{
                height: '4px',
                width: `${streakProgress}%`,
                background: streakBroken ? 'linear-gradient(90deg, #fb7185, #ef4444)' : 'linear-gradient(90deg, #fffc00, #ff7a00)',
                borderRadius: '999px',
                transition: 'width 0.35s ease'
              }}></div>
            </div>

            <p className="text-white-50 mb-0" style={{ fontSize: '0.95rem' }}>
              {streakBroken
                ? <>Your streak timer has reset. Jump back in by <a href="#ask" className="text-decoration-none text-info">Asking</a> or <a href="#answer" className="text-decoration-none text-info">Answering</a> today to rebuild momentum.</>
                : <>Keep your streak alive by <a href="#ask" className="text-decoration-none text-info">Asking</a>, <a href="#answer" className="text-decoration-none text-info">Answering</a> & <a href="#edit" className="text-decoration-none text-info">Editing</a> every day. Next milestone: <span className="text-light fw-semibold">{nextStreakMilestone} days</span>.</>
              }
            </p>
          </div>
        </div>

        {/* Challenge Spotlight */}
        <div className="col-xl-4 col-lg-5 col-md-6 fade-in-scale delay-2">
          <div className="card glass-glow border-0 h-100 p-4 rounded-3 position-relative hover-move glow-border" style={{ minHeight: '260px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-light" style={{ fontSize: '1.3rem' }}>Challenge spotlight</h5>
              <span className="text-warning fw-semibold" style={{ letterSpacing: '0.04em' }}>Live</span>
            </div>
            <p className="text-white-50 mb-4" style={{ fontSize: '0.95rem' }}>
              Build momentum with a focused challenge, sharpen your skills, and earn visible progress.
            </p>
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="tag-badge slide-in-up delay-1">daily practice</span>
              <span className="tag-badge slide-in-up delay-2">skill growth</span>
              <span className="tag-badge slide-in-up delay-3">reputation boost</span>
            </div>
            <button className="btn btn-glass rounded-pill mt-auto w-75 py-2" onClick={() => navigate('/challenges')} style={{ fontSize: '0.95rem' }}>
              View challenges
            </button>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="col-xl-4 col-lg-5 col-md-6 slide-in-right delay-3">
          <div className="card glass-glow border-0 h-100 p-4 rounded-3 hover-move glow-border" style={{ minHeight: '260px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0 text-light" style={{ fontSize: '1.3rem' }}>AI assistant</h5>
              <span className="badge rounded-pill" style={{ background: 'rgba(59, 130, 246, 0.18)', color: '#bfdbfe', padding: '0.5rem 0.8rem' }}>
                Fast answers
              </span>
            </div>
            <p className="text-white-50 mb-4 mt-2" style={{ fontSize: '0.95rem' }}>
              Draft questions, refine answers, or get a quick explanation before you post.
            </p>
            <div className="d-flex flex-column gap-2 mb-4">
              <div className="d-flex align-items-center gap-2 text-light small">
                <span>•</span>
                <span>Summarize complex topics in seconds</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-light small">
                <span>•</span>
                <span>Turn rough notes into clear questions</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-light small">
                <span>•</span>
                <span>Jump directly into the AI workspace</span>
              </div>
            </div>
            <button className="btn btn-glass rounded-pill mt-auto w-75 py-2" onClick={() => navigate('/ai')} style={{ fontSize: '0.95rem' }}>
              Open AI helper
            </button>
          </div>
        </div>

      </div>

      {/* Top Contributors Section */}
      {topUsers.length > 0 && (
        <div className="mb-5 slide-in-up delay-2">
          <h4 className="fw-bold text-light mb-4 text-glow" style={{ fontSize: '1.5rem' }}>🏆 Top Contributors</h4>
          <div className="row g-4">
            {topUsers.slice(0, 6).map((user, index) => (
              <div key={user._id} className="col-lg-3 col-md-6 col-sm-6 slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card glass-glow border-0 h-100 p-4 rounded-3 hover-move glow-border" style={{ cursor: 'pointer', transition: 'all 0.3s ease', minHeight: '220px' }} onClick={() => navigate(`/profile/${user._id}`)}>
                  <div className="d-flex flex-column align-items-center text-center mb-4 pb-3 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <div className="badge bg-gradient mb-3" style={{ padding: '0.6rem 0.8rem', fontSize: '0.95rem' }}>#{index + 1}</div>
                    <div className="avatar-circle mb-3" style={{ 
                      width: '60px', 
                      height: '60px', 
                      background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: 'white',
                      flexShrink: 0,
                      boxShadow: '0 4px 15px rgba(96, 165, 250, 0.3)'
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h6 className="mb-1 text-light fw-bold" style={{ fontSize: '1rem' }}>{user.name}</h6>
                    <small className="text-white-50" style={{ fontSize: '0.85rem' }}>{user.email}</small>
                  </div>
                  <div className="d-flex justify-content-around text-center flex-grow-1">
                    <div>
                      <p className="mb-1 text-light fw-bold" style={{ fontSize: '1.1rem' }}>⭐</p>
                      <p className="mb-0 text-light fw-bold" style={{ fontSize: '1.2rem' }}>{user.reputation || 0}</p>
                      <small className="text-white-50" style={{ fontSize: '0.8rem' }}>Reputation</small>
                    </div>
                    <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}></div>
                    <div>
                      <p className="mb-1 text-light fw-bold" style={{ fontSize: '1.1rem' }}>📝</p>
                      <p className="mb-0 text-light fw-bold" style={{ fontSize: '1.2rem' }}>{user.postsCount || 0}</p>
                      <small className="text-white-50" style={{ fontSize: '0.8rem' }}>Posts</small>
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
        <p className="text-secondary small mb-3">Based on your activity and trending discussions. <a href="#feed" className="text-decoration-none text-info">Customize your feed</a></p>
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

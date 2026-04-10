import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getChallenges } from "../services/api";

function Challenges() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCat = searchParams.get("cat") || "";
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const data = await getChallenges();
        setChallenges(data);
      } catch (err) {
        console.error("Error fetching challenges:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const filteredChallenges = activeCat 
    ? challenges.filter(c => c.category === activeCat)
    : challenges;

  return (
    <Layout>
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
           <h3 className="fw-bold m-0 text-dark">🏆 Weekly Challenges</h3>
           <p className="text-muted small mb-0 mt-1">
             {activeCat ? `Showing ${activeCat} challenges.` : "Compete with the best and earn exclusive badges."}
           </p>
        </div>
        <button className="btn btn-outline-primary btn-sm rounded-pill px-3">View My Submissions</button>
      </div>

      {loading ? (
        <div className="text-center py-5">
           <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="text-center py-5 card shadow-sm border-0 bg-light rounded-4">
           <h5 className="text-muted mb-3">No challenges found here.</h5>
           <button className="btn btn-link btn-sm text-decoration-none" onClick={() => navigate("/challenges")}>View All Challenges</button>
        </div>
      ) : (
        <div className="row g-4">
          {filteredChallenges.map((challenge) => (
            <div className="col-md-6" key={challenge._id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-card">
                <div className={`bg-${challenge.color} pb-1`} style={{ height: "4px" }}></div>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className={`badge bg-${challenge.color} bg-opacity-10 text-${challenge.color} border border-${challenge.color} border-opacity-25 rounded-pill`}>
                        {challenge.level}
                      </span>
                      <span className="fw-bold text-dark">{challenge.points} pts</span>
                  </div>
                  
                  <h5 className="fw-bold mb-2 text-dark">{challenge.title}</h5>
                  
                  <div className="d-flex flex-wrap gap-1 mb-3">
                      {challenge.tech.map(t => (
                        <span key={t} className="badge bg-light text-secondary border small fw-normal">{t}</span>
                      ))}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                      <div className="small text-muted d-flex align-items-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        {challenge.deadline}
                      </div>
                      <button 
                        className={`btn btn-sm btn-${challenge.color} rounded-pill px-4 fw-bold`}
                        onClick={() => navigate(`/challenges/${challenge._id}/view`)}
                      >
                        Start Now
                      </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Challenges;
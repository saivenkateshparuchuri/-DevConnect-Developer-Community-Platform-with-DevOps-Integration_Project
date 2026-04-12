import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getChallenges,
  getCurrentUser,
  createChallengeQuestion,
  getMyChallengeSubmissions,
  deleteChallengeQuestion
} from "../services/api";

function Challenges() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCat = searchParams.get("cat") || "";
  const [challenges, setChallenges] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMySubmissions, setShowMySubmissions] = useState(false);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [creating, setCreating] = useState(false);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    level: "Easy",
    points: 50,
    tech: "javascript",
    deadline: "No deadline",
    color: "primary",
    category: "Practice",
    problemStatement: "",
    constraints: "",
    starterCode: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const [data, me] = await Promise.all([getChallenges(), getCurrentUser()]);
        setChallenges(Array.isArray(data) ? data : []);
        if (me && me.user) setCurrentUser(me.user);
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

  const isAdmin = Boolean(localStorage.getItem("adminToken") || (currentUser && currentUser.isAdmin));

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const payload = {
        ...form,
        points: Number(form.points),
        tech: form.tech,
        constraints: form.constraints
      };
      const created = await createChallengeQuestion(payload);
      setChallenges((prev) => [created, ...prev]);
      setForm({
        title: "",
        level: "Easy",
        points: 50,
        tech: "javascript",
        deadline: "No deadline",
        color: "primary",
        category: "Practice",
        problemStatement: "",
        constraints: "",
        starterCode: ""
      });
      setShowCreateForm(false);
    } catch (err) {
      alert(err.message || "Failed to create coding question");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleSubmissions = async () => {
    const next = !showMySubmissions;
    setShowMySubmissions(next);
    if (!next) return;

    try {
      setSubmissionsLoading(true);
      const data = await getMyChallengeSubmissions();
      setMySubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      alert("Failed to fetch your submissions");
      setShowMySubmissions(false);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleDeleteChallenge = async (challengeId) => {
    const confirmed = window.confirm("Delete this challenge permanently?");
    if (!confirmed) return;

    try {
      await deleteChallengeQuestion(challengeId);
      setChallenges((prev) => prev.filter((item) => item._id !== challengeId));
    } catch (err) {
      alert(err.message || "Failed to delete challenge");
    }
  };

  return (
    <Layout>
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
           <h3 className="fw-bold m-0 text-dark">🏆 Weekly Challenges</h3>
           <p className="text-white-50 small mb-0 mt-1">
             {activeCat ? `Showing ${activeCat} challenges.` : "Compete with the best and earn exclusive badges."}
           </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={handleToggleSubmissions}>
            {showMySubmissions ? "Hide My Submissions" : "View My Submissions"}
          </button>
          {isAdmin && (
            <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={() => setShowCreateForm((prev) => !prev)}>
              {showCreateForm ? "Close" : "Post Coding Question"}
            </button>
          )}
        </div>
      </div>

      {showCreateForm && isAdmin && (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3 text-dark">Create Coding Question</h5>
            <form onSubmit={handleCreateChallenge}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Title</label>
                  <input className="form-control" name="title" value={form.title} onChange={handleFormChange} required />
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-semibold">Level</label>
                  <select className="form-select" name="level" value={form.level} onChange={handleFormChange}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-semibold">Points</label>
                  <input type="number" min="1" className="form-control" name="points" value={form.points} onChange={handleFormChange} />
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-semibold">Category</label>
                  <select className="form-select" name="category" value={form.category} onChange={handleFormChange}>
                    <option>Frontend</option>
                    <option>Backend</option>
                    <option>AI</option>
                    <option>Practice</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Tech (comma-separated)</label>
                  <input className="form-control" name="tech" value={form.tech} onChange={handleFormChange} />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Deadline</label>
                  <input className="form-control" name="deadline" value={form.deadline} onChange={handleFormChange} />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Color</label>
                  <select className="form-select" name="color" value={form.color} onChange={handleFormChange}>
                    <option value="primary">Primary</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="danger">Danger</option>
                    <option value="info">Info</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Problem Statement</label>
                  <textarea className="form-control" rows="4" name="problemStatement" value={form.problemStatement} onChange={handleFormChange} required />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Constraints (one per line)</label>
                  <textarea className="form-control" rows="3" name="constraints" value={form.constraints} onChange={handleFormChange} />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Starter Code</label>
                  <textarea className="form-control font-monospace" rows="5" name="starterCode" value={form.starterCode} onChange={handleFormChange} />
                </div>
              </div>
              <div className="mt-3 d-flex justify-content-end">
                <button className="btn btn-primary rounded-pill px-4" type="submit" disabled={creating}>
                  {creating ? "Posting..." : "Post Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMySubmissions && (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3 text-dark">My Challenge Submissions</h5>
            {submissionsLoading ? (
              <div className="text-center py-3"><div className="spinner-border text-primary" role="status"></div></div>
            ) : mySubmissions.length === 0 ? (
              <p className="mb-0 text-muted">No submissions yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Challenge</th>
                      <th>Status</th>
                      <th>Language</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mySubmissions.map((item) => (
                      <tr key={item.submissionId}>
                        <td>{item.challengeTitle}</td>
                        <td>
                          <span className={`badge ${item.status === "Accepted" ? "bg-success" : item.status === "Rejected" ? "bg-danger" : "bg-warning text-dark"}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="text-lowercase">{item.language}</td>
                        <td>{new Date(item.submittedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

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
                  {challenge.problemStatement && (
                    <p className="small text-muted mb-2" style={{ minHeight: "42px" }}>
                      {challenge.problemStatement.slice(0, 100)}{challenge.problemStatement.length > 100 ? "..." : ""}
                    </p>
                  )}
                  
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
                      <div className="d-flex gap-2">
                        <button
                          className={`btn btn-sm ${isAdmin ? "btn-warning text-dark" : `btn-${challenge.color}`} rounded-pill px-4 fw-bold`}
                          onClick={() => navigate(isAdmin ? `/challenges/${challenge._id}/results` : `/challenges/${challenge._id}/view`)}
                        >
                          {isAdmin ? "Results (Admin)" : "Start Now"}
                        </button>
                        {isAdmin && (
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold"
                            onClick={() => handleDeleteChallenge(challenge._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
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
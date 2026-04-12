import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getChallengeById, getCurrentUser } from "../services/api";

function ChallengeResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [challengeData, userData] = await Promise.all([
          getChallengeById(id),
          getCurrentUser()
        ]);

        setChallenge(challengeData);
        if (userData && userData.user) {
          setCurrentUser(userData.user);
        }
      } catch (err) {
        console.error("Failed to load challenge results", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const submissionStats = useMemo(() => {
    const submissions = challenge?.submissions || [];
    return {
      total: submissions.length,
      pending: submissions.filter((item) => item.status === "Pending").length,
      accepted: submissions.filter((item) => item.status === "Accepted").length,
      rejected: submissions.filter((item) => item.status === "Rejected").length,
      withFeedback: submissions.filter((item) => (item.feedback || "").trim().length > 0).length,
      uniqueUsers: new Set(submissions.map((item) => item.user?._id || item.user?.id || item.user).filter(Boolean).map(String)).size
    };
  }, [challenge]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
      </Layout>
    );
  }

  if (!challenge) {
    return (
      <Layout>
        <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
          <h5 className="mb-2">Challenge not found</h5>
          <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate("/challenges")}>Back to Challenges</button>
        </div>
      </Layout>
    );
  }

  const submissions = [...(challenge.submissions || [])].sort(
    (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
  );

  return (
    <Layout>
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-4">
        <div className="bg-dark p-4 text-white d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <div className="small text-uppercase text-white-50 fw-bold mb-1">Admin View Only</div>
            <h4 className="fw-bold mb-0">📊 {challenge.title}</h4>
            <p className="small opacity-75 mb-0 mt-1">{challenge.level} • {challenge.points} pts • {challenge.category}</p>
          </div>
          <button className="btn btn-outline-light rounded-pill px-4" onClick={() => navigate("/challenges")}>Back to Challenges</button>
        </div>

        <div className="card-body p-4 p-md-5">
          <div className="row g-3 mb-4">
            <div className="col-md-2"><div className="card border-0 shadow-sm rounded-4 h-100"><div className="card-body"><div className="small text-muted text-uppercase fw-bold">Submissions</div><h4 className="mb-0 fw-bold">{submissionStats.total}</h4></div></div></div>
            <div className="col-md-2"><div className="card border-0 shadow-sm rounded-4 h-100"><div className="card-body"><div className="small text-muted text-uppercase fw-bold">Pending</div><h4 className="mb-0 fw-bold text-warning">{submissionStats.pending}</h4></div></div></div>
            <div className="col-md-2"><div className="card border-0 shadow-sm rounded-4 h-100"><div className="card-body"><div className="small text-muted text-uppercase fw-bold">Accepted</div><h4 className="mb-0 fw-bold text-success">{submissionStats.accepted}</h4></div></div></div>
            <div className="col-md-2"><div className="card border-0 shadow-sm rounded-4 h-100"><div className="card-body"><div className="small text-muted text-uppercase fw-bold">Rejected</div><h4 className="mb-0 fw-bold text-danger">{submissionStats.rejected}</h4></div></div></div>
            <div className="col-md-2"><div className="card border-0 shadow-sm rounded-4 h-100"><div className="card-body"><div className="small text-muted text-uppercase fw-bold">Feedback</div><h4 className="mb-0 fw-bold text-primary">{submissionStats.withFeedback}</h4></div></div></div>
            <div className="col-md-2"><div className="card border-0 shadow-sm rounded-4 h-100"><div className="card-body"><div className="small text-muted text-uppercase fw-bold">Users</div><h4 className="mb-0 fw-bold">{submissionStats.uniqueUsers}</h4></div></div></div>
          </div>

          <div className="alert alert-info border-0 rounded-3 mb-4">
            <h6 className="fw-bold mb-2">Problem Statement</h6>
            <p className="small mb-2" style={{ whiteSpace: "pre-wrap" }}>{challenge.problemStatement || "No problem statement provided."}</p>
          </div>

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h5 className="mb-0 fw-bold text-dark">Submission Results</h5>
              <span className="text-muted small">{currentUser?.name ? `Signed in as ${currentUser.name}` : ""}</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="bg-light text-secondary text-uppercase small fw-bold">
                    <tr>
                      <th>User</th>
                      <th>Language</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.length === 0 ? (
                      <tr><td colSpan="5" className="text-center text-muted py-4">No submissions yet.</td></tr>
                    ) : submissions.map((submission) => (
                      <tr key={submission._id}>
                        <td>
                          <div className="fw-semibold">{submission.user?.name || "Unknown"}</div>
                          <div className="text-muted" style={{ fontSize: "0.75rem" }}>{submission.user?.email || ""}</div>
                        </td>
                        <td className="text-lowercase">{submission.language}</td>
                        <td>
                          <span className={`badge ${submission.status === "Accepted" ? "bg-success" : submission.status === "Rejected" ? "bg-danger" : "bg-warning text-dark"}`}>
                            {submission.status}
                          </span>
                        </td>
                        <td className="text-muted small">{new Date(submission.submittedAt).toLocaleString()}</td>
                        <td style={{ maxWidth: "320px" }}>
                          <div className="small text-muted text-truncate" title={submission.feedback || "No feedback added"}>
                            {submission.feedback || "No feedback added"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ChallengeResults;
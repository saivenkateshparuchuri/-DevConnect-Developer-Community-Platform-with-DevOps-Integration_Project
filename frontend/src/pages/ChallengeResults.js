import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { adminReviewChallengeSubmission, getChallengeById, getCurrentUser } from "../services/api";

function ChallengeResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [feedbackBySubmission, setFeedbackBySubmission] = useState({});
  const [marksBySubmission, setMarksBySubmission] = useState({});
  const [reviewingSubmissionId, setReviewingSubmissionId] = useState("");
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
      awardedMarksTotal: submissions.reduce((sum, item) => sum + (Number(item.awardedMarks) || 0), 0),
      uniqueUsers: new Set(submissions.map((item) => item.user?._id || item.user?.id || item.user).filter(Boolean).map(String)).size
    };
  }, [challenge]);

  const handleFeedbackChange = (submissionId, value) => {
    setFeedbackBySubmission((prev) => ({ ...prev, [submissionId]: value }));
  };

  const handleMarksChange = (submissionId, value) => {
    setMarksBySubmission((prev) => ({ ...prev, [submissionId]: value }));
  };

  const handleReview = async (submission, status) => {
    try {
      setReviewingSubmissionId(submission._id);
      const feedback = feedbackBySubmission[submission._id] ?? submission.feedback ?? "";
      const marksValue = marksBySubmission[submission._id];
      const awardedMarks = marksValue !== undefined && marksValue !== ""
        ? Number(marksValue)
        : (submission.awardedMarks || 0);

      const response = await adminReviewChallengeSubmission(
        challenge._id,
        submission._id,
        {
          status,
          feedback,
          awardedMarks
        }
      );

      setChallenge((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          submissions: prev.submissions.map((item) =>
            item._id === submission._id
              ? {
                  ...item,
                  status: response.submission.status,
                  feedback: response.submission.feedback,
                  awardedMarks: response.submission.awardedMarks || 0,
                  reviewedAt: response.submission.reviewedAt,
                  reviewedBy: response.submission.reviewedBy
                }
              : item
          )
        };
      });
    } catch (err) {
      alert(err.message || "Failed to review submission");
    } finally {
      setReviewingSubmissionId("");
    }
  };

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
            <div className="col-md-2"><div className="card border-0 shadow-sm rounded-4 h-100"><div className="card-body"><div className="small text-muted text-uppercase fw-bold">Marks Allocated</div><h4 className="mb-0 fw-bold text-info">{submissionStats.awardedMarksTotal}</h4></div></div></div>
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
                      <th>Marks</th>
                      <th>Submitted</th>
                      <th>Feedback</th>
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.length === 0 ? (
                      <tr><td colSpan="7" className="text-center text-muted py-4">No submissions yet.</td></tr>
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
                        <td style={{ minWidth: "120px" }}>
                          <input
                            type="number"
                            min="0"
                            max={challenge.points}
                            className="form-control form-control-sm"
                            value={marksBySubmission[submission._id] ?? submission.awardedMarks ?? 0}
                            onChange={(e) => handleMarksChange(submission._id, e.target.value)}
                          />
                        </td>
                        <td className="text-muted small">{new Date(submission.submittedAt).toLocaleString()}</td>
                        <td style={{ minWidth: "260px" }}>
                          <textarea
                            className="form-control form-control-sm"
                            rows="2"
                            placeholder="Add feedback"
                            value={feedbackBySubmission[submission._id] ?? submission.feedback ?? ""}
                            onChange={(e) => handleFeedbackChange(submission._id, e.target.value)}
                          />
                        </td>
                        <td style={{ minWidth: "190px" }}>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-success"
                              disabled={reviewingSubmissionId === submission._id}
                              onClick={() => handleReview(submission, "Accepted")}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              disabled={reviewingSubmissionId === submission._id}
                              onClick={() => handleReview(submission, "Rejected")}
                            >
                              Reject
                            </button>
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
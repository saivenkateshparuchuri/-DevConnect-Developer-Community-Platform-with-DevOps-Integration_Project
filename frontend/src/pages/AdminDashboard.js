import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllUsers,
  getPosts,
  adminGetMe,
  adminDeleteUser,
  adminDeletePost,
  getAllChallengeSubmissions,
  adminReviewChallengeSubmission
} from "../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [challengeSubmissions, setChallengeSubmissions] = useState([]);
  const [feedbackBySubmission, setFeedbackBySubmission] = useState({});
  const [reviewingSubmissionId, setReviewingSubmissionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const navigate = useNavigate();

  const fetchAdminData = async () => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin");
      return;
    }

    try {
      setLoading(true);
      const [usersList, postsList, submissionsList, adminMe] = await Promise.all([
        getAllUsers(),
        getPosts(),
        getAllChallengeSubmissions(),
        adminGetMe(adminToken)
      ]);

      setUsers(usersList);
      setPosts(postsList);
      setChallengeSubmissions(Array.isArray(submissionsList) ? submissionsList : []);
      if (adminMe.user) setCurrentAdmin(adminMe.user);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();

    const intervalId = setInterval(() => {
      getAllChallengeSubmissions()
        .then((submissionsList) => setChallengeSubmissions(Array.isArray(submissionsList) ? submissionsList : []))
        .catch((err) => console.error("Error refreshing challenge submissions:", err));
    }, 15000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        getAllChallengeSubmissions()
          .then((submissionsList) => setChallengeSubmissions(Array.isArray(submissionsList) ? submissionsList : []))
          .catch((err) => console.error("Error refreshing challenge submissions:", err));
      }
    };

    window.addEventListener("focus", handleVisibilityChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleVisibilityChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate]);

  const handleDeleteUser = async (userId) => {
    if(!window.confirm("Are you sure you want to permanently delete this user?")) return;

    try {
      const adminToken = localStorage.getItem("adminToken");
      const data = await adminDeleteUser(userId, adminToken);
      
      if(data._id) {
        setUsers(users.filter(u => u._id !== userId));
      } else {
        alert(`Failed to delete: ${data.message}`);
      }
    } catch (err) {
      console.error("Deletion error:", err);
      alert("An error occurred during deletion.");
    }
  };

  const handleDeletePost = async (postId) => {
    if(!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const adminToken = localStorage.getItem("adminToken");
      const data = await adminDeletePost(postId, adminToken);
      
      if(data._id) {
        setPosts(posts.filter(p => p._id !== postId));
      } else {
        alert(`Failed to delete: ${data.message}`);
      }
    } catch (err) {
      console.error("Deletion error:", err);
      alert("An error occurred during deletion.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const handleFeedbackChange = (submissionId, value) => {
    setFeedbackBySubmission((prev) => ({ ...prev, [submissionId]: value }));
  };

  const sortedChallengeSubmissions = [...challengeSubmissions].sort((a, b) => {
    const statusRank = (submission) => (submission.status === "Pending" ? 0 : submission.status === "Rejected" ? 1 : 2);
    const rankDiff = statusRank(a) - statusRank(b);
    if (rankDiff !== 0) return rankDiff;
    return new Date(b.submittedAt) - new Date(a.submittedAt);
  });

  const handleReviewSubmission = async (submission, status) => {
    try {
      setReviewingSubmissionId(submission.submissionId);
      const feedback = feedbackBySubmission[submission.submissionId] || "";

      const response = await adminReviewChallengeSubmission(
        submission.challengeId,
        submission.submissionId,
        { status, feedback }
      );

      setChallengeSubmissions((prev) =>
        prev.map((item) =>
          item.submissionId === submission.submissionId
            ? {
                ...item,
                status: response.submission.status,
                feedback: response.submission.feedback,
                reviewedAt: response.submission.reviewedAt
              }
            : item
        )
      );
    } catch (err) {
      alert(err.message || "Failed to review submission");
    } finally {
      setReviewingSubmissionId("");
    }
  };

  const pendingChallengeSubmissions = challengeSubmissions.filter((s) => s.status === "Pending");
  const uniqueSubmitterCount = new Set(
    challengeSubmissions
      .map((submission) => submission.user?._id || submission.user?.id || submission.user)
      .filter(Boolean)
      .map(String)
  ).size;
  const reviewedChallengeSubmissions = challengeSubmissions.filter((s) => s.status !== "Pending");
  const feedbackMarkedSubmissions = challengeSubmissions.filter((s) => (s.feedback || "").trim().length > 0).length;
  const acceptedCount = challengeSubmissions.filter((s) => s.status === "Accepted").length;
  const rejectedCount = challengeSubmissions.filter((s) => s.status === "Rejected").length;

  if (loading) {
    return <div className="vh-100 d-flex justify-content-center align-items-center bg-white"><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="min-vh-100 bg-light text-dark border-top border-4 border-primary">
      {/* Admin Navbar */}
      <nav className="navbar navbar-light bg-white border-bottom shadow-sm mb-4 py-2">
        <div className="container px-4">
          <Link className="navbar-brand fw-bold" style={{ color: "#6366f1" }} to="/admin/dashboard">
            <span className="me-2">🛡️</span>Admin Console
          </Link>
          
          <div className="d-flex align-items-center gap-3">
             {currentAdmin && (
               <div className="d-flex align-items-center gap-2 border-end pe-3 me-1">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px", fontSize: "0.8rem" }}>
                    {currentAdmin.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="d-flex flex-column lh-1">
                    <span className="small fw-bold text-dark">{currentAdmin.name}</span>
                    <span className="text-muted" style={{ fontSize: "0.65rem" }}>{currentAdmin.role}</span>
                  </div>
               </div>
             )}
            <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" style={{ fontSize: "0.8rem" }} onClick={handleLogout}>
              Logout Session
            </button>
          </div>
        </div>
      </nav>

      <div className="container px-4">
        <div className="row mb-4 g-3">
          <div className="col-md-3">
             <div className="card border-0 text-white shadow-sm" style={{ background: "linear-gradient(135deg, #4338ca, #6366f1)" }}>
               <div className="card-body">
                 <h6 className="text-light text-opacity-75 small fw-bold">TOTAL USERS</h6>
                 <h2 className="mb-0 fw-bold">{users.length}</h2>
               </div>
             </div>
          </div>
          <div className="col-md-3">
             <div className="card border-0 text-white shadow-sm" style={{ background: "linear-gradient(135deg, #6d28d9, #8b5cf6)" }}>
               <div className="card-body">
                 <h6 className="text-light text-opacity-75 small fw-bold">TOTAL POSTS</h6>
                 <h2 className="mb-0 fw-bold">{posts.length}</h2>
               </div>
             </div>
          </div>
          <div className="col-md-3">
             <div className="card border-0 text-white shadow-sm" style={{ background: "linear-gradient(135deg, #ea580c, #f97316)" }}>
               <div className="card-body">
                 <h6 className="text-light text-opacity-75 small fw-bold">CODING SUBMISSIONS</h6>
                 <h2 className="mb-0 fw-bold">{challengeSubmissions.length}</h2>
               </div>
             </div>
          </div>
          <div className="col-md-3">
             <div className="card border-0 text-white shadow-sm" style={{ background: "linear-gradient(135deg, #b91c1c, #ef4444)" }}>
               <div className="card-body">
                 <h6 className="text-light text-opacity-75 small fw-bold">PENDING REVIEW</h6>
                 <h2 className="mb-0 fw-bold">{pendingChallengeSubmissions.length}</h2>
               </div>
             </div>
          </div>
        </div>

        <div className="row mb-5 g-3">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}>
              <div className="card-body text-white">
                <div className="small text-white-50 fw-bold text-uppercase">Unique Submitters</div>
                <h3 className="mb-1 fw-bold">{uniqueSubmitterCount}</h3>
                <div className="small text-white-50">Users who have submitted at least once</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: "linear-gradient(135deg, #064e3b, #10b981)" }}>
              <div className="card-body text-white">
                <div className="small text-white-50 fw-bold text-uppercase">Reviewed Submissions</div>
                <h3 className="mb-1 fw-bold">{reviewedChallengeSubmissions.length}</h3>
                <div className="small text-white-50">Accepted + rejected records</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: "linear-gradient(135deg, #7c2d12, #fb923c)" }}>
              <div className="card-body text-white">
                <div className="small text-white-50 fw-bold text-uppercase">Feedback Marks</div>
                <h3 className="mb-1 fw-bold">{feedbackMarkedSubmissions}</h3>
                <div className="small text-white-50">Submissions with reviewer feedback</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: "linear-gradient(135deg, #312e81, #818cf8)" }}>
              <div className="card-body text-white">
                <div className="small text-white-50 fw-bold text-uppercase">Marks Split</div>
                <h3 className="mb-1 fw-bold">{acceptedCount} / {rejectedCount}</h3>
                <div className="small text-white-50">Accepted / rejected</div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
           <div className="col-md-12">
             <div className="card bg-white border-0 shadow-sm rounded-3">
               <div className="card-header bg-white border-bottom py-3">
                 <h5 className="mb-0 fw-bold text-dark">Recent Users Directory</h5>
               </div>
               <div className="card-body p-0">
                 <div className="table-responsive">
                   <table className="table table-hover mb-0">
                     <thead className="bg-light text-secondary text-uppercase small fw-bold">
                       <tr>
                         <th>Developer</th>
                         <th>Email</th>
                         <th>Bio</th>
                         <th>Joined</th>
                         <th>Action</th>
                       </tr>
                     </thead>
                     <tbody>
                       {users.slice(0, 10).map(u => (
                         <tr key={u._id}>
                           <td>
                             <div className="d-flex align-items-center gap-2">
                                <div 
                                  className={`rounded-circle d-flex align-items-center justify-content-center text-white ${u.gender === 'female' ? 'bg-danger' : 'bg-primary'}`}
                                  style={{ width: "30px", height: "30px", fontSize: "0.7rem" }}
                                >
                                  {u.gender === 'female' ? '👩' : '👨'}
                                </div>
                                <div className="d-flex flex-column">
                                  <span className="fw-bold small">{u.name}</span>
                                  <span className="text-muted" style={{ fontSize: "0.65rem" }}>ID: {u._id.slice(-6)}</span>
                                </div>
                             </div>
                           </td>
                           <td className="small">{u.email}</td>
                           <td className="small text-muted text-truncate" style={{ maxWidth: "200px" }}>{u.bio || "-"}</td>
                           <td className="small">{new Date(u.createdAt).toLocaleDateString()}</td>
                           <td>
                             <button 
                               className="btn btn-sm btn-outline-danger py-0 px-2 rounded-pill" 
                               onClick={() => handleDeleteUser(u._id)}
                             >
                               Restrict
                             </button>
                           </td>
                         </tr>
                       ))}
                       {users.length === 0 && (
                         <tr><td colSpan="5" className="text-center text-muted py-3">No users found.</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
           </div>
        </div>

        <div className="row mt-5">
           <div className="col-md-12">
             <div className="card bg-white border-0 shadow-sm rounded-3">
               <div className="card-header bg-white border-bottom py-3">
                 <h5 className="mb-0 fw-bold text-dark">Recent Posts Management</h5>
               </div>
               <div className="card-body p-0">
                 <div className="table-responsive">
                   <table className="table table-hover mb-0">
                     <thead className="bg-light text-secondary text-uppercase small fw-bold">
                       <tr>
                         <th>ID</th>
                         <th>Title</th>
                         <th>Author ID</th>
                         <th>Date</th>
                         <th>Action</th>
                       </tr>
                     </thead>
                     <tbody>
                       {posts.slice(0, 10).map(p => (
                         <tr key={p._id}>
                           <td className="text-secondary small">{p._id}</td>
                           <td>{p.title}</td>
                           <td className="text-secondary small">{p.author}</td>
                           <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                           <td>
                             <button 
                               className="btn btn-sm btn-outline-danger py-0 px-2 rounded-pill" 
                               onClick={() => handleDeletePost(p._id)}
                             >
                               Delete
                             </button>
                           </td>
                         </tr>
                       ))}
                       {posts.length === 0 && (
                         <tr><td colSpan="5" className="text-center text-muted py-3">No posts found.</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
           </div>
        </div>

        <div className="row mt-5 pb-4">
           <div className="col-md-12">
             <div className="card bg-white border-0 shadow-sm rounded-3">
               <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                 <h5 className="mb-0 fw-bold text-dark">Coding Submissions Review</h5>
                 <span className="badge bg-warning text-dark">Pending: {pendingChallengeSubmissions.length}</span>
               </div>
               <div className="card-body p-0">
                 <div className="table-responsive">
                   <table className="table table-hover mb-0">
                     <thead className="bg-light text-secondary text-uppercase small fw-bold">
                       <tr>
                         <th>Challenge</th>
                         <th>User</th>
                         <th>Language</th>
                         <th>Status</th>
                         <th>Submitted</th>
                         <th style={{ minWidth: "270px" }}>Feedback</th>
                         <th style={{ minWidth: "180px" }}>Actions</th>
                       </tr>
                     </thead>
                     <tbody>
                       {sortedChallengeSubmissions.map((submission) => (
                         <tr key={submission.submissionId}>
                           <td>
                             <div className="fw-semibold small">{submission.challengeTitle}</div>
                             <div className="text-muted" style={{ fontSize: "0.7rem" }}>{submission.level} • {submission.points} pts</div>
                           </td>
                           <td>
                             <div className="small fw-semibold">{submission.user?.name || "Unknown"}</div>
                             <div className="text-muted" style={{ fontSize: "0.7rem" }}>{submission.user?.email || ""}</div>
                           </td>
                           <td className="text-lowercase small">{submission.language}</td>
                           <td>
                             <span className={`badge ${submission.status === "Accepted" ? "bg-success" : submission.status === "Rejected" ? "bg-danger" : "bg-warning text-dark"}`}>
                               {submission.status}
                             </span>
                           </td>
                           <td className="small">{new Date(submission.submittedAt).toLocaleString()}</td>
                           <td>
                             <textarea
                               className="form-control form-control-sm"
                               rows="2"
                               placeholder="Add review feedback"
                               value={feedbackBySubmission[submission.submissionId] ?? submission.feedback ?? ""}
                               onChange={(e) => handleFeedbackChange(submission.submissionId, e.target.value)}
                             />
                           </td>
                           <td>
                             <div className="d-flex gap-2">
                               <button
                                 className="btn btn-sm btn-success"
                                 disabled={reviewingSubmissionId === submission.submissionId}
                                 onClick={() => handleReviewSubmission(submission, "Accepted")}
                               >
                                 Accept
                               </button>
                               <button
                                 className="btn btn-sm btn-danger"
                                 disabled={reviewingSubmissionId === submission.submissionId}
                                 onClick={() => handleReviewSubmission(submission, "Rejected")}
                               >
                                 Reject
                               </button>
                             </div>
                           </td>
                         </tr>
                       ))}
                       {challengeSubmissions.length === 0 && (
                         <tr><td colSpan="7" className="text-center text-muted py-3">No coding submissions found.</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getChallengeById, submitChallengeSolution } from "../services/api";

function ActiveChallenge() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        setLoading(true);
        const data = await getChallengeById(id);
        setChallenge(data);
        setCode(data.starterCode || "");
      } catch (err) {
        console.error("Failed to load challenge", err);
      } finally {
        setLoading(false);
      }
    };

    loadChallenge();
  }, [id]);

  useEffect(() => {
    let timer = null;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
      alert("Time is up!");
      navigate("/challenges");
    }
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}:` : ""}${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setResult(null);
      const data = await submitChallengeSolution(id, { language, code });
      setResult(data);
    } catch (err) {
      setResult({ message: err.message || "Submission failed" });
    } finally {
      setSubmitting(false);
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

  return (
    <Layout>
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-4">
        <div className="bg-dark p-4 text-white d-flex justify-content-between align-items-center">
           <div>
              <h4 className="fw-bold mb-0">🚀 {challenge.title}</h4>
              <p className="small opacity-75 mb-0 mt-1">{challenge.level} • {challenge.points} pts • {challenge.category}</p>
           </div>
           <div className="text-center bg-white bg-opacity-10 rounded px-3 py-2 border border-white border-opacity-25">
              <div className="small text-uppercase opacity-75 fw-bold" style={{ fontSize: "0.6rem" }}>Time Remaining</div>
              <div className="fs-3 fw-bold font-monospace" style={{ minWidth: "100px" }}>{formatTime(timeLeft)}</div>
           </div>
        </div>
        
        <div className="card-body p-5">
           <div className="alert alert-info border-0 rounded-3 mb-4">
              <h6 className="fw-bold mb-2">Problem Statement</h6>
              <p className="small mb-2" style={{ whiteSpace: "pre-wrap" }}>{challenge.problemStatement || "No problem statement provided."}</p>
              {Array.isArray(challenge.constraints) && challenge.constraints.length > 0 && (
                <ul className="small mb-0">
                  {challenge.constraints.map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              )}
           </div>

           <div className="mb-3 d-flex gap-3 align-items-center">
              <div>
                <label className="form-label small fw-semibold mb-1">Language</label>
                <select className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <div className="small text-muted mt-4">Tech: {(challenge.tech || []).join(", ")}</div>
           </div>

           <div className="mb-4">
             <label className="form-label fw-semibold">Your Solution</label>
             <textarea
               className="form-control font-monospace"
               style={{ minHeight: "300px" }}
               value={code}
               onChange={(e) => setCode(e.target.value)}
               placeholder="Write your coding solution here..."
             />
           </div>

           {result && (
             <div className={`alert ${result.submission && result.submission.status === "Accepted" ? "alert-success" : "alert-warning"} border-0 rounded-3 mb-4`}>
               <div className="fw-semibold">{result.message || "Submission completed"}</div>
               {result.submission && (
                 <div className="small mt-1">Status: {result.submission.status}</div>
               )}
             </div>
           )}

           <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-primary rounded-pill px-5 fw-bold py-2 shadow-sm" disabled={submitting} onClick={handleSubmit}>
                {submitting ? "Submitting..." : "Submit Final Solution"}
              </button>
              <button className="btn btn-outline-danger rounded-pill px-4" onClick={() => navigate("/challenges")}>Give Up</button>
           </div>
        </div>
      </div>
      
      <div className="text-center text-muted small mt-4">
        &copy; 2026 Dev Community Standard Challenges Engine. All rights reserved.
      </div>
    </Layout>
  );
}

export default ActiveChallenge;

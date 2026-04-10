import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function ActiveChallenge() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

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

  return (
    <Layout>
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-4">
        <div className="bg-dark p-4 text-white d-flex justify-content-between align-items-center">
           <div>
              <h4 className="fw-bold mb-0">🚀 Active Challenge: #{id}</h4>
              <p className="small opacity-75 mb-0 mt-1">Do not refresh the page during the challenge.</p>
           </div>
           <div className="text-center bg-white bg-opacity-10 rounded px-3 py-2 border border-white border-opacity-25">
              <div className="small text-uppercase opacity-75 fw-bold" style={{ fontSize: "0.6rem" }}>Time Remaining</div>
              <div className="fs-3 fw-bold font-monospace" style={{ minWidth: "100px" }}>{formatTime(timeLeft)}</div>
           </div>
        </div>
        
        <div className="card-body p-5">
           <div className="alert alert-info border-0 rounded-3 mb-4">
              <h6 className="fw-bold mb-2">Instructions:</h6>
              <p className="small mb-0">Implement a real-time messaging interface that supports persistent message history and connection indicators. Use the tech stack specified in the challenge description.</p>
           </div>

           <div className="bg-light p-4 rounded-4 text-center border-dashed border-2 mb-4" style={{ borderStyle: "dashed" }}>
              <div className="opacity-50 mb-3" style={{ fontSize: "3rem" }}>💻</div>
              <h5 className="fw-bold text-dark mb-2">Editor Environment Loading...</h5>
              <p className="text-muted small">Your dedicated sandbox will be ready in a few seconds.</p>
           </div>

           <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-primary rounded-pill px-5 fw-bold py-2 shadow-sm" onClick={() => alert("Solution submitted!")}>Submit Final Solution</button>
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

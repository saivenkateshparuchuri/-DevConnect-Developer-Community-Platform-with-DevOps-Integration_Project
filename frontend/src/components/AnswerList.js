import { Link } from "react-router-dom";

function AnswerList({ answers }) {
  if (!answers || answers.length === 0) {
    return <div className="text-muted small mt-3 fst-italic">No answers yet. Be the first to answer!</div>;
  }

  return (
    <div className="mt-4 border-top pt-3">
      <h6 className="fw-bold mb-3">{answers.length} {answers.length === 1 ? "Answer" : "Answers"}</h6>
      <div className="d-flex flex-column gap-3">
        {answers.map((ans, index) => (
          <div key={index} className="d-flex gx-3 pb-3 border-bottom">
            {/* Votes column */}
            <div className="d-flex flex-column align-items-center me-3" style={{ width: "40px" }}>
              <button className="btn btn-link text-decoration-none text-muted p-0 fs-5 border-0 bg-transparent">▲</button>
              <span className="fw-bold fs-5 text-secondary">{Math.floor(Math.random() * 10)}</span>
              <button className="btn btn-link text-decoration-none text-muted p-0 fs-5 border-0 bg-transparent">▼</button>
            </div>
            
            {/* Answer Content */}
            <div className="flex-grow-1">
              <p className="mb-2" style={{ whiteSpace: "pre-wrap" }}>{ans.text}</p>
              
              <div className="d-flex justify-content-end">
                <div className="bg-light p-2 rounded small" style={{ minWidth: "150px" }}>
                  <div className="text-muted mb-1" style={{ fontSize: "0.75rem" }}>
                    answered {new Date(ans.createdAt).toLocaleDateString()}
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px", fontSize: "0.8rem" }}>
                      {ans.user?.name ? ans.user.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <Link to={`/profile/${ans.user?._id || ans.user}`} className="text-decoration-none">
                      {ans.user?.name || "Unknown"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnswerList;
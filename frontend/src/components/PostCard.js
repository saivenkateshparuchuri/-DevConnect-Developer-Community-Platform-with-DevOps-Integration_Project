import { useState } from "react";
import { Link } from "react-router-dom";
import AnswerBox from "./AnswerBox";
import AnswerList from "./AnswerList";

function PostCard({ post, onAnswerAdded }) {
  const [showAnswers, setShowAnswers] = useState(false);
  const [showAnswerBox, setShowAnswerBox] = useState(false);

  // StackOverflow dummy stats
  const votes = Math.floor(Math.random() * 50) + 1;
  const views = Math.floor(Math.random() * 500) + 20;
  const answerCount = post.answers?.length || 0;

  return (
    <div className="card glass-glow mb-4 border-0 border-bottom border-secondary border-opacity-25 pb-3 hover-move glow-border fade-in-scale">
      <div className="card-body d-flex gap-3">
        {/* Left Stats Column */}
        <div className="d-flex flex-column align-items-end" style={{ minWidth: "80px" }}>
          <div className="text-light small mb-1">{votes} votes</div>
          <div className={`small mb-1 px-2 py-1 rounded ${answerCount > 0 ? "border border-success text-success" : "text-muted"}`}>
            {answerCount} answers
          </div>
          <div className="text-light small">{views} views</div>
        </div>

        {/* Right Content Column */}
        <div className="flex-grow-1">
          <Link to={`/questions/${post._id}`} onClick={(e) => e.preventDefault()} className="text-decoration-none focus-ring">
            <h5 className="text-info mb-2" style={{ cursor: "pointer" }}>{post.title}</h5>
          </Link>
          <p className="text-light mb-3" style={{ whiteSpace: "pre-wrap", display: "-webkit-box", WebkitLineClamp: "3", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {post.content}
          </p>
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="d-flex gap-2">
              <button 
                onClick={() => setShowAnswers(!showAnswers)} 
                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
              >
                {showAnswers ? "Hide Answers" : `View Answers (${answerCount})`}
              </button>
              <button 
                onClick={() => setShowAnswerBox(!showAnswerBox)} 
                className="btn btn-sm btn-outline-primary rounded-pill px-3"
              >
                {showAnswerBox ? "Cancel" : "Add Answer"}
              </button>
            </div>

            <div className="bg-light p-2 rounded small" style={{ minWidth: "150px" }}>
              <div className="text-muted mb-1" style={{ fontSize: "0.75rem" }}>
                asked {new Date(post.createdAt || Date.now()).toLocaleDateString()}
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px", fontSize: "0.8rem" }}>
                  {post.user?.name ? post.user.name.charAt(0).toUpperCase() : "?"}
                </div>
                <Link to={`/profile/${post.user?._id || post.user}`} className="text-decoration-none shadow-sm">
                  {post.user?.name || "Unknown Author"}
                </Link>
              </div>
            </div>
          </div>

          {/* Expanded Sections */}
          {showAnswerBox && (
            <AnswerBox 
              postId={post._id} 
              onAnswerAdded={() => {
                setShowAnswerBox(false);
                setShowAnswers(true);
                if (onAnswerAdded) onAnswerAdded();
              }} 
            />
          )}
          {showAnswers && (
            <AnswerList answers={post.answers} />
          )}

        </div>
      </div>
    </div>
  );
}

export default PostCard;
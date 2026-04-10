import { useState } from "react";
import { addAnswer } from "../services/api";

function AnswerBox({ postId, onAnswerAdded }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitAnswer = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await addAnswer(postId, text);
      setText("");
      if (onAnswerAdded) {
        onAnswerAdded();
      }
    } catch (err) {
      setError("Failed to submit answer. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 bg-light p-3 border rounded">
      <h6 className="fw-bold mb-2">Your Answer</h6>
      {error && <div className="alert alert-danger py-1 px-2 border-0 text-white rounded bg-danger small">{error}</div>}
      <textarea
        className="form-control mb-2"
        rows="3"
        placeholder="Type your detailed answer here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
      <div className="d-flex justify-content-end">
        <button onClick={submitAnswer} className="btn btn-primary btn-sm px-4" disabled={loading || !text.trim()}>
          {loading ? "Posting..." : "Post Answer"}
        </button>
      </div>
    </div>
  );
}

export default AnswerBox;
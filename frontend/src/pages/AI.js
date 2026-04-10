import { useState } from "react";
import Layout from "../components/Layout";

function AI() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = () => {
    if (!input.trim()) return;
    setLoading(true);
    // Simulate AI delay
    setTimeout(() => {
      setResponse("I'm an AI assistant. I'm currently not connected to an LLM provider, but when I am, I'll be able to help you debug this code!");
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <h3 className="fw-bold m-0 text-dark">🤖 AI Assistant</h3>
      </div>
      
      <div className="card shadow-sm p-4 mb-4 border-0 rounded-3 bg-light">
        <h5 className="text-secondary fw-bold mb-3">Ask me anything</h5>
        <textarea
          className="form-control mb-3"
          rows="4"
          placeholder="E.g. How do I reverse a linked list in Python?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary px-4 fw-bold" onClick={handleAsk} disabled={loading || !input.trim()}>
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>
      </div>

      {response && (
        <div className="card shadow-sm p-4 border-0 rounded-3 border-start border-4 border-primary">
          <h6 className="fw-bold text-primary mb-2">AI Response</h6>
          <p className="mb-0">{response}</p>
        </div>
      )}
    </Layout>
  );
}

export default AI;
import { useState } from "react";
import Layout from "../components/Layout";
import { askAI } from "../services/api";

function AI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!input.trim()) return;
    const prompt = input.trim();

    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const data = await askAI(prompt);
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer || "No response from AI." }]);
    } catch (err) {
      setError(err.message || "Failed to get a response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h3 className="fw-bold m-0 text-light">🤖 AI Assistant</h3>
          <p className="text-white-50 mb-0">Ask questions, explore code ideas, or get instant guidance.</p>
        </div>
      </div>

      <div className="card glass-glow border-0 p-4 mb-4 rounded-3">
        <h5 className="text-light fw-bold mb-3">Ask me anything</h5>
        <textarea
          className="form-control glass-panel text-white bg-transparent border-0"
          rows="5"
          placeholder="E.g. How do I reverse a linked list in Python?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          style={{ minHeight: '170px', resize: 'vertical', border: '1px solid rgba(255,255,255,0.08)' }}
        />
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-white-50">AI chat is powered by OpenAI.</small>
          <button className="btn btn-glass rounded-pill px-4 py-2" onClick={handleAsk} disabled={loading || !input.trim()}>
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger glass-panel text-white border-0 mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="d-flex flex-column gap-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-3 glass-glow ${message.role === 'assistant' ? 'border-primary' : 'border-white-10'}`}
            style={{ background: message.role === 'assistant' ? 'rgba(59,130,246,0.08)' : 'rgba(148,163,184,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="d-flex align-items-center mb-2">
              <span className="badge rounded-pill me-2" style={{ background: message.role === 'assistant' ? '#60a5fa' : '#8b5cf6', color: 'white' }}>
                {message.role === 'assistant' ? 'AI' : 'You'}
              </span>
              <small className="text-white-50">{message.role === 'assistant' ? 'AI response' : 'Your prompt'}</small>
            </div>
            <p className="mb-0 text-white" style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default AI;
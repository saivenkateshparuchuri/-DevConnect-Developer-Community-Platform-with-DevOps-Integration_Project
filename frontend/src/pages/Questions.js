import { useEffect, useState } from "react";
import { getPosts, createPost } from "../services/api";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";

function Questions() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      await createPost({ title, content });
      setTitle("");
      setContent("");
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      alert("Failed to create post. " + err.message);
    }
  };

  return (
    <Layout>
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <h4 className="fw-bold m-0 text-dark">All Questions</h4>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary shadow-sm px-4 rounded-pill"
        >
          {showForm ? "Cancel" : "Ask Question"}
        </button>
      </div>

      {showForm && (
        <div className="card shadow-sm p-4 mb-4 border-0 rounded-3 bg-light">
          <h5 className="text-secondary fw-bold mb-3">Ask a public question</h5>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Title</label>
            <input
              className="form-control"
              placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Body</label>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Include all the information someone would need to answer your question"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-end">
            <button onClick={handleCreatePost} className="btn btn-primary px-4 fw-bold">
              Post your question
            </button>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-5 text-muted">No questions available. Be the first to ask!</div>
      ) : (
        <div className="d-flex flex-column gap-1">
          {posts
            .filter(post => 
              post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              post.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((post) => (
              <PostCard key={post._id} post={post} onAnswerAdded={fetchPosts} />
            ))
          }
          {posts.filter(post => 
              post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              post.content.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 && (
              <div className="text-center py-5 text-muted">No questions match your search "{searchQuery}".</div>
            )
          }
        </div>
      )}
    </Layout>
  );
}

export default Questions;
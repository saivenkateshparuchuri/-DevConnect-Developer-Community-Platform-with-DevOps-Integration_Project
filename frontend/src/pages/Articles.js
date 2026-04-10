import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getArticles } from "../services/api";

function Articles() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await getArticles();
        setArticles(data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = activeCategory === "All" 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  return (
    <Layout>
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-4">
        <div>
           <h3 className="fw-bold m-0 text-dark">📰 Developer Hub</h3>
           <p className="text-muted small mb-0 mt-1">Daily insights, tutorials, and ecosystem news from the database.</p>
        </div>
        <button className="btn btn-primary rounded-pill px-4 fw-bold">Write Article</button>
      </div>

      {loading ? (
        <div className="text-center py-5">
           <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="card shadow-sm border-0 p-5 text-center bg-light rounded-4">
           <h4 className="text-secondary mb-3">No articles found!</h4>
           <p className="text-muted">We are currently seeding the community with new content. Check back soon.</p>
        </div>
      ) : (
        <>
          {/* Featured Article Hero (Using first article as featured if available) */}
          <div className="card border-0 rounded-5 overflow-hidden shadow-lg mb-5 bg-dark text-white">
            <div className="row g-0 align-items-center">
               <div className="col-md-7 p-5">
                  <span className="badge bg-primary px-3 py-2 rounded-pill mb-3 fw-bold">Featured Spotlight</span>
                  <h1 className="fw-bold display-5 mb-3 lh-sm">{articles[0]?.title}</h1>
                  <p className="lead opacity-75 mb-4">{articles[0]?.description}</p>
                  <div className="d-flex align-items-center gap-3">
                     <div className="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "40px", height: "40px" }}>
                       {articles[0]?.author.charAt(0).toUpperCase()}
                     </div>
                     <div className="small">
                        <div className="fw-bold">{articles[0]?.author}</div>
                        <div className="opacity-75">{articles[0]?.date} • {articles[0]?.readTime}</div>
                     </div>
                     <button className="ms-auto btn btn-light rounded-pill px-4 fw-bold shadow">Read Now</button>
                  </div>
               </div>
               <div className="col-md-5">
                  <img src={articles[0]?.image} alt="Tech" className="w-100 h-100 object-fit-cover" style={{ minHeight: "350px" }} />
               </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
             {["All", "Tutorial", "Insights", "Backend", "AI", "Frontend"].map(cat => (
                <button 
                   key={cat} 
                   onClick={() => setActiveCategory(cat)}
                   className={`btn btn-sm rounded-pill px-4 fw-bold transition-all ${activeCategory === cat ? "btn-dark shadow-sm" : "btn-light text-secondary border"}`}
                >
                   {cat}
                </button>
             ))}
          </div>

          {/* Articles Grid */}
          <div className="row g-4">
             {filteredArticles.map(article => (
                <div className="col-md-6 col-lg-6" key={article._id}>
                   <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-card">
                      <div className="position-relative">
                         <img src={article.image} alt={article.title} className="card-img-top w-100" style={{ height: "200px", objectFit: "cover" }} />
                         <span className={`position-absolute top-0 end-0 m-3 badge bg-${article.color} shadow`}>{article.category}</span>
                      </div>
                      <div className="card-body p-4">
                         <div className="text-primary small fw-bold mb-2">{article.date}</div>
                         <h4 className="fw-bold mb-3 text-dark">{article.title}</h4>
                         <p className="text-muted small mb-4 text-truncate-2">{article.description}</p>
                         
                         <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                            <div className="small fw-semibold">{article.author}</div>
                            <div className="text-muted small">{article.readTime}</div>
                         </div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </>
      )}
    </Layout>
  );
}

export default Articles;
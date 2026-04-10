import { useState } from "react";
import Layout from "../components/Layout";

const initialTags = [
  { name: "React", count: 1240, description: "Declarative, efficient, and flexible JavaScript library for building user interfaces.", color: "primary" },
  { name: "JavaScript", count: 2850, description: "The language of the web. Essential for front-end and back-end development.", color: "warning" },
  { name: "Node.js", count: 960, description: "Asynchronous event-driven JavaScript runtime built on Chrome's V8 JS engine.", color: "success" },
  { name: "MongoDB", count: 540, description: "The database for modern applications. Document-based, distributed, and multi-cloud.", color: "success" },
  { name: "CSS", count: 820, description: "Cascading Style Sheets are used to format the layout and aesthetic of web pages.", color: "info" },
  { name: "Python", count: 1420, description: "Versatile programming language for data science, AI, web dev, and automation.", color: "primary" },
  { name: "GraphQL", count: 320, description: "A query language for APIs and a runtime for fulfilling those queries with data.", color: "danger" },
  { name: "Docker", count: 410, description: "A platform for developers to develop, ship, and run applications with containers.", color: "dark" },
  { name: "TypeScript", count: 890, description: "Typed superset of JavaScript that compiles to plain JavaScript.", color: "primary" },
  { name: "Next.js", count: 670, description: "The React Framework for production. Hybrid static & server rendering.", color: "dark" },
  { name: "AI", count: 1540, description: "Artificial Intelligence, Machine Learning, and Large Language Models.", color: "info" },
  { name: "Redux", count: 280, description: "Predictable state container for JavaScript apps.", color: "danger" }
];

function Tags() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredTags = initialTags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
           <h3 className="fw-bold m-0 text-dark">🏷 Popular Tags</h3>
           <p className="text-muted small mb-0 mt-1">Foundational keywords to categorize the community network.</p>
        </div>
        <div className="col-md-4">
           <input 
              type="text" 
              className="form-control rounded-pill border-light shadow-sm" 
              placeholder="Search tags..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {filteredTags.length > 0 ? (
        <div className="row g-4 pt-1">
          {filteredTags.map((tag) => (
            <div className="col-md-3 col-sm-6" key={tag.name}>
              <div className="card h-100 border-0 shadow-sm rounded-4 hover-card p-2">
                <div className="card-body">
                   <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className={`badge bg-${tag.color} bg-opacity-10 text-${tag.color} border border-${tag.color} border-opacity-25 fs-6 px-3 py-2 fw-bold`}>
                        {tag.name}
                      </span>
                      <span className="small text-muted">{tag.count} posts</span>
                   </div>
                   <p className="text-muted small lh-sm mb-0">
                     {tag.description}
                   </p>
                </div>
               
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
           <div className="display-1 mb-3 opacity-25">🔍</div>
           <h5 className="text-muted">Oops! We couldn't find any tags matching "{searchTerm}"</h5>
           <button className="btn btn-outline-primary mt-3 px-4 rounded-pill" onClick={() => setSearchTerm("")}>Clear Search</button>
        </div>
      )}
    </Layout>
  );
}

export default Tags;

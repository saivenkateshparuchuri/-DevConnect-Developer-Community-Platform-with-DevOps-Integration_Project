import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";

const companies = [
  {
    id: 1,
    name: "Google",
    logo: "G",
    logoColor: "#4285F4",
    logoBg: "#E8F0FE",
    tagline: "Organize the world's information",
    industry: "Technology",
    size: "100,000+ employees",
    location: "Mountain View, CA",
    website: "https://careers.google.com",
    rating: "4.5",
    tags: ["AI", "Cloud", "Search", "Android"],
    jobs: [
      { title: "Senior Software Engineer", type: "Full-time", location: "Mountain View / Remote", link: "https://careers.google.com/jobs/results/?q=software+engineer" },
      { title: "Product Manager, AI", type: "Full-time", location: "New York, NY", link: "https://careers.google.com/jobs/results/?q=product+manager" },
      { title: "UX Designer", type: "Full-time", location: "San Francisco, CA", link: "https://careers.google.com/jobs/results/?q=ux+designer" }
    ]
  },
  {
    id: 2,
    name: "Microsoft",
    logo: "M",
    logoColor: "#00A4EF",
    logoBg: "#E6F4FB",
    tagline: "Empowering every person and organization",
    industry: "Technology",
    size: "220,000+ employees",
    location: "Redmond, WA",
    website: "https://careers.microsoft.com",
    rating: "4.4",
    tags: ["Azure", "AI", "Cloud", "DevTools"],
    jobs: [
      { title: "Software Engineer II", type: "Full-time", location: "Redmond / Remote", link: "https://careers.microsoft.com/us/en/search-results?keywords=software+engineer" },
      { title: "Cloud Solutions Architect", type: "Full-time", location: "Chicago, IL", link: "https://careers.microsoft.com/us/en/search-results?keywords=cloud+architect" },
      { title: "Security Engineer", type: "Full-time", location: "Remote", link: "https://careers.microsoft.com/us/en/search-results?keywords=security+engineer" }
    ]
  },
  {
    id: 3,
    name: "Meta",
    logo: "f",
    logoColor: "#1877F2",
    logoBg: "#E7F3FF",
    tagline: "Build the future of social technology",
    industry: "Social Media",
    size: "86,000+ employees",
    location: "Menlo Park, CA",
    website: "https://metacareers.com",
    rating: "4.2",
    tags: ["React", "AI", "VR/AR", "Infrastructure"],
    jobs: [
      { title: "Frontend Engineer — React", type: "Full-time", location: "Menlo Park / Remote", link: "https://metacareers.com/jobs" },
      { title: "ML Engineer, Ranking", type: "Full-time", location: "Seattle, WA", link: "https://metacareers.com/jobs" },
      { title: "Data Infrastructure Engineer", type: "Full-time", location: "New York, NY", link: "https://metacareers.com/jobs" }
    ]
  },
  {
    id: 4,
    name: "Amazon",
    logo: "A",
    logoColor: "#FF9900",
    logoBg: "#FFF8EE",
    tagline: "Work hard. Have fun. Make history.",
    industry: "E-Commerce / Cloud",
    size: "1,500,000+ employees",
    location: "Seattle, WA",
    website: "https://amazon.jobs",
    rating: "4.0",
    tags: ["AWS", "Cloud", "Logistics", "AI"],
    jobs: [
      { title: "Software Dev Engineer", type: "Full-time", location: "Seattle, WA", link: "https://amazon.jobs/en/search#/q=software+engineer" },
      { title: "AWS Solutions Architect", type: "Full-time", location: "Remote", link: "https://amazon.jobs/en/search#/q=solutions+architect" },
      { title: "Backend Engineer, Prime", type: "Full-time", location: "Austin, TX", link: "https://amazon.jobs/en/search#/q=backend+engineer" }
    ]
  },
  {
    id: 5,
    name: "Netflix",
    logo: "N",
    logoColor: "#E50914",
    logoBg: "#FFEFEF",
    tagline: "Entertain the world",
    industry: "Streaming / Entertainment",
    size: "12,000+ employees",
    location: "Los Gatos, CA",
    website: "https://jobs.netflix.com",
    rating: "4.3",
    tags: ["Streaming", "AI", "Java", "Microservices"],
    jobs: [
      { title: "Senior Backend Engineer", type: "Full-time", location: "Los Gatos, CA", link: "https://jobs.netflix.com/search?q=backend+engineer" },
      { title: "Data Scientist, Personalization", type: "Full-time", location: "Los Angeles, CA", link: "https://jobs.netflix.com/search?q=data+scientist" },
      { title: "Full Stack Engineer", type: "Full-time", location: "Remote", link: "https://jobs.netflix.com/search?q=full+stack" }
    ]
  },
  {
    id: 6,
    name: "Apple",
    logo: "",
    logoColor: "#555555",
    logoBg: "#F5F5F7",
    tagline: "Think different. Build different.",
    industry: "Consumer Technology",
    size: "164,000+ employees",
    location: "Cupertino, CA",
    website: "https://jobs.apple.com",
    rating: "4.5",
    tags: ["Swift", "iOS", "macOS", "Hardware"],
    jobs: [
      { title: "iOS Software Engineer", type: "Full-time", location: "Cupertino, CA", link: "https://jobs.apple.com/en-us/search?q=ios+engineer" },
      { title: "Machine Learning Researcher", type: "Full-time", location: "Seattle, WA", link: "https://jobs.apple.com/en-us/search?q=machine+learning" },
      { title: "Hardware Engineer, Silicon", type: "Full-time", location: "Cupertino, CA", link: "https://jobs.apple.com/en-us/search?q=hardware+engineer" }
    ]
  }
];

const JobTypeTag = ({ type }) => {
  const color = type === "Full-time" ? "success" : type === "Part-time" ? "warning" : "info";
  return <span className={`badge bg-${color} bg-opacity-10 text-${color} border border-${color} border-opacity-25 small fw-semibold`}>{type}</span>;
};

function Companies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [searchParams] = useSearchParams();
  const activeIndustry = searchParams.get("industry") || "";

  const filtered = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = !activeIndustry || c.industry === activeIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <Layout>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div>
          <h3 className="fw-bold m-0 text-dark">🏢 Top Companies Hiring Developers</h3>
          <p className="text-muted small mb-0 mt-1">Click a company to see open roles and visit their careers page.</p>
        </div>
        <input
          type="text"
          className="form-control rounded-pill border-light shadow-sm"
          style={{ maxWidth: "260px" }}
          placeholder="Search companies or skills..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Companies Grid */}
      <div className="d-flex flex-column gap-4">
        {filtered.length === 0 && (
          <div className="text-center py-5">
            <div className="display-1 opacity-25 mb-3">🔍</div>
            <h5 className="text-muted">No companies match "{searchTerm}"</h5>
            <button className="btn btn-outline-primary rounded-pill mt-3 px-4" onClick={() => setSearchTerm("")}>Clear Search</button>
          </div>
        )}

        {filtered.map(company => (
          <div key={company.id} className="card border-0 shadow-sm rounded-4 overflow-hidden">
            {/* Company Header Row */}
            <div
              className="card-body p-4 d-flex flex-wrap gap-3 align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => setExpandedId(expandedId === company.id ? null : company.id)}
            >
              {/* Logo Avatar */}
              <div
                className="rounded-3 d-flex align-items-center justify-content-center fw-black"
                style={{
                  width: "60px", height: "60px", fontSize: "1.8rem",
                  background: company.logoBg, color: company.logoColor,
                  flexShrink: 0, fontWeight: 900
                }}
              >
                {company.logo}
              </div>

              {/* Info */}
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h5 className="fw-bold mb-0 text-dark">{company.name}</h5>
                  <span className="badge bg-light text-secondary border small">{company.industry}</span>
                  <span className="ms-1 text-warning">{'★'.repeat(Math.round(parseFloat(company.rating)))} <span className="text-muted fw-normal">{company.rating}</span></span>
                </div>
                <p className="text-muted small mb-2">{company.tagline}</p>
                <div className="d-flex flex-wrap gap-1">
                  {company.tags.map(tag => (
                    <span key={tag} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 fw-normal" style={{ fontSize: "0.7rem" }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Right side info */}
              <div className="text-end d-none d-md-block">
                <div className="small fw-semibold text-dark mb-1">📍 {company.location}</div>
                <div className="small text-muted mb-2">{company.size}</div>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-dark rounded-pill px-3"
                  onClick={e => e.stopPropagation()}
                >
                  Visit Careers ↗
                </a>
              </div>

              {/* Expand Arrow */}
              <div className="ps-2">
                <span className="text-muted fs-5">{expandedId === company.id ? "▲" : "▼"}</span>
              </div>
            </div>

            {/* Jobs Panel (Expandable) */}
            {expandedId === company.id && (
              <div className="border-top bg-light px-4 py-3">
                <h6 className="fw-bold text-dark mb-3">Open Positions at {company.name}</h6>
                <div className="row g-3">
                  {company.jobs.map((job, idx) => (
                    <div className="col-md-4" key={idx}>
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        <div className="card border-0 shadow-sm rounded-3 p-3 hover-card h-100">
                          <div className="fw-bold text-dark small mb-2">{job.title}</div>
                          <div className="d-flex align-items-center justify-content-between">
                            <span className="text-muted" style={{ fontSize: "0.72rem" }}>📍 {job.location}</span>
                            <JobTypeTag type={job.type} />
                          </div>
                          <div className="mt-2 text-primary" style={{ fontSize: "0.72rem", fontWeight: 600 }}>Apply on {company.name} →</div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default Companies;
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden py-4"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(128deg, #071c26 0%, #0b2d3b 35%, #134e4a 72%, #365314 100%)",
      }}
    >
      <div
        className="position-absolute"
        style={{
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          opacity: 0.28,
          pointerEvents: "none",
        }}
      ></div>

      <div
        className="position-absolute"
        style={{
          top: "-18%",
          left: "-10%",
          width: "460px",
          height: "460px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(45,212,191,0.3) 0%, transparent 72%)",
          animation: "landingDrift 14s ease-in-out infinite",
        }}
      ></div>
      <div
        className="position-absolute"
        style={{
          right: "-14%",
          bottom: "-20%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(163,230,53,0.24) 0%, transparent 72%)",
          animation: "landingDrift 18s ease-in-out infinite reverse",
        }}
      ></div>

      <div className="container" style={{ position: "relative", zIndex: 5, maxWidth: "1080px" }}>
        <div
          style={{
            borderRadius: "2rem",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(6, 20, 28, 0.62)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 24px 80px rgba(2, 8, 23, 0.48)",
            overflow: "hidden",
          }}
        >
          <div className="row g-0">
            <div
              className="col-lg-7"
              style={{
                padding: "3rem 2.2rem",
                borderRight: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <p
                style={{
                  marginBottom: "0.9rem",
                  letterSpacing: "0.12em",
                  fontWeight: 700,
                  color: "#99f6e4",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                }}
              >
                DevConnect Platform
              </p>
              <h1
                className="text-light fw-bold"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, marginBottom: "1rem" }}
              >
                Build Your Developer Identity.
                <br />
                Learn. Collaborate. Ship.
              </h1>
              <p
                style={{
                  color: "#dbeafe",
                  opacity: 0.9,
                  fontSize: "1rem",
                  maxWidth: "44ch",
                  marginBottom: "1.5rem",
                }}
              >
                DevConnect is a community platform where developers ask and answer questions,
                share articles, join coding challenges, chat with peers, and explore AI-assisted
                workflows in one place.
              </p>

              <div className="d-flex flex-column gap-2" style={{ color: "#e2e8f0" }}>
                <div>- Ask questions, post solutions, and grow your reputation.</div>
                <div>- Participate in challenges and track your progress.</div>
                <div>- Connect with developers through real-time chat.</div>
                <div>- Explore curated technical articles and AI support tools.</div>
              </div>
            </div>

            <div className="col-lg-5" style={{ padding: "3rem 2.2rem" }}>
              <div
                style={{
                  borderRadius: "1.25rem",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(15, 23, 42, 0.55)",
                  padding: "1.25rem",
                  marginBottom: "1.2rem",
                  color: "#e2e8f0",
                }}
              >
                <h2 className="h5 fw-semibold text-light mb-2">About This Platform</h2>
                <p className="mb-0" style={{ fontSize: "0.95rem", opacity: 0.9 }}>
                  Designed for students, freshers, and working developers to practice, network,
                  and build a stronger technical portfolio through consistent activity.
                </p>
              </div>

              <div className="d-grid gap-3">
                <Link
                  to="/login"
                  className="btn fw-bold py-2"
                  style={{
                    borderRadius: "0.9rem",
                    color: "#03231f",
                    border: "none",
                    background: "linear-gradient(135deg, #5eead4 0%, #84cc16 100%)",
                    boxShadow: "0 10px 25px rgba(132, 204, 22, 0.28)",
                  }}
                >
                  Login As User
                </Link>

                <Link
                  to="/admin"
                  className="btn fw-bold py-2"
                  style={{
                    borderRadius: "0.9rem",
                    color: "#fff",
                    border: "1px solid rgba(251, 146, 60, 0.45)",
                    background: "linear-gradient(135deg, #7f1d1d 0%, #c2410c 100%)",
                    boxShadow: "0 10px 22px rgba(194, 65, 12, 0.32)",
                  }}
                >
                  Admin Login
                </Link>

                <Link
                  to="/signup"
                  className="btn fw-bold py-2"
                  style={{
                    borderRadius: "0.9rem",
                    color: "#e2e8f0",
                    border: "1px solid rgba(148, 163, 184, 0.35)",
                    background: "rgba(15, 23, 42, 0.6)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
                  }}
                >
                  Create An Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes landingDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 28px) scale(1.07); }
        }
      `}</style>
    </div>
  );
}

export default Landing;

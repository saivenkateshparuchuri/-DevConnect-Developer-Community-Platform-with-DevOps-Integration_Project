import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser, getCurrentUser } from "../services/api";

function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, meData] = await Promise.all([
        getAllUsers(),
        getCurrentUser()
      ]);
      setUsers(usersData);
      if (meData && meData.user) {
         setCurrentUser(meData.user);
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch developers network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent navigating to profile
    if (!window.confirm("Are you sure you want to permanently delete this user and all their posts?")) {
      return;
    }

    try {
      await deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert("Failed to delete user. Make sure you have Admin rights.");
    }
  };

  // Robust admin check for both legacy and new admin models
  const isAdmin = currentUser?.isAdmin === true || currentUser?.role === 'admin';

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
        <div>
          <h3 className="fw-bold m-0 text-dark">👤 Developers</h3>
          <p className="text-white-50 small mt-1 mb-0">Browse the community network.</p>
        </div>
        {isAdmin && <span className="badge bg-danger">Admin Mode Active</span>}
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {loading ? (
         <div className="text-center py-5">
           <div className="spinner-border text-primary" role="status"></div>
         </div>
      ) : (
        <div className="row g-3">
          {users
            .filter((u) => isAdmin || !u.isAdmin) // Hide admins if viewer is a normal user
            .map((u) => (
            <div className="col-md-4" key={u._id}>
              <div 
                className="card shadow-sm border-0 h-100 p-3 text-center rounded-3 hover-card position-relative"
                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                onClick={() => navigate(`/profile/${u._id}`)}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                {isAdmin && currentUser._id !== u._id && (
                  <button 
                    onClick={(e) => handleDelete(e, u._id)}
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle shadow"
                    title="Delete User"
                    style={{ width: "30px", height: "30px", padding: 0 }}
                  >
                    ×
                  </button>
                )}
                
                <div 
                  className={`${u.gender === 'female' ? 'bg-danger' : 'bg-primary'} text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm`}
                  style={{ width: "60px", height: "60px", fontSize: "1.5rem" }}
                >
                  {u.gender === 'female' ? '👩' : '👨'}
                </div>
                <h5 className="mb-0 fw-bold">{u.name}</h5>
                {u.isAdmin && <span className="badge bg-primary mt-1 mb-1">Admin</span>}
                <p className="text-muted small mb-0 mt-1 text-truncate px-2">{u.bio || "Member"}</p>
                
                <div className="mt-2 text-muted" style={{ fontSize: "0.75rem" }}>
                  Joined {new Date(u.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Users;
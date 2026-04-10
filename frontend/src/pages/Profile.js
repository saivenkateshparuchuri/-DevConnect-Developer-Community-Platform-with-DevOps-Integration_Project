import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";
import { getUserProfile, getCurrentUser, updateUserProfile, deleteUser } from "../services/api";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [me, setMe] = useState(null);
  
  // Edit form state
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editGender, setEditGender] = useState("male");
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const [profileData, meData] = await Promise.all([
         getUserProfile(id),
         getCurrentUser()
      ]);

      if (profileData.message) {
        setError(profileData.message);
      } else {
        setUser(profileData.user);
        setEditName(profileData.user.name);
        setEditBio(profileData.user.bio || "");
        setEditGender(profileData.user.gender || "male");

        if (meData && meData.user) {
          setMe(meData.user);
        }
        
        const populatedPosts = profileData.posts.map(p => ({
            ...p,
            user: profileData.user
        }));
        setPosts(populatedPosts);
      }
    } catch (err) {
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Pass the current user's ID to allow admins to edit others
      const res = await updateUserProfile({
        name: editName,
        bio: editBio,
        gender: editGender
      }, user._id); 

      if (res.user) {
        setUser(res.user);
        setIsEditing(false);
      }
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete ${user.name} and all their posts?`)) {
      return;
    }
    try {
      await deleteUser(user._id);
      alert("User deleted successfully.");
      navigate("/users");
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const isMyProfile = me && user && String(me._id) === String(user._id);
  const isAdmin = me && (me.isAdmin || me.role === 'admin');

  return (
    <Layout>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : user ? (
        <>
          <div className="card shadow-sm border-0 mb-5 rounded-4 overflow-hidden position-relative">
            {/* Show Edit Profile if it's my profile OR if I'm an admin */}
            {(isMyProfile || isAdmin) && !isEditing && (
              <div className="position-absolute top-0 end-0 m-3 d-flex gap-2" style={{ zIndex: 10 }}>
                <button 
                  className="btn btn-sm btn-light shadow-sm rounded-pill px-3 fw-bold"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit Profile
                </button>
                {isAdmin && !isMyProfile && (
                  <button 
                    className="btn btn-sm btn-danger shadow-sm rounded-pill px-3 fw-bold"
                    onClick={handleDelete}
                  >
                    🗑️ Delete User
                  </button>
                )}
              </div>
            )}
            
            <div className={`py-4 px-4 text-center text-white ${user.gender === "female" ? "bg-danger" : "bg-success"}`}>
              <div 
                className={`bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow ${user.gender === "female" ? "text-danger" : "text-success"}`} 
                style={{ width: "80px", height: "80px", fontSize: "3rem" }}
              >
                {user.gender === "female" ? "👩" : "👨"}
              </div>
              
              {!isEditing ? (
                 <>
                   <h2 className="mb-1 fw-bold">{user.name}</h2>
                   <p className="mb-0 opacity-75">{user.email}{user.isAdmin && <span className="ms-2 badge bg-white text-dark">Admin</span>}</p>
                 </>
              ) : (
                 <div className="container" style={{ maxWidth: "300px" }}>
                    <input 
                      className="form-control form-control-sm mb-2 text-center fw-bold" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your Name"
                    />
                    <select 
                      className="form-select form-select-sm text-center" 
                      value={editGender} 
                      onChange={(e) => setEditGender(e.target.value)}
                    >
                      <option value="male">Male (Avatar: 👨)</option>
                      <option value="female">Female (Avatar: 👩)</option>
                    </select>
                 </div>
              )}
            </div>

            <div className="card-body p-4 text-center">
              <h6 className="text-muted fw-bold mb-3 text-uppercase" style={{ letterSpacing: "1px" }}>About</h6>
              {!isEditing ? (
                 <p className="lead">{user.bio || `Hey! I am ${user.name} and I use Dev Community 🚀`}</p>
              ) : (
                <form onSubmit={handleUpdate}>
                   <textarea 
                     className="form-control mb-3" 
                     rows="3" 
                     value={editBio} 
                     onChange={(e) => setEditBio(e.target.value)}
                     placeholder="Tell the community about yourself..."
                   />
                   <div className="d-flex justify-content-center gap-2">
                     <button type="submit" disabled={saving} className="btn btn-primary rounded-pill px-4 shadow-sm">
                       {saving ? "Saving..." : "Save Changes"}
                     </button>
                     <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline-secondary rounded-pill px-4">
                       Cancel
                     </button>
                   </div>
                </form>
              )}
            </div>
          </div>

          <h4 className="fw-bold mb-4 border-bottom pb-2">Posts by {user.name}</h4>

          {posts.length === 0 ? (
            <div className="text-center py-5 text-muted bg-light rounded-4">
              <p className="mb-0">This user hasn't posted any questions yet.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-1">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onAnswerAdded={fetchProfile} />
              ))}
            </div>
          )}
        </>
      ) : null}
    </Layout>
  );
}

export default Profile;
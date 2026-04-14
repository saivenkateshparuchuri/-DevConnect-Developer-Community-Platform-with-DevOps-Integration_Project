import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Questions from "./pages/Questions";
import Tags from "./pages/Tags";
import Users from "./pages/Users";
import Articles from "./pages/Articles";
import Chat from "./pages/Chat";
import Companies from "./pages/Companies";
import AI from "./pages/AI";
import Challenges from "./pages/Challenges";
import ActiveChallenge from "./pages/ActiveChallenge";
import ChallengeResults from "./pages/ChallengeResults";
import { getCurrentUser } from "./services/api";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

function ProfileRedirect() {
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCurrentUser().then((data) => {
      if (!active) return;
      if (data && data.user && data.user._id) {
        setProfileId(data.user._id);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { active = false; };
  }, []);

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  return profileId ? <Navigate replace to={`/profile/${profileId}`} /> : <div className="text-center py-5 text-danger">Unable to resolve profile.</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route path="/home" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute><ProfileRedirect /></ProtectedRoute>
        } />
        <Route path="/profile/:id" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        <Route path="/questions" element={
          <ProtectedRoute><Questions /></ProtectedRoute>
        } />

        <Route path="/tags" element={
          <ProtectedRoute><Tags /></ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute><Users /></ProtectedRoute>
        } />

        <Route path="/articles" element={
          <ProtectedRoute><Articles /></ProtectedRoute>
        } />

        <Route path="/chat" element={
          <ProtectedRoute><Chat /></ProtectedRoute>
        } />

        <Route path="/companies" element={
          <ProtectedRoute><Companies /></ProtectedRoute>
        } />

        <Route path="/ai" element={
          <ProtectedRoute><AI /></ProtectedRoute>
        } />

        <Route path="/challenges" element={
          <ProtectedRoute><Challenges /></ProtectedRoute>
        } />
        <Route path="/challenges/:id/view" element={
          <ProtectedRoute><ActiveChallenge /></ProtectedRoute>
        } />
        <Route path="/challenges/:id/results" element={
          <ProtectedRoute><ChallengeResults /></ProtectedRoute>
        } />
        
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
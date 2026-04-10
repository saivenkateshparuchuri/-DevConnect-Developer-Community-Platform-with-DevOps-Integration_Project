import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
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

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Protected */}
        <Route path="/home" element={
          <ProtectedRoute><Home /></ProtectedRoute>
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
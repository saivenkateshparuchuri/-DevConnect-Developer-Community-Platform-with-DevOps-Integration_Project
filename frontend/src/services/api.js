const BASE_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : "https://devconnect-developer-community-platform.onrender.com/api";


export const login = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const signup = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getPosts = async () => {
  const res = await fetch(`${BASE_URL}/posts`);
  return res.json();
};

export const createPost = async (data) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

export const addAnswer = async (postId, text) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/posts/${postId}/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ text })
  });
  return res.json();
};

export const getUserProfile = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`);
  return res.json();
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  if (!token) return null;
  const res = await fetch(`${BASE_URL}/protected`, {
    headers: { Authorization: token }
  });
  if (!res.ok) return null;
  return res.json();
};

export const getTopUsers = async () => {
  const res = await fetch(`${BASE_URL}/users/top`);
  if (!res.ok) return [];
  return res.json();
};

export const getAllUsers = async () => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/users/all`, {
    headers: { Authorization: token }
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const deleteUser = async (id) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: token }
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
};

export const getArticles = async () => {
  const res = await fetch(`${BASE_URL}/articles/all`);
  if (!res.ok) return [];
  return res.json();
};

export const getChallenges = async () => {
  const res = await fetch(`${BASE_URL}/challenges/all`);
  if (!res.ok) return [];
  return res.json();
};

export const getMessages = async (userId) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/messages/${userId}`, {
    headers: { Authorization: token }
  });
  if (!res.ok) return [];
  return res.json();
};

export const getConversations = async () => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/messages/conversations`, {
    headers: { Authorization: token }
  });
  if (!res.ok) return {};
  return res.json();
};

export const askAI = async (prompt) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to get AI response");
  }

  return res.json();
};

export const sendMessage = async (receiverId, text) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ receiverId, text })
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
};

export const updateUserProfile = async (data, id = null) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

  if (data instanceof FormData) {
    if (id) data.append("targetId", id);
    const res = await fetch(`${BASE_URL}/users/update`, {
      method: "PUT",
      headers: {
        Authorization: token
      },
      body: data
    });
    return res.json();
  }

  const payload = { ...data };
  if (id) payload.targetId = id;

  const res = await fetch(`${BASE_URL}/users/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(payload)
  });
  return res.json();
};

// Admin API functions
export const adminLogin = async (email, password) => {
  const res = await fetch(`${BASE_URL}/admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const adminGetMe = async (adminToken) => {
  const res = await fetch(`${BASE_URL}/admin/auth/me`, {
    headers: { 'x-admin-auth-token': adminToken }
  });
  return res.json();
};

export const adminDeleteUser = async (userId, adminToken) => {
  const res = await fetch(`${BASE_URL}/admin/auth/users/${userId}`, {
    method: "DELETE",
    headers: { 'x-admin-auth-token': adminToken }
  });
  return res.json();
};

export const adminDeletePost = async (postId, adminToken) => {
  const res = await fetch(`${BASE_URL}/admin/auth/posts/${postId}`, {
    method: "DELETE",
    headers: { 'x-admin-auth-token': adminToken }
  });
  return res.json();
};
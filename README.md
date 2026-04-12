# 🚀 DevConnect: Developer Community Platform

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that enables developers to collaborate, share knowledge, and engage in discussions through posts and comments.

This repository is maintained as a personal project by **Paruchuri Sai Venkatesh**.

---

## 🌐 Live Demo
🔗 Frontend - https://dev-connect-developer-community-pla-seven.vercel.app/
🔗 Backend - https://devconnect-developer-community-platform.onrender.com

---

## ✨ Features
- 🔐 **Secure Authentication** – JWT-based login and signup
- 📝 **Post Management** – Create, view, and delete posts
- 💬 **Comment System** – Engage in discussions
- 👤 **User Profiles** – Protected routes and personalized experience
- ⚡ **Responsive UI** – Optimized for desktop and mobile devices
- 🌍 **Cloud Deployment** – Frontend on Vercel, backend on Render, database on MongoDB Atlas

---

## 🛠️ Tech Stack

### Frontend
- React.js
- CSS
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Atlas)

### Authentication
- JSON Web Tokens (JWT)

---

## 🏗️ Architecture

Frontend (React - Vercel) --> Backend (Node.js + Express - Render) --> MongoDB Atlas


---

## 📂 Project Structure

### Backend

backend/
│── server.js
│── config/
│── models/
│── routes/
│── controllers/
│── middleware/


### Frontend

frontend/
│── src/
│── components/
│── pages/
│── services/

---

## ⚙️ Installation & Setup


### 1️⃣ Clone the Repository
```bash
git clone https://github.com/saivenkateshparuchuri/-DevConnect-Developer-Community-Platform-with-DevOps-Integration_Project.git
cd Developer_community_project_2-main


2️⃣ Setup Backend

cd backend
npm install
npm start


3️⃣ Setup Frontend

cd frontend
npm install
npm start


🔐 Environment Variables

Create a .env file in the backend folder:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


📡 API Endpoints

Authentication

Method	Endpoint	        Description
POST	/api/auth/signup	Register a new user
POST	/api/auth/login	        Authenticate user

Posts

Method	        Endpoint	        Description
GET	        /api/posts	        Get all posts
POST	        /api/posts	        Create a post
GET	        /api/posts/:id	        Get a specific post
DELETE	        /api/posts/:id	        Delete a post

Comments

Method	        Endpoint	        Description
POST	        /api/comments	        Add a comment
GET	        /api/comments/:postId	Get comments for a post


🚀 Deployment

Frontend: Vercel
Backend: Render
Database: MongoDB Atlas

🚀 Future Enhancements

🔔 Real-time notifications
👍 Like/Upvote system
🔍 Advanced search & filters
🤖 AI-based recommendations
🏆 Gamification (badges & leaderboard)

🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

📧 Contact

Name : Paruchuri Sai Venkatesh
📩 Email: saivenkateshparuchuri2004@gmail.com
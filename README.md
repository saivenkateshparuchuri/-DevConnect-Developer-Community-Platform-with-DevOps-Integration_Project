# 🚀 DevConnect: Developer Community Platform with DevOps Integration

A full-stack **MERN** application that enables developers to collaborate, share knowledge, and engage in discussions through posts and comments.

This repository has been reset and configured as a personal project by Paruchuri Sai Venkatesh.

---

## 🌐 Live Demo

* 🔗 Frontend: https://dev-connect-developer-community-pla.vercel.app
* ⚙️ Backend API: https://devconnect-backend-unvl.onrender.com

---

## ✨ Features

* 🔐 Secure Authentication (JWT-based login & signup)
* 📝 Create, view, and delete posts
* 💬 Comment system for discussions
* 👤 User profiles and protected routes
* ⚡ Responsive UI with smooth UX
* 🌍 Fully deployed (Vercel + Render)

---

## 🛠️ Tech Stack

### Frontend

* React.js
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* JSON Web Tokens (JWT)

---

## 🏗️ Architecture

```text
Frontend (React - Vercel)
        ↓
Backend (Node.js + Express - Render)
        ↓
MongoDB Database
```

---

## 📂 Project Structure

### Backend

```
backend/
│── server.js
│── config/
│── models/
│── routes/
│── controllers/
│── middleware/
```

### Frontend

```
frontend/
│── src/
│── components/
│── pages/
│── services/
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/saivenkateshparuchuri/-DevConnect-Developer-Community-Platform-with-DevOps-Integration_Project.git
cd Developer_community_project_2-main
```

---

### 2️⃣ Setup Backend

```
cd backend
npm install
npm start
```

---

### 3️⃣ Setup Frontend

```
cd frontend
npm install
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file in the **backend** folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 📡 API Endpoints

### Auth

* POST `/api/auth/signup`
* POST `/api/auth/login`

### Posts

* GET `/api/posts`
* POST `/api/posts`
* GET `/api/posts/:id`
* DELETE `/api/posts/:id`

### Comments

* POST `/api/comments`
* GET `/api/comments/:postId`

---

## 🚀 Deployment

* Frontend deployed on **Vercel**
* Backend deployed on **Render**
* Database hosted on **MongoDB Atlas**

---

## 🚀 Future Enhancements

* 🔔 Real-time notifications
* 👍 Like/Upvote system
* 🔍 Advanced search & filters
* 🤖 AI-based recommendations
* 🏆 Gamification (badges & leaderboard)

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repo and submit a pull request.

---

## 📧 Contact

For collaboration or queries:
📩 [saivenkateshparuchuri2004@gmail.com](mailto:saivenkateshparuchuri2004@gmail.com)

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

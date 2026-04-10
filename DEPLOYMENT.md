# 🚀 DevConnect Deployment Guide

## Prerequisites
- GitHub repository pushed: ✅ https://github.com/saivenkateshparuchuri/-DevConnect-Developer-Community-Platform-with-DevOps-Integration_Project.git
- MongoDB Atlas cluster ready: ✅
- `.env` file configured with credentials: ✅

---

## Phase 1: Backend Deployment (Render)

### 1️⃣ Create Render Account
- Go to https://render.com
- Sign up using GitHub (recommended for easy integration)

### 2️⃣ Deploy Backend Service
1. Click **New +** button (top right)
2. Select **Web Service**
3. Select your GitHub repository
4. Fill in the following:
   - **Name**: `devconnect-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (select Free tier)

### 3️⃣ Add Environment Variables
In the Render dashboard, add these variables using your Atlas connection details:
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database-name>?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_here
```

### 4️⃣ Deploy
- Click **Create Web Service**
- Wait 3-5 minutes for deployment to complete
- Copy the generated URL (e.g., `https://devconnect-backend.onrender.com`)

### 5️⃣ Test Backend
```bash
curl https://devconnect-backend.onrender.com/api/auth/login
```

---

## Phase 2: Update CORS (Backend)

Once you have the Vercel frontend URL, update `backend/server.js`:

Find this section (around line 15):
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://developer-community-project-2-la7x.vercel.app'
];
```

Replace with your new Vercel URL:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://YOUR_VERCEL_FRONTEND_URL.vercel.app'
];
```

Then commit and push:
```bash
git add backend/server.js
git commit -m "Update CORS allowed origins for production"
git push
```

The backend will auto-redeploy on Render.

---

## Phase 3: Frontend Deployment (Vercel)

### 1️⃣ Create Vercel Account
- Go to https://vercel.com
- Sign up using GitHub (recommended)

### 2️⃣ Import Project
1. Click **Import Project**
2. Select your GitHub repository
3. Vercel will auto-detect it's a React app

### 3️⃣ Configure Build
- **Framework Preset**: React
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 4️⃣ Add Environment Variable
Click **Environment Variables** and add:
```
REACT_APP_API_URL=https://YOUR_RENDER_BACKEND_URL.onrender.com
```

Replace `YOUR_RENDER_BACKEND_URL` with your actual Render backend URL.

### 5️⃣ Deploy
- Click **Deploy**
- Wait 2-3 minutes
- Copy your Vercel frontend URL

---

## Phase 4: Final Testing

### Test Backend
```bash
curl https://YOUR_BACKEND_URL/api/auth/login
```

### Test Frontend
- Open your Vercel URL in browser
- Try logging in/signing up
- Check browser console (F12) for any errors

### If CORS errors occur:
1. Check backend logs on Render
2. Verify Vercel URL is in `backend/server.js` allowed origins
3. Commit changes and wait for auto-redeploy (2-3 min on Render)

---

## Phase 5: Update README

Once both are deployed, update `README.md`:

```markdown
## 🌐 Live Demo

* 🔗 Frontend: https://YOUR_VERCEL_URL.vercel.app
* ⚙️ Backend API: https://YOUR_RENDER_URL.onrender.com
```

Then:
```bash
git add README.md
git commit -m "Update deployment URLs"
git push
```

---

## 🔒 Security Notes

**For Production:**
1. Change `JWT_SECRET` to a random string
2. Restrict MongoDB IP whitelist (not allow-anywhere)
3. Use environment-specific domains only in CORS
4. Set `NODE_ENV=production` on both services

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Update `backend/server.js` with frontend URL and redeploy |
| 502 Bad Gateway | Check Render logs - usually build/start command error |
| MongoDB connection fails | Verify credentials in `.env` and MongoDB Atlas whitelist |
| Frontend doesn't load | Check `.env` in `frontend/` - verify `REACT_APP_API_URL` |

---

**All set! Follow these steps in order and your app will be live.** 🎉

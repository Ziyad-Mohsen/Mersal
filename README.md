# 🌍 Mersal - MERN Social Media Platform

**Mersal - مرسال** is a modern full-stack social media web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to connect, share posts, edit profiles, and switch between multiple languages including Arabic and English.

---

## 🚀 Features

- 🔐 JWT-based Authentication (Login, Signup, Logout)
- 📝 Create, Like, and Delete Posts
- 🧑‍💼 User Profiles (Edit, View)
- 🌗 Dark/Light Mode Toggle
- 🌐 Multilingual Support (Arabic & English)
- ⚙️ Responsive Design for Mobile & Desktop
- 📦 Protected Routes
- ☁️ Deployment-ready (Frontend: Vercel, Backend: Railway)

---

## 🛠️ Tech Stack

### Frontend:

- React.js
- vite
- Tailwind CSS
- React Router
- i18next (Internationalization)
- Axios
- Zustand (state management)

### Backend:

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- CORS & Cookie Parser

---

## 📁 Folder Structure

```
client/         # React frontend
server/         # Express backend
README.md
```

---

## ⚙️ Environment Variables

### Frontend (`client/.env`)

```
VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
```

### Backend (`server/.env`)

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://your-vercel-client-url.vercel.app
```

> **Note:** Never commit real secrets to your repository.

---

## 🚀 Deployment

### Frontend (Vercel)

1. Push your React app to GitHub.
2. Import the repo in [Vercel](https://vercel.com/).
3. Deploy!

### Backend (Railway)

1. Push your backend to GitHub.
2. Import the repo in [Railway](https://railway.app/).
3. Set all backend environment variables in Railway dashboard.
4. Deploy!

---

## 📡 API Overview

### Authentication

- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout

### Users

- `GET /api/users/:id` — Get user profile
- `PUT /api/users/:id` — Update profile (auth required)
- `DELETE /api/users/:id` — Delete profile (auth required)
- `GET /api/users/:id/followers` — List followers
- `GET /api/users/:id/following` — List following
- `POST /api/users/:id/follow` — Follow a user (auth required)
- `POST /api/users/:id/unfollow` — Unfollow a user (auth required)

### Posts

- `GET /api/posts` — List all posts
- `GET /api/posts/following` — List posts from followed users
- `POST /api/posts` — Create a post (auth required)
- `DELETE /api/posts/:id` — Delete a post (auth required)
- `POST /api/posts/:id/like` — Like/unlike a post (auth required)

---

## 🙏 Credits

Built with ❤️ by me
Inspired by real-world social platforms, localized for the MENA region.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

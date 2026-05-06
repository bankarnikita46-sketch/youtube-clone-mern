# YouTube Clone — MERN Stack Capstone Project

A full-stack YouTube clone built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication, video uploads, channels, comments, likes/dislikes, search & category filters, and a responsive dark YouTube-style UI.

## ✨ Features

- 🔐 **JWT Authentication** — Register, Login, Logout, Protected Routes
- 🏠 **Home Page** — Responsive video grid, category filters, search bar, hamburger menu, toggleable sidebar
- ▶️ **Video Player Page** — Embedded player, like/dislike, views, full comment CRUD
- 📺 **Channel Page** — Create channel, upload/edit/delete videos, banner, subscribers
- 💬 **Comments CRUD** — Add, edit, delete, fetch dynamically
- 🔍 **Search & Filter** — By title and 10+ categories
- 🎨 **Modern Dark Theme** — YouTube-style UI with Tailwind CSS
- 📱 **Fully Responsive** — Mobile, Tablet, Desktop
- 🔔 **Toast Notifications**, ⏳ **Loading Spinners**, **Empty States**

## 🛠️ Tech Stack

**Frontend:** React 18 + Vite, React Router DOM v6, Tailwind CSS, Axios, React Hot Toast, Lucide Icons
**Backend:** Node.js, Express.js (ES Modules), MongoDB Atlas, Mongoose, JWT, bcryptjs, CORS, dotenv

## 📁 Project Structure

```
youtube-clone/
├── backend/
│   ├── config/db.js
│   ├── controllers/   (auth, video, channel, comment)
│   ├── middleware/    (authMiddleware, errorHandler)
│   ├── models/        (User, Video, Channel, Comment)
│   ├── routes/        (auth, video, channel, comment)
│   ├── utils/generateToken.js
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/  (Header, Sidebar, VideoCard, CategoryFilter, ...)
    │   ├── pages/       (Home, Login, Register, VideoPlayer, Channel)
    │   ├── context/     (AuthContext)
    │   ├── services/    (api.js)
    │   ├── hooks/
    │   └── App.jsx
    └── vite.config.js
```

## 🚀 Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env   # then edit values

# Frontend
cd ../frontend
npm install
```

### 2. Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/youtube-clone
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open http://localhost:5173

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login user |
| GET | `/me` | Get current user (protected) |

### Videos (`/api/videos`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all videos (supports `?search=` & `?category=`) |
| GET | `/:id` | Get single video |
| POST | `/` | Upload new video (protected) |
| PUT | `/:id` | Update video (protected, owner) |
| DELETE | `/:id` | Delete video (protected, owner) |
| PUT | `/:id/like` | Like video (protected) |
| PUT | `/:id/dislike` | Dislike video (protected) |

### Channels (`/api/channels`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create channel (protected) |
| GET | `/:id` | Get channel + videos |
| PUT | `/:id` | Update channel (protected, owner) |

### Comments (`/api/comments`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:videoId` | Get comments for a video |
| POST | `/:videoId` | Add comment (protected) |
| PUT | `/:commentId` | Edit comment (protected, owner) |
| DELETE | `/:commentId` | Delete comment (protected, owner) |

## 🚢 Deployment

- **Backend:** Render / Railway / Heroku — set env vars from `.env.example`
- **Frontend:** Vercel / Netlify — set `VITE_API_URL` to your deployed backend URL
- **Database:** MongoDB Atlas (whitelist 0.0.0.0/0 or your provider IPs)

## 📸 Screenshots

_Add screenshots of Home, Video Player, Channel, Login pages here._

## 📄 License
MIT

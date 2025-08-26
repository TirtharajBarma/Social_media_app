# 🌟 Chattrix - Social Media Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- [Clerk](https://clerk.com) account
- [ImageKit](https://imagekit.io) account

### 1. Clone & Install
```bash
git clone https://github.com/TirtharajBarma/Social_media_app.git
cd social_media

# Install backend
cd server && npm install

# Install frontend
cd ../client && npm install
```

### 2. Environment Setup

**Server (.env):**
```env
MONGO_URL=mongodb://localhost:27017/chattrix
CLERK_SECRET_KEY=sk_test_...
IMAGEKIT_PRIVATE_KEY=private_...
IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

**Client (.env):**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_BASE_URL=http://localhost:4000
```

### 3. Run Application
```bash
# Terminal 1 - Backend (port 4000)
cd server && npm run dev

# Terminal 2 - Frontend (port 5173)
cd client && npm run dev
```

Visit: http://localhost:5173

## 🏗️ Architecture

```
┌─────────────────┐    HTTP + SSE    ┌─────────────────┐
│   React Client  │ ◄─────────────► │  Express Server │
│                 │                  │                 │
│ • Redux Store   │                  │ • MongoDB       │
│ • Tailwind CSS  │                  │ • ImageKit CDN  │
│ • Clerk Auth    │                  │ • Real-time SSE │
└─────────────────┘                  └─────────────────┘
```

## 📱 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Auth** | Clerk OAuth + JWT tokens |
| 📝 **Posts** | Text + images, hashtags, likes |
| 📱 **Stories** | 24hr auto-delete, text/image/video |
| 💬 **Messages** | Real-time chat via Server-Sent Events |
| 🤝 **Network** | Follow users + LinkedIn-style connections |
| 🖼️ **Media** | ImageKit optimization + global CDN |

## � Data Flow

### Real-time Messaging
```
User A sends message
       ↓
Express API saves to MongoDB
       ↓
Server-Sent Events pushes to User B
       ↓
React UI updates instantly
```

### Story Lifecycle
```
Create Story → Store in MongoDB → Display 24hrs → Auto-delete (Inngest job)
```

## �️ Tech Stack

**Frontend:** React 19 + Redux + Tailwind + Vite  
**Backend:** Node.js + Express + MongoDB + Mongoose  
**Real-time:** Server-Sent Events (not WebSocket)  
**Auth:** Clerk  
**Storage:** ImageKit CDN  
**Jobs:** Inngest (background tasks)

## � Project Structure

```
social_media/
├── client/          # React frontend
│   ├── src/pages/   # Main pages (Feed, Profile, Messages)
│   ├── src/components/ # UI components
│   └── src/features/   # Redux slices
└── server/          # Node.js backend
    ├── routes/      # API endpoints
    ├── models/      # MongoDB schemas
    └── controllers/ # Business logic
```

## 🚀 Deployment

**Quick Deploy on Vercel:**
```bash
# Backend
cd server && npx vercel

# Frontend  
cd client && npx vercel
```

Update environment variables in Vercel dashboard.

## � Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Check `FRONTEND_URL` in server `.env` |
| Images not loading | Verify ImageKit credentials |
| Auth not working | Check Clerk keys match |
| Messages not real-time | Ensure SSE endpoint is accessible |

## 📞 Support

- 🐛 **Issues:** Create GitHub issue
- 📖 **Docs:** Check `/client/README.md` and `/server/README.md`
- 💡 **Ideas:** Open GitHub discussion

---

**Made with ❤️ | React + Node.js + MongoDB**

# DigiBookEdu - Immersive E-Learning Platform

DigiBookEdu is a premium, immersive digital learning platform designed to streamline course registration, study progression, news broadcasts, and student evaluation. The system incorporates real-time tracking, 3D animated course headers, interactive role portals, and a robust administrative control deck.

**Copyright (c) 2026 Priyanshu Priyesh. All Rights Reserved.**

---

## 🚀 Key Features

1. **Robust Authentication:** Secure JWT-based registration and login system with auto-assigned role permissions (`student`, `teacher`, `admin`).
2. **Interactive Portals:**
   - **Student Portal:** Detailed workspace to track completed modules, review report cards, schedule timetable live sessions, customize registry avatars, and download verified graduation credentials.
   - **Teacher Portal:** Interface to schedule classes, post newsletters, publish courses, and evaluate students (remarks, percent completes, grades).
   - **Admin Control Deck:** Command dashboard with aggregate statistics to delete accounts, change roles, moderate catalog listings, delete posts, and view activity logs.
3. **User Activity Logging Console:** A backend system recording all page navigations, click redirects (such as WhatsApp queries or call triggers), authentication events, and moderation overrides inside a persistent log (`backend/activity.log`).
4. **Vibrant Modern UI:** Dark-mode glassmorphic styling, smooth GSAP responsive animations, custom font pairing (Inter), and clean micro-interactions.

---

## 🛠️ Repository Architecture

- `/frontend` - Vite-based Single Page Application (React, TailwindCSS, GSAP, React-Three-Fiber).
- `/backend` - Express REST API (NodeJS, JWT authentication, SQLite, persistent file logger).

---

## ⚙️ Running Locally

### Prerequisites
- NodeJS (v18+)

### Step-by-Step Launch
1. Clone the repository to your local directory.
2. In the root directory, install all required dependencies:
   ```bash
   # Install backend dependencies
   npm install --prefix backend

   # Install frontend dependencies
   npm install --prefix frontend
   ```
3. Run the development environment:
   ```bash
   npm run dev
   ```
   *The script triggers both the Vite frontend (usually on port 5173) and the Node API (on port 5000) concurrently.*

---

## 🔑 Seeding Credentials (Default Testing Accounts)

On the first backend start, a persistent SQLite database is auto-created (`backend/database.sqlite`) and seeded with default mock records:

- **Administrator:**
  - **Email:** `priyanshupriyesh@gmail.com`
  - **Password:** `Shub@140404`
- **Instructor:**
  - **Email:** `teacher@digibookedu.com`
  - **Password:** `password123`
- **Student:**
  - **Email:** `student@digibookedu.com`
  - **Password:** `password123`

---

## ☁️ Deployment Instructions

### 1. Frontend Hosting (Vercel)
The client application is pre-configured for instant Vercel deployment:
- **Root Directory:** Choose `frontend` in the Vercel dashboard.
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Configuration (`vercel.json`):** Pre-configured with clean cleanUrls and SPA routing rewrites to ensure subpages (like `/blogs`) resolve smoothly without 404 errors.

### 2. Backend Hosting (Render, Railway, VPS)
Because the backend requires a persistent SQLite database write-access, deploying to serverless environments (like standard Vercel serverless functions) will cause database writes to be reset on cold starts. We recommend:
- Hosting on **Render.com** (as a Web Service) or **Railway.app** with a persistent disk volume.
- Setting the environment variable `PORT` to the listening port.
- In `frontend/src/context/AppContext.jsx`, update the dynamic endpoint to point to your live hosted API URL when building for production.

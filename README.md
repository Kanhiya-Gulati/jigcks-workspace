<div align="center">

# 🚀 Jigcks Workspace — Enterprise MERN Project & Task Management System

[![Live Demo](https://img.shields.io/badge/Live_Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://jigcks-workspace.netlify.app/)
[![Backend API](https://img.shields.io/badge/Backend_API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://jigcks-workspace.onrender.com)
[![React](https://img.shields.io/badge/Frontend-React_18_|_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![NodeJS](https://img.shields.io/badge/Backend-Node.js_|_Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

A state-of-the-art, ultra-responsive **MERN Stack Project Management & Freelancer Workspace Tool** featuring real-time task discussions, single-session token security, audit trail logging, interactive Gantt timeline views, deadline alerts, and 1-click CSV/PDF exports.

[🌐 View Live Application](https://jigcks-workspace.netlify.app/) · [🐞 Report Bug](https://github.com/Kanhiya-Gulati/jigcks-workspace/issues) · [✨ Request Feature](https://github.com/Kanhiya-Gulati/jigcks-workspace/issues)

</div>

---

## 🌟 Key Features & Highlights

### 🔐 1. Single-Session Token Security (Anti-Concurrent Login)
- Custom JWT authentication with dynamic `crypto.randomUUID()` session tokens.
- Automatic multi-device token validation. Logging in on a new browser immediately logs out prior sessions with a security alert.

### 📱 2. Premium Responsive Glassmorphism UI
- Designed with vibrant dark mode aesthetics, dynamic HSL gradients, and glassmorphism panels.
- 100% Mobile Responsive with custom sliding navigation drawer and mobile task card view.

### 📜 3. Real-Time Activity Log & Audit Trail
- Comprehensive event logging tracking task creations, status updates, reassignments, comments, and deletions.
- Dedicated **Audit Trail** timeline with user avatars, roles, badges, and relative timestamps (*Just now*, *5m ago*).

### 💬 4. Micro-Task Discussion & Commenting System
- Task-level discussion drawer with live comment posting and deletion.
- **Title Badges**: Glowing purple pill chips (`💬 2 comments`) beside task names + glowing row border highlight for active discussions.
- **Scoped Permissions**: Freelancers can post on assigned/unassigned tasks while viewing all other task notes in Read-Only mode.

### 📥 5. 1-Click Checklist Export (CSV / Excel & Printable PDF)
- **Export CSV**: Instant client-side generation of structured Excel-compatible `.csv` reports containing all tasks, assignees, priorities, and files.
- **Print / PDF**: Custom `@media print` layout formatting clean printable reports directly from the browser.

### 🔔 6. Notification Center & Deadline Alerts
- Real-time notification drawer with unread count badges.
- Instant notifications when comments or updates are posted by team members or Admins.
- Includes 1-Click **Clear All** and individual trash icon cleanup.

### 📊 7. Interactive Gantt Schedule Timeline View
- Visual Phase Progress Gantt chart displaying phase completion percentages, assigned team members, assigned dates, and deadlines.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | React 18, Vite 8, Vanilla CSS3 (Glassmorphism & Gradients), React Icons, React Router DOM v6 |
| **Backend API** | Node.js, Express.js, JSON Web Tokens (JWT), Crypto UUID, CORS |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Deployment** | Netlify (Frontend SPA), Render (Backend Express Web Service) |

---

## 🌐 Live Application Link

Access the live application here: **[https://jigcks-workspace.netlify.app/](https://jigcks-workspace.netlify.app/)**

---

## 💻 Local Development & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### 1. Clone Repository
```bash
git clone https://github.com/Kanhiya-Gulati/jigcks-workspace.git
cd jigcks-workspace
```

### 2. Configure Backend Server
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend dev server:
```bash
npm run dev
# Server running on http://localhost:5000
```

### 3. Configure Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
# App running on http://localhost:3000
```

---

## 📁 Repository Directory Structure

```text
jigcks-workspace/
├── client/                     # React Frontend Application
│   ├── public/                 # Static assets & Netlify _redirects
│   ├── src/
│   │   ├── components/         # Navbar, ProjectCard, Modals
│   │   ├── context/            # AuthContext (Security & Heartbeat)
│   │   ├── pages/              # Dashboard, ProjectDetail, ManageTeam, Login
│   │   ├── services/           # Axios API Interceptors & Endpoints
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js Express Backend API
│   ├── config/                 # MongoDB Connection
│   ├── middleware/             # Single-Session Auth Middleware
│   ├── models/                 # Mongoose Schemas (User, Project, Task, Comment, Activity, Notification)
│   ├── routes/                 # Express REST Endpoints
│   ├── server.js
│   └── package.json
├── README.md                   # Project Documentation
└── .gitignore
```

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ for Jigcks Workspace Team</sub>
</div>

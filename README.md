# 🔧 GGComms Backend

**GGComms** is a real-time communication platform that supports user-to-user messaging, friend management, and **community servers** with **text and voice channels**. This backend provides the core API, real-time socket handling, and database integration to power all features of the platform.

Built with **Node.js**, **Express**, **MongoDB**, and **Socket.IO**, it focuses on scalability, modular design, and real-time performance.

---

## 🚀 Features

### 👤 User Authentication
- Secure registration and login
- Password hashing with **bcrypt**
- Token-based authentication (JWT)
- Protected routes with middleware

### 👥 Friends System
- Send and receive friend requests
- Accept or reject requests
- List of accepted friends
- Friend status (online/offline via socket)

### 💬 Direct Messaging
- Real-time private chat between friends
- Socket-based message exchange
- Automatic delivery updates
- In-memory messages (can be extended to persistent storage)

### 🏠 Servers, Text & Voice Channels
- Users can create or join **servers**
- Each server supports:
  - **Text channels** for group messaging
  - **Voice channels** with peer discovery
- Real-time join/leave notifications
- Room-based messaging and audio coordination via sockets

### 🌐 WebSocket Integration
- Real-time sync for all chat actions
- Active user tracking
- Server/channel updates broadcast instantly
- Scalable with custom socket event system

---

## ⚙️ Tech Stack

| Tech         | Purpose                              |
|--------------|--------------------------------------|
| Node.js      | Runtime environment                  |
| Express.js   | REST API framework                   |
| MongoDB      | NoSQL Database                       |
| Mongoose     | MongoDB ODM                          |
| Socket.IO    | Real-time bi-directional communication |
| JWT          | Authentication (Token-based)         |
| Bcrypt       | Password encryption                  |
| CORS         | Cross-Origin Requests Handling       |
| Dotenv       | Environment variable management      |

---

## 🗂️ Project Structure

server/
├── config/             # Database connection and app-wide configs
│   └── db.js
│
├── controllers/        # Route handler logic (auth, friends, servers, etc.)
│   ├── authController.js
│   ├── friendController.js
│   ├── messageController.js
│   └── serverController.js
│
├── middleware/         # Custom middleware (auth protection, error handling)
│   ├── authMiddleware.js
│   └── errorHandler.js
│
├── models/             # Mongoose schemas for all entities
│   ├── User.js
│   ├── FriendRequest.js
│   ├── Server.js
│   ├── Channel.js
│   └── Message.js
│
├── routes/             # Express route definitions
│   ├── authRoutes.js
│   ├── friendRoutes.js
│   ├── serverRoutes.js
│   └── index.js
│
├── sockets/            # All real-time socket event handling
│   └── socketHandler.js
│
├── utils/              # Utility functions and helpers
│   ├── generateToken.js
│   └── formatUser.js
│
├── .env                # Environment variables (not committed)
├── .gitignore          # Ignored files/folders
├── package.json        # Project metadata and scripts
├── index.js            # Entry point – initializes server and sockets
└── README.md           # Project documentation

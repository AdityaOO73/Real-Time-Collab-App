# 📄 Real-Time Collaboration App

A full-stack **real-time document collaboration platform** where multiple users can create, edit, and manage documents simultaneously with live updates.

---

## 🚀 Features

* 🔐 **JWT Authentication**

  * Secure login/signup system
  * Token-based authorization

* 📄 **Document Management**

  * Create new documents
  * Edit existing documents
  * Auto-save functionality

* ⚡ **Real-Time Collaboration**

  * Live updates using WebSockets
  * Multiple users can edit simultaneously

* 📊 **Dashboard**

  * View all documents
  * Dynamic document titles
  * Organized UI

* 🌐 **Responsive UI**

  * Works across all devices
  * Smooth user experience

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Redux Toolkit
* Axios

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Socket.IO

### Deployment

* Frontend: Netlify
* Backend: Render

---

## 📁 Folder Structure

project-root/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── redux/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── config/
│
├── .env
└── README.md

---

## ⚙️ Environment Variables

### Backend (.env)

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

---

## 🔧 Installation & Setup

### 1️⃣ Clone the repository

git clone https://github.com/your-username/Real-Time-Collab-App.git
cd Real-Time-Collab-App

---

### 2️⃣ Install dependencies

#### Frontend

cd frontend
npm install

#### Backend

cd backend
npm install

---

### 3️⃣ Run the project

#### Start backend

cd backend
npm run dev

#### Start frontend

cd frontend
npm run dev

---

## 🌍 Live Demo

* 🔗 Frontend: 
* 🔗 Backend: https://real-time-collab-app.onrender.com

---

## ⚠️ Known Issues

* MIME type issue on deployment
* White screen issue due to incorrect build/static config

---

## 🔮 Future Improvements

* 🧠 Rich text editor (like Google Docs)
* 👥 User presence tracking
* 📝 Version history
* 💬 Comments & chat system
* 📁 Folder-based document organization

---

## 📸 Screenshots

(Add screenshots here)

---

## 🤝 Contributing

Fork → Create Branch → Commit → Push → Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Aditya Roy

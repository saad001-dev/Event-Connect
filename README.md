# Event Connect

A modern web application to connect people with events, networking opportunities, and communities.

## 🚀 Features

- User Authentication (Login/Register)
- Create and Manage Events
- Networking Page for Professionals
- User Profiles
- Session Management
- Responsive Design

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Vite
- React Router
- CSS3

**State Management:**
- Zustand

**Other Tools:**
- Axios
- ESLint
- Git & GitHub

## 📁 Project Structure

```
eventconnect/
├── frontend/
│   ├── src/
│   │   ├── pages/          # All page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── SessionsPage.jsx
│   │   │   └── NetworkingPage.jsx
│   │   ├── store/          # Zustand state management
│   │   │   ├── auth.store.js
│   │   │   └── event.store.js
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx         # Main app component
│   │   ├── index.css       # Global styles
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   ├── .env                # Environment variables
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```
## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/saad001-dev/Event-Connect.git

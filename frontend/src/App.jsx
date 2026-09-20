import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/auth.store";
import Layout from "./components/common/Layout";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import SessionsPage from "./pages/SessionsPage";
import AgendaPage from "./pages/AgendaPage";
import NetworkingPage from "./pages/NetworkingPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

// ===== FIXED: Better PrivateRoute =====
function PrivateRoute({ children }) {
  const { user, isAuthenticated } = useAuthStore();

  // Check multiple sources for auth
  const isLoggedIn = user !== null && user !== undefined && user !== false;
  const hasLocalStorage =
    localStorage.getItem("user") !== null ||
    localStorage.getItem("token") !== null;
  const isAuth = isAuthenticated === true;

  // If any auth check passes, allow access
  if (isLoggedIn || hasLocalStorage || isAuth) {
    return children;
  }

  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:slug" element={<EventDetailPage />} />
        <Route path="events/:slug/sessions" element={<SessionsPage />} />

        <Route
          path="agenda"
          element={
            <PrivateRoute>
              <AgendaPage />
            </PrivateRoute>
          }
        />

        <Route
          path="networking"
          element={
            <PrivateRoute>
              <NetworkingPage />
            </PrivateRoute>
          }
        />

        {/* ===== PROFILE ROUTE - FIXED ===== */}
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

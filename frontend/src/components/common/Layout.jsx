import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import toast from "react-hot-toast";

// ===== PROFESSIONAL SVG ICONS - NO EMOJIS =====
const Icons = {
  // Logo Icon
  logo: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  ),
  // Dashboard
  dashboard: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  ),
  // Events
  events: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M8 7V3m8 4V3M4 10h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
    />
  ),
  // Agenda
  agenda: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />
  ),
  // Network
  network: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  ),
  // Bell
  bell: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.7}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  ),
  // Profile
  profile: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  ),
  // Logout
  logout: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  ),
  // Arrow down
  arrowDown: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  ),
  // Menu
  menu: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  ),
  // Close
  close: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  ),
  // Arrow Right
  arrowRight: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M5 12h14m-6-6l6 6-6 6"
    />
  ),
  // Arrow Left
  arrowLeft: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  ),
  // Location
  location: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
  ),
  // Users
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  ),
  // Calendar
  calendar: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M8 7V3m8 4V3M4 10h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
    />
  ),
  // Clock
  clock: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  // Speaker
  speaker: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  ),
  // Check
  check: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  ),
  // Sparkle / Star
  sparkle: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"
    />
  ),
  // Search
  search: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  ),
  // Refresh
  refresh: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M4 4v5h5M20 20v-5h-5M5.1 9A7.5 7.5 0 0118.5 6M18.9 15A7.5 7.5 0 015.5 18"
    />
  ),
  // Trash
  trash: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  ),
};

// ===== ICON COMPONENT =====
function Icon({ name, className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {Icons[name]}
    </svg>
  );
}

// ===== LAYOUT COMPONENT =====
function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    try {
      logout();
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
      setProfileDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate("/login", { replace: true });
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login", { replace: true });
    }
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { path: "/events", label: "Events", icon: "events" },
    { path: "/agenda", label: "Agenda", icon: "agenda" },
    { path: "/networking", label: "Network", icon: "network" },
  ];

  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ===== ANIMATED BACKGROUND - COMPLETELY REMOVED ===== */}
      {/* No glow effects, no orbs, no shine - Clean solid background */}

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group flex-shrink-0"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#667eea]/30 group-hover:scale-105 transition-transform duration-300">
              <Icon name="logo" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight hidden sm:inline">
              Event
              <span className="bg-gradient-to-r from-[#667eea] to-[#f093fb] bg-clip-text text-transparent">
                Connect
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? "active" : ""}`}
              >
                <Icon name={link.icon} className="w-4 h-4 mr-1.5" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Profile Dropdown */}
                <div
                  className="relative"
                  ref={dropdownRef}
                  style={{ position: "relative", overflow: "visible" }}
                >
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#667eea] to-[#f093fb] rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-lg shadow-[#667eea]/30">
                      {initials || "U"}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-white leading-tight">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-white/40">
                        {user.role || "Attendee"}
                      </p>
                    </div>
                    <Icon
                      name="arrowDown"
                      className={`w-4 h-4 text-white/40 transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "calc(100% + 8px)",
                        width: "240px",
                        background: "#1a1a2e",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                        boxShadow: "0 20px 60px -12px rgba(0,0,0,0.8)",
                        zIndex: 99999,
                        display: "block",
                        visibility: "visible",
                        opacity: 1,
                        pointerEvents: "auto",
                        overflow: "visible",
                      }}
                    >
                      {/* User Info */}
                      <div
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "12px",
                              background:
                                "linear-gradient(135deg, #667eea, #f093fb)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: "bold",
                              color: "white",
                              flexShrink: 0,
                            }}
                          >
                            {initials || "U"}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "white",
                              }}
                            >
                              {user.firstName} {user.lastName}
                            </p>
                            <p
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontSize: "12px",
                                color: "rgba(255,255,255,0.4)",
                              }}
                            >
                              {user.email}
                            </p>
                            <p
                              style={{
                                fontSize: "10px",
                                color: "#818cf8",
                                textTransform: "capitalize",
                              }}
                            >
                              {user.role || "Attendee"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div style={{ padding: "4px" }}>
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 12px",
                            borderRadius: "12px",
                            fontSize: "14px",
                            color: "rgba(255,255,255,0.6)",
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.05)";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color =
                              "rgba(255,255,255,0.6)";
                          }}
                        >
                          <Icon name="profile" className="w-4 h-4" />
                          My Profile
                        </Link>

                        <Link
                          to="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 12px",
                            borderRadius: "12px",
                            fontSize: "14px",
                            color: "rgba(255,255,255,0.6)",
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.05)";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color =
                              "rgba(255,255,255,0.6)";
                          }}
                        >
                          <Icon name="dashboard" className="w-4 h-4" />
                          Dashboard
                        </Link>

                        <Link
                          to="/agenda"
                          onClick={() => setProfileDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 12px",
                            borderRadius: "12px",
                            fontSize: "14px",
                            color: "rgba(255,255,255,0.6)",
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.05)";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color =
                              "rgba(255,255,255,0.6)";
                          }}
                        >
                          <Icon name="agenda" className="w-4 h-4" />
                          My Agenda
                        </Link>

                        <Link
                          to="/networking"
                          onClick={() => setProfileDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 12px",
                            borderRadius: "12px",
                            fontSize: "14px",
                            color: "rgba(255,255,255,0.6)",
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.05)";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color =
                              "rgba(255,255,255,0.6)";
                          }}
                        >
                          <Icon name="network" className="w-4 h-4" />
                          Network
                        </Link>
                      </div>

                      {/* Sign Out */}
                      <div
                        style={{
                          borderTop: "1px solid rgba(255,255,255,0.06)",
                          padding: "4px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={handleLogout}
                          style={{
                            display: "flex",
                            width: "100%",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 12px",
                            borderRadius: "12px",
                            fontSize: "14px",
                            color: "#f87171",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(239,68,68,0.08)";
                            e.currentTarget.style.color = "#fca5a5";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#f87171";
                          }}
                        >
                          <Icon name="logout" className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm text-white/60 hover:text-white transition px-4 py-2 rounded-xl hover:bg-white/5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-5 py-2.5"
                >
                  Get Started Free
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 animate-fadeInUp">
            <div className="max-w-7xl mx-auto flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive(link.path) ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon name={link.icon} className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
              {user && (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon name="profile" className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all w-full"
                  >
                    <Icon name="logout" className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#667eea] to-[#f093fb] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                  EC
                </div>
                <span className="text-lg font-bold text-white">
                  EventConnect
                </span>
              </div>
              <p className="text-white/30 text-sm leading-relaxed max-w-sm">
                The next-generation event networking platform that transforms
                how professionals connect, collaborate, and grow.
              </p>
            </div>
            <div>
              <h4 className="text-white/60 font-semibold text-sm mb-4">
                Product
              </h4>
              <ul className="footer-links">
                <li>
                  <a href="#" className="footer-link">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white/60 font-semibold text-sm mb-4">
                Company
              </h4>
              <ul className="footer-links">
                <li>
                  <a href="#" className="footer-link">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white/60 font-semibold text-sm mb-4">
                Support
              </h4>
              <ul className="footer-links">
                <li>
                  <a href="#" className="footer-link">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="text-white/20 text-sm">
              © 2026 EventConnect. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a
                href="#"
                className="text-white/20 hover:text-white/40 transition-colors text-sm"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-white/20 hover:text-white/40 transition-colors text-sm"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-white/20 hover:text-white/40 transition-colors text-sm"
              >
                Support
              </a>
              <a
                href="#"
                className="text-white/20 hover:text-white/40 transition-colors text-sm"
              >
                Status
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;

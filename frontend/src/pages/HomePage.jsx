import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

// ===== ICONS =====
const Icons = {
  arrowRight: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M5 12h14M12 5l7 7-7 7"
    />
  ),
  sparkle: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"
    />
  ),
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  ),
  calendar: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M8 7V3m8 4V3M4 10h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
    />
  ),
  star: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  ),
  check: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  ),
};

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

function HomePage() {
  const { user } = useAuthStore();

  const stats = [
    {
      icon: "calendar",
      number: "50+",
      label: "Events Hosted",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: "users",
      number: "10K+",
      label: "Active Users",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: "sparkle",
      number: "500+",
      label: "Connections",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: "star",
      number: "4.9",
      label: "User Rating",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  const features = [
    {
      icon: "📅",
      title: "Smart Scheduling",
      desc: "AI-powered agenda builder that optimizes your event experience.",
    },
    {
      icon: "🤝",
      title: "Intelligent Networking",
      desc: "Connect with the right people using smart matchmaking algorithms.",
    },
    {
      icon: "💳",
      title: "Digital Business Cards",
      desc: "Exchange contacts instantly with QR codes and digital profiles.",
    },
    {
      icon: "📊",
      title: "Real-time Analytics",
      desc: "Track engagement, attendance, and networking metrics live.",
    },
    {
      icon: "🔔",
      title: "Smart Notifications",
      desc: "Never miss a session with intelligent, context-aware alerts.",
    },
    {
      icon: "🌐",
      title: "Global Community",
      desc: "Connect with professionals from across the world at any event.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO, TechCorp",
      text: "EventConnect transformed how we host our annual conference. The networking features are unmatched!",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Event Director, GlobalSummit",
      text: "The agenda builder saved us countless hours. Our attendees love the personalized experience.",
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "VP Marketing, BrandWave",
      text: "The analytics dashboard gives us real insights into attendee engagement like never before.",
      avatar: "ER",
    },
  ];

  return (
    <div className="relative z-10 w-full overflow-x-hidden">
      {/* Animated Background Orbs */}
     

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          <span>v3.0 Enterprise</span> — Built for the future
        </div>
        <h1 className="hero-title">
          Where <span className="highlight">Connections</span>
          <br />
          Become <span className="highlight">Opportunities</span>
        </h1>
        <p className="hero-subtitle">
          The next-generation event networking platform that transforms how
          professionals connect, collaborate, and grow.
        </p>
        <div className="hero-actions">
          <Link to="/events" className="btn-primary btn-large">
            <span>Explore Events</span>
            <Icon name="arrowRight" className="w-5 h-5" />
          </Link>
          {!user ? (
            <Link to="/register" className="btn-secondary btn-large">
              Get Started Free
              <Icon name="arrowRight" className="w-5 h-5" />
            </Link>
          ) : (
            <Link to="/dashboard" className="btn-secondary btn-large">
              Go to Dashboard
              <Icon name="arrowRight" className="w-5 h-5" />
            </Link>
          )}
        </div>
        {/* Floating Elements */}
        <div className="floating-element floating-element-1"></div>
        <div className="floating-element floating-element-2"></div>
        <div className="floating-element floating-element-3"></div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <Icon
              name={stat.icon}
              className="w-8 h-8 text-indigo-400 mx-auto mb-3"
            />
            <div
              className={`stat-number bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
            >
              {stat.number}
            </div>
            <p className="stat-label">{stat.label}</p>
            <div className="stat-progress"></div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="features-section">
        <div className="section-header">
          <span className="section-tag">✨ Features</span>
          <h2 className="section-title">
            Enterprise-Grade <span className="highlight">Capabilities</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to build meaningful connections at scale
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">{feature.icon}</div>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
              <div className="feature-arrow">
                <Icon name="arrowRight" className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials-section">
        <div className="section-header">
          <span className="section-tag">💬 Testimonials</span>
          <h2 className="section-title">
            Loved by <span className="highlight">Professionals</span>
          </h2>
          <p className="section-subtitle">
            Hear what our users have to say about their experience
          </p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-footer">
                <div className="testimonial-avatar">{testimonial.avatar}</div>
                <div>
                  <p className="testimonial-name">{testimonial.name}</p>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, j) => (
                    <span key={j}>⭐</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div
        className="cta-section"
        style={{ marginTop: "5rem", marginBottom: "5rem" }}
      >
        <div className="cta-glow"></div>
        <div className="cta-content">
          <h2 className="cta-title">
            Ready to <span className="highlight">Transform</span> Your Events?
          </h2>
          <p className="cta-subtitle">
            Join thousands of professionals already using EventConnect
          </p>
          {!user ? (
            <Link to="/register" className="btn-primary btn-large btn-cta">
              Start Your Journey
              <Icon name="arrowRight" className="w-5 h-5" />
            </Link>
          ) : (
            <Link to="/events" className="btn-primary btn-large btn-cta">
              Explore Events
              <Icon name="arrowRight" className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

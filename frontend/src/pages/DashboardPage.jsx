import React from "react";
import { useAuthStore } from "../store/auth.store";
import { Link } from "react-router-dom";

const icons = {
  user: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
    />
  ),
  shield: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 3 4 6v6c0 4.5 3 7.5 8 9 5-1.5 8-4.5 8-9V6l-8-3Z"
    />
  ),
  mail: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M4 6h16v12H4V6Zm0 0 8 7 8-7"
    />
  ),
  calendar: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M8 7V3m8 4V3M4 10h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
    />
  ),
  list: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"
    />
  ),
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
    />
  ),
  settings: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
    />
  ),
  history: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M4 12a8 8 0 1 0 2.34-5.66M4 4v5h5M12 8v4l3 2"
    />
  ),
  arrowRight: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M5 12h14m-6-6 6 6-6 6"
    />
  ),
  sparkle: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"
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
      {icons[name]}
    </svg>
  );
}

function DashboardPage() {
  const { user } = useAuthStore();

  const stats = [
    {
      label: "Signed in as",
      value: `${user?.firstName || "Guest"} ${user?.lastName || ""}`.trim(),
      icon: "user",
    },
    { label: "Role", value: user?.role || "Attendee", icon: "shield" },
    { label: "Email", value: user?.email || "Not signed in", icon: "mail" },
  ];

  const quickActions = [
    {
      title: "Browse events",
      description: "Discover what's coming up",
      link: "/events",
      icon: "calendar",
    },
    {
      title: "My agenda",
      description: "View your scheduled sessions",
      link: "/agenda",
      icon: "list",
    },
    {
      title: "Network",
      description: "Connect with professionals",
      link: "/networking",
      icon: "users",
    },
    {
      title: "Profile",
      description: "Manage your account",
      link: "/profile",
      icon: "settings",
    },
  ];

  const activity = [
    {
      title: 'You joined "Tech Summit 2026"',
      time: "2 hours ago",
      icon: "calendar",
    },
    {
      title: "Connection request from Sarah Wilson",
      time: "4 hours ago",
      icon: "users",
    },
    {
      title: 'Added "AI Workshop" to your agenda',
      time: "1 day ago",
      icon: "list",
    },
  ];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    // 🔥 FIX: Proper vertical and horizontal padding
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      {/* Header - Increased bottom margin */}
      <div className="mb-12 sm:mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Your event workspace
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-4">
            Welcome back,{" "}
            <span className="text-indigo-400">
              {user?.firstName || "Guest"}
            </span>
          </h1>
          <p className="text-slate-400 mt-3 text-base max-w-lg leading-relaxed">
            Stay on top of your events, sessions and professional connections
            from one place.
          </p>
        </div>
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/5 bg-white/5 text-sm text-slate-400 whitespace-nowrap shrink-0">
          <Icon name="calendar" className="w-4 h-4" />
          {today}
        </div>
      </div>

      {/* Stats - Increased bottom margin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-2xl border border-white/5 bg-white/5 transition-colors hover:bg-white/[0.07]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Icon name={stat.icon} className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </p>
                <p className="text-base font-semibold mt-1 truncate">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions - Increased bottom margin */}
      <div className="mb-14">
        <h2 className="text-lg font-semibold mb-1.5">Quick actions</h2>
        <p className="text-sm text-slate-500 mb-6">
          Jump directly into your most important areas
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className="group p-7 rounded-2xl border border-white/5 bg-white/5 transition-all hover:bg-white/[0.08] hover:border-indigo-500/25"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                  <Icon name={action.icon} className="w-5 h-5" />
                </div>
                <Icon
                  name="arrowRight"
                  className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all"
                />
              </div>
              <h3 className="text-base font-semibold">{action.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Section - Increased bottom margin */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-14">
        {/* Recent Activity */}
        <div className="p-7 rounded-2xl border border-white/5 bg-white/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Recent activity</h2>
              <p className="text-sm text-slate-500 mt-1">Your latest actions</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
              <Icon name="history" className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-5">
            {activity.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 pb-5 border-b border-white/5 last:border-0 last:pb-0"
              >
                <div className="w-11 h-11 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                  <Icon name={item.icon} className="w-[18px] h-[18px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/70 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div className="p-7 rounded-2xl border border-white/5 bg-white/5">
          <h2 className="text-lg font-semibold">Upcoming</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Keep track of what's next
          </p>

          <div className="flex flex-col items-center justify-center min-h-[170px] p-7 rounded-xl border border-dashed border-white/10">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
              <Icon name="sparkle" className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-300">
              No upcoming events
            </p>
            <p className="text-xs text-slate-500 mt-2 text-center max-w-[210px] leading-relaxed">
              Explore events and start building your schedule.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-indigo-400 text-sm font-semibold mt-5 hover:text-indigo-300 transition-colors"
            >
              Browse events
              <Icon name="arrowRight" className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-5 rounded-xl border border-white/5 bg-white/5">
              <p className="text-2xl font-bold">0</p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mt-1.5">
                Events
              </p>
            </div>
            <div className="text-center p-5 rounded-xl border border-white/5 bg-white/5">
              <p className="text-2xl font-bold">0</p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mt-1.5">
                Connections
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-7 sm:p-9 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400">
            <Icon name="sparkle" className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Make your next move
            </span>
          </div>
          <h2 className="text-lg font-semibold mt-2.5">
            Ready to make meaningful connections?
          </h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Discover events, meet professionals and build your agenda.
          </p>
        </div>
        <Link
          to="/events"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-500 rounded-xl text-sm font-semibold text-white transition-all hover:bg-indigo-400 hover:shadow-lg hover:shadow-indigo-500/25 whitespace-nowrap shrink-0"
        >
          Explore events
          <Icon name="arrowRight" className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;

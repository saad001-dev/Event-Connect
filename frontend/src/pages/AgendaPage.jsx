import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEventStore } from "../store/event.store";
import { useAuthStore } from "../store/auth.store";
import { format } from "date-fns";
import toast from "react-hot-toast";

// ===== ICONS =====
const Icons = {
  calendar: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M8 7V3m8 4V3M4 10h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
    />
  ),
  clock: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  location: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
  ),
  speaker: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  ),
  trash: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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
  arrowRight: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M5 12h14m-6-6l6 6-6 6"
    />
  ),
  chevronRight: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M9 5l7 7-7 7"
    />
  ),
};

function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {Icons[name]}
    </svg>
  );
}

function AgendaPage() {
  const { currentEvent } = useEventStore();
  const { user } = useAuthStore();

  // ===== FIX: Direct localStorage se data uthayein (No API) =====
  const [agendaItems, setAgendaItems] = useState(() => {
    try {
      const stored = localStorage.getItem("agendaItems");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ===== FIX: Purana kharaab data auto clean =====
  useEffect(() => {
    const stored = localStorage.getItem("agendaItems");
    if (stored) {
      const parsed = JSON.parse(stored);
      const cleaned = parsed.filter(
        (item) => item.session && item.session.startTime,
      );

      if (cleaned.length !== parsed.length) {
        localStorage.setItem("agendaItems", JSON.stringify(cleaned));
        setAgendaItems(cleaned);
      }
    }
  }, []);

  // ===== Save changes to localStorage =====
  useEffect(() => {
    localStorage.setItem("agendaItems", JSON.stringify(agendaItems));
  }, [agendaItems]);

  const handleRemoveFromAgenda = (sessionId) => {
    const updatedItems = agendaItems.filter(
      (item) => item.sessionId !== sessionId,
    );
    setAgendaItems(updatedItems);
    localStorage.setItem("agendaItems", JSON.stringify(updatedItems));
    toast.success("Session removed from agenda");
  };

  return (
    // AgendaPage component mein ye changes karein

    <main className="agenda-page-container">
      <div className="agenda-content-wrapper">
        {/* HEADER */}
        <div className="agenda-header">
          <div className="agenda-header-badge">
            <div className="agenda-header-badge-line" />
            <span className="agenda-header-badge-text">Personal Schedule</span>
          </div>

          <div className="agenda-header-main">
            <div className="agenda-title-wrapper">
              <h1 className="agenda-title">My Agenda</h1>
              <p className="agenda-subtitle">
                Keep track of the sessions you want to attend and build your
                personalized event schedule.
              </p>
            </div>

            <div className="agenda-stats-box">
              <div className="agenda-stats-icon">
                <Icon name="calendar" className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <p className="agenda-stats-number">{agendaItems.length}</p>
                <p className="agenda-stats-label">
                  {agendaItems.length === 1 ? "session" : "sessions"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {agendaItems.length === 0 ? (
          <div className="agenda-empty">
            <div className="agenda-empty-content">
              <div className="agenda-empty-icon">
                <Icon name="calendar" className="h-7 w-7 text-indigo-400" />
              </div>
              <h2 className="agenda-empty-title">Your agenda is empty</h2>
              <p className="agenda-empty-desc">
                Explore available events, discover interesting sessions, and
                save the ones you don't want to miss.
              </p>
              <Link to="/events" className="agenda-empty-btn">
                Browse Events
                <Icon
                  name="arrowRight"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        ) : (
          <div className="agenda-list">
            {agendaItems.map((item, index) => {
              // Safety check
              if (!item.session || !item.session.startTime) return null;

              const session = item.session;
              const startDate = new Date(session.startTime);
              const endDate = new Date(session.endTime);

              return (
                <div key={item.id} className="agenda-item">
                  <div className="agenda-item-content">
                    <div className="agenda-item-inner">
                      <div className="agenda-item-date">
                        <span className="agenda-item-month">
                          {format(startDate, "MMM")}
                        </span>
                        <span className="agenda-item-day">
                          {format(startDate, "dd")}
                        </span>
                        <span className="agenda-item-weekday">
                          {format(startDate, "EEE")}
                        </span>
                      </div>
                      <div className="agenda-item-divider" />
                      <div className="agenda-item-info">
                        <div className="agenda-item-badges">
                          <span className="agenda-item-category">
                            {session.category || "Session"}
                          </span>
                          <span className="agenda-item-number">
                            #{String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="agenda-item-title">{session.title}</h3>
                        <div className="agenda-item-details">
                          <div className="agenda-item-detail">
                            <Icon
                              name="clock"
                              className="agenda-item-detail-icon"
                            />
                            <span>
                              {format(startDate, "h:mm a")}
                              <span className="mx-1.5 text-slate-600">—</span>
                              {format(endDate, "h:mm a")}
                            </span>
                          </div>
                          {session.room && (
                            <div className="agenda-item-detail">
                              <Icon
                                name="location"
                                className="agenda-item-detail-icon"
                              />
                              <span className="agenda-item-detail-text">
                                {session.room}
                              </span>
                            </div>
                          )}
                          {session.speakers?.length > 0 && (
                            <div className="agenda-item-detail">
                              <Icon
                                name="speaker"
                                className="agenda-item-detail-icon"
                              />
                              <span className="agenda-item-detail-text">
                                {session.speakers
                                  .map((s) => s.speaker.name)
                                  .join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFromAgenda(item.sessionId)}
                        className="agenda-item-remove-btn"
                      >
                        <Icon name="trash" className="h-4 w-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default AgendaPage;

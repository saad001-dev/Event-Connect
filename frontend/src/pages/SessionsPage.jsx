import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { eventsApi } from "../api/events";
import { format } from "date-fns";
import { useEventStore } from "../store/event.store";
import { useAuthStore } from "../store/auth.store";
import toast from "react-hot-toast";

// ===== SVG ICONS =====
const Icons = {
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
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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
  plus: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  ),
  minus: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 12H4"
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

function SessionsPage() {
  const { slug } = useParams();
  const { user } = useAuthStore();
  const { currentEvent, setCurrentEvent, sessions, setSessions } =
    useEventStore();
  const [loadingAgenda, setLoadingAgenda] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [localAgendaItems, setLocalAgendaItems] = useState([]);

  // Load agenda items from localStorage
  useEffect(() => {
    const savedAgenda = localStorage.getItem("agendaItems");
    if (savedAgenda) {
      try {
        setLocalAgendaItems(JSON.parse(savedAgenda));
      } catch (e) {
        console.error("Failed to parse agenda items");
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("agendaItems", JSON.stringify(localAgendaItems));
  }, [localAgendaItems]);

  // Fetch event
  const { data: eventData, isLoading: eventLoading } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => eventsApi.getEvent(slug).then((res) => res.data),
    enabled: !currentEvent || currentEvent.slug !== slug,
  });

  useEffect(() => {
    if (eventData) {
      setCurrentEvent(eventData);
      localStorage.setItem("currentEvent", JSON.stringify(eventData));
    }
  }, [eventData, setCurrentEvent]);

  // Fetch sessions
  const { data, isLoading, error } = useQuery({
    queryKey: ["sessions", currentEvent?.id],
    queryFn: () => {
      if (!currentEvent?.id) return null;
      return eventsApi.getSessions(currentEvent.id).then((res) => res.data);
    },
    enabled: !!currentEvent?.id,
  });

  useEffect(() => {
    if (data) {
      setSessions(data);
    }
  }, [data, setSessions]);

  const isInAgenda = (sessionId) => {
    return localAgendaItems.some((item) => item.sessionId === sessionId);
  };

  // ===== FIX: Add to Agenda (Guaranteed Save) =====
  const handleAddToAgenda = async (session) => {
    if (!user) {
      toast.error("Please login to add sessions to your agenda");
      return;
    }

    setLoadingAgenda({ ...loadingAgenda, [session.id]: true });

    setTimeout(() => {
      const newItem = {
        id: `agenda_${session.id}_${Date.now()}`,
        sessionId: session.id,
        eventId: currentEvent.id,
        session: session, // Full object save
      };

      // Update state + localStorage directly
      const updatedItems = [...localAgendaItems, newItem];
      setLocalAgendaItems(updatedItems);
      localStorage.setItem("agendaItems", JSON.stringify(updatedItems)); // Direct save

      toast.success("Added to your agenda!");
      setLoadingAgenda({ ...loadingAgenda, [session.id]: false });
    }, 500);
  };

  // ===== FIX: Remove from Agenda =====
  const handleRemoveFromAgenda = async (sessionId) => {
    setLoadingAgenda({ ...loadingAgenda, [sessionId]: true });

    setTimeout(() => {
      const updatedItems = localAgendaItems.filter(
        (item) => item.sessionId !== sessionId,
      );
      setLocalAgendaItems(updatedItems);
      localStorage.setItem("agendaItems", JSON.stringify(updatedItems)); // Direct save

      toast.success("Removed from agenda");
      setLoadingAgenda({ ...loadingAgenda, [sessionId]: false });
    }, 500);
  };

  const categories = [
    "all",
    "KEYNOTE",
    "PANEL",
    "WORKSHOP",
    "BREAKOUT",
    "NETWORKING",
    "SPONSOR",
  ];

  const filteredSessions = sessions?.filter(
    (session) =>
      selectedCategory === "all" || session.category === selectedCategory,
  );

  if (isLoading || eventLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-indigo-500 animate-spin" />
          <p className="text-sm text-slate-500">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 text-center">
          <h2 className="text-xl font-semibold text-white">
            Failed to Load Sessions
          </h2>
          <p className="text-sm text-slate-400 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sessions-page-container">
      <Link to={`/events/${slug}`} className="sessions-back-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Event
      </Link>

      <div className="sessions-header">
        <div className="sessions-title-section">
          <div className="sessions-badge">
            <span className="sessions-badge-dot" />
            Event Schedule
          </div>
          <h1 className="sessions-title">Sessions</h1>
          <p
            className="
  text-xs sm:text-sm md:text-base
  text-slate-400
  leading-relaxed
  truncate
  max-w-full
  w-full
  min-w-0
  flex-1
  overflow-hidden
"
          >
            {currentEvent?.name || "Loading..."}
          </p>
        </div>
        <div className="sessions-stats">
          <div className="sessions-stat-box">
            <div className="sessions-stat-number">
              {filteredSessions?.length || 0}
            </div>
            <div className="sessions-stat-label">Total Sessions</div>
          </div>
          <div className="sessions-stat-box">
            <div className="sessions-stat-number">
              {localAgendaItems?.length || 0}
            </div>
            <div className="sessions-stat-label">My Agenda</div>
          </div>
        </div>
      </div>

      <div className="sessions-filters">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`sessions-filter-btn ${selectedCategory === category ? "sessions-filter-btn-active" : ""}`}
          >
            {category === "all" ? "All" : category}
          </button>
        ))}
      </div>

      {filteredSessions?.length === 0 ? (
        <div className="sessions-empty">
          <div className="sessions-empty-icon">🎯</div>
          <h2 className="sessions-empty-title">No Sessions Found</h2>
          <p className="sessions-empty-desc">
            There are no sessions available in the selected category.
          </p>
        </div>
      ) : (
        <div>
          {filteredSessions?.map((session) => {
            const inAgenda = isInAgenda(session.id);
            return (
              <div key={session.id} className="sessions-card">
                <div className="sessions-card-bar" />
                <div className="sessions-card-body">
                  <div className="sessions-card-inner">
                    <div className="sessions-card-content">
                      <div className="sessions-card-badges">
                        <span className="sessions-card-category">
                          {session.category || "Session"}
                        </span>
                        {inAgenda && (
                          <span className="sessions-card-agenda-badge">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            In Agenda
                          </span>
                        )}
                      </div>
                      <h3 className="sessions-card-title">{session.title}</h3>
                      <div className="sessions-card-details">
                        <div className="sessions-card-detail">
                          <svg
                            className="sessions-card-detail-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="sessions-card-detail-text">
                            {format(new Date(session.startTime), "h:mm a")} —{" "}
                            {format(new Date(session.endTime), "h:mm a")}
                          </span>
                        </div>
                        {session.room && (
                          <div className="sessions-card-detail">
                            <svg
                              className="sessions-card-detail-icon"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.8}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                            </svg>
                            <span className="sessions-card-detail-text sessions-card-detail-text-truncate">
                              {session.room}
                            </span>
                          </div>
                        )}
                        {session.speakers?.length > 0 && (
                          <div className="sessions-card-detail">
                            <svg
                              className="sessions-card-detail-icon"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.8}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span className="sessions-card-detail-text sessions-card-detail-text-truncate">
                              {session.speakers
                                .map((s) => s.speaker.name)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                      {session.description && (
                        <p className="sessions-card-description">
                          {session.description}
                        </p>
                      )}
                    </div>
                    <div className="sessions-card-actions">
                      <div className="sessions-card-attendees">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.8}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>
                          {session.attendees || 0} / {session.capacity || "∞"}
                        </span>
                      </div>
                      {user ? (
                        inAgenda ? (
                          <button
                            onClick={() => handleRemoveFromAgenda(session.id)}
                            disabled={loadingAgenda[session.id]}
                            className="sessions-btn-remove"
                          >
                            {loadingAgenda[session.id] ? (
                              <span className="sessions-spinner" />
                            ) : (
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 12H4"
                                />
                              </svg>
                            )}
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddToAgenda(session)}
                            disabled={loadingAgenda[session.id]}
                            className="sessions-btn-add"
                          >
                            {loadingAgenda[session.id] ? (
                              <span className="sessions-spinner" />
                            ) : (
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            )}
                            Add to Agenda
                          </button>
                        )
                      ) : (
                        <Link to="/login" className="sessions-btn-login">
                          Login to add
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SessionsPage;

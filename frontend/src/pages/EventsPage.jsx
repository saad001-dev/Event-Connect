import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { eventsApi } from "../api/events";
import { useEventStore } from "../store/event.store";
import toast from "react-hot-toast";

// ===== ICONS =====
const Icons = {
  search: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  ),
  refresh: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M4 4v5h5M20 20v-5h-5M5.1 9A7.5 7.5 0 0118.5 6M18.9 15A7.5 7.5 0 015.5 18"
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
  arrowRight: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M5 12h14m-6-6l6 6-6 6"
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

function EventsPage() {
  const { setCurrentEvent } = useEventStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ===== LOCAL STORAGE: Load cached events =====
  const [cachedEvents, setCachedEvents] = useState(() => {
    const stored = localStorage.getItem("events");
    return stored ? JSON.parse(stored) : [];
  });

  const {
    data: eventsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["events"],
    queryFn: () =>
      eventsApi.getEvents().then((res) => {
        const data = res.data;
        // Save to localStorage
        localStorage.setItem(
          "events",
          JSON.stringify(data.events || data || []),
        );
        setCachedEvents(data.events || data || []);
        return data;
      }),
    staleTime: 60000, // 1 minute
  });

  const events = eventsData?.events || eventsData || cachedEvents || [];

  const filteredEvents = events.filter((event) => {
    const searchValue = search.toLowerCase().trim();
    const matchesSearch =
      !searchValue ||
      event.name?.toLowerCase().includes(searchValue) ||
      event.title?.toLowerCase().includes(searchValue) ||
      event.description?.toLowerCase().includes(searchValue) ||
      event.location?.toLowerCase().includes(searchValue);
    const matchesStatus =
      statusFilter === "ALL" || event.status?.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectEvent = (event) => {
    setCurrentEvent(event);
    // ===== LOCAL STORAGE: Save selected event =====
    localStorage.setItem("currentEvent", JSON.stringify(event));
    localStorage.setItem("currentEventId", event.id);
    toast.success("Event selected");
  };

  // ===== LOCAL STORAGE: Save filter state =====
  useEffect(() => {
    localStorage.setItem("eventSearch", search);
    localStorage.setItem("eventStatusFilter", statusFilter);
  }, [search, statusFilter]);

  // ===== LOCAL STORAGE: Load filter state =====
  useEffect(() => {
    const savedSearch = localStorage.getItem("eventSearch");
    const savedFilter = localStorage.getItem("eventStatusFilter");
    if (savedSearch) setSearch(savedSearch);
    if (savedFilter) setStatusFilter(savedFilter);
  }, []);

  const formatDateRange = (event) => {
    const start = event.startDate || event.startTime || event.date;
    const end = event.endDate || event.endTime;
    if (!start) return "Date TBA";
    if (!end)
      return new Date(start).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    return `${new Date(start).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} – ${new Date(end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const getEventStatus = (event) => {
    const status = event.status?.toUpperCase();
    if (status) return status;
    const start = event.startDate || event.startTime || event.date;
    const end = event.endDate || event.endTime;
    if (start && new Date(start) > new Date()) return "UPCOMING";
    if (end && new Date(end) < new Date()) return "ENDED";
    return "ACTIVE";
  };

  const statusStyles = {
    UPCOMING: "border-indigo-400/20 bg-indigo-400/10 text-indigo-300",
    ACTIVE: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    ONGOING: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    ENDED: "border-white/10 bg-white/[0.04] text-white/35",
    DRAFT: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  };

  if (isLoading && cachedEvents.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-indigo-500 animate-spin" />
          <p className="text-sm text-slate-500">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error && cachedEvents.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 text-center">
          <Icon name="sparkle" className="w-8 h-8 text-red-400 mx-auto" />
          <h2 className="text-xl font-semibold mt-4">Unable to load events</h2>
          <p className="text-sm text-slate-400 mt-2">
            Something went wrong while loading available events.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-6 px-5 py-2.5 bg-indigo-500 rounded-lg text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              Discover
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">
              Explore Events
            </h1>
            <p className="text-slate-400 mt-2 text-sm max-w-2xl leading-relaxed">
              Discover conferences, workshops, meetups and networking
              opportunities happening around you.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50 whitespace-nowrap"
          >
            <Icon
              name="refresh"
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            {isFetching ? "Refreshing" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.04] mb-10">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Icon
              name="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, locations, topics..."
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-400/40 focus:bg-white/10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 flex-wrap">
            {["ALL", "UPCOMING", "ACTIVE", "ENDED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                  statusFilter === status
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {status === "ALL"
                  ? "All Events"
                  : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-medium text-slate-300">
          {filteredEvents.length}{" "}
          {filteredEvents.length === 1 ? "event" : "events"}
        </p>
        {(search || statusFilter !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
              localStorage.removeItem("eventSearch");
              localStorage.removeItem("eventStatusFilter");
            }}
            className="text-xs text-slate-400 hover:text-white transition"
          >
            Clear filters ✕
          </button>
        )}
      </div>

      {/* Event Grid */}
      {filteredEvents.length === 0 ? (
        <div className="py-16 px-8 rounded-2xl border border-white/5 bg-white/5 text-center">
          <Icon
            name="sparkle"
            className="w-12 h-12 text-slate-500 mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold">No events found</h3>
          <p className="text-sm text-slate-400 mt-1">
            Try changing your search or filter to discover more events.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const status = getEventStatus(event);
            return (
              <div
                key={event.id}
                className="group bg-white/[0.04] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/[0.07] hover:border-indigo-500/25 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        statusStyles[status] ||
                        "border-white/10 bg-white/[0.04] text-white/40"
                      }`}
                    >
                      {status}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Icon name="calendar" className="w-3.5 h-3.5" />
                      {formatDateRange(event)}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-tight line-clamp-2 group-hover:text-indigo-300 transition-colors">
                    {event.name || event.title || "Untitled Event"}
                  </h3>
                  <p className="mt-2.5 text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {event.description ||
                      "Join this event and connect with professionals, speakers and attendees."}
                  </p>
                  <div className="mt-4 space-y-2">
                    {event.location && (
                      <div className="flex items-center gap-2.5 text-sm text-slate-400">
                        <Icon
                          name="location"
                          className="w-4 h-4 text-slate-500"
                        />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 text-sm text-slate-400">
                      <Icon name="users" className="w-4 h-4 text-slate-500" />
                      <span>{event.attendeeCount ?? 0} attendees</span>
                    </div>
                  </div>
                  <div className="mt-5 pt-5 border-t border-white/5 flex gap-3">
                    <button
                      onClick={() => handleSelectEvent(event)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      Select
                    </button>
                    <Link
                      to={`/events/${event.slug || event.id}`}
                      onClick={() => handleSelectEvent(event)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-500 text-center text-sm font-semibold text-white transition hover:bg-indigo-400 hover:shadow-lg hover:shadow-indigo-500/25"
                    >
                      View Event
                    </Link>
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

export default EventsPage;

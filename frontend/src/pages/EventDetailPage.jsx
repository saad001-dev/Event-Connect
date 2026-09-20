import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi, agendaApi } from "../api/events";
import { format } from "date-fns";
import { useEventStore } from "../store/event.store";
import { useAuthStore } from "../store/auth.store";
import toast from "react-hot-toast";

// ===== SVG ICONS =====
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
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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
  arrowRight: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M5 12h14m-6-6l6 6-6 6"
    />
  ),
  arrowLeft: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
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
  check: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  ),
  info: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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

function EventDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentEvent, setCurrentEvent } = useEventStore();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const queryClient = useQueryClient();

  // ===== LOCAL STORAGE: Get cached event =====
  const [cachedEvent, setCachedEvent] = useState(() => {
    const stored = localStorage.getItem("eventDetail");
    return stored ? JSON.parse(stored) : null;
  });

  // ===== LOCAL STORAGE: Get cached registration status =====
  const [cachedRegistration, setCachedRegistration] = useState(() => {
    const stored = localStorage.getItem("eventRegistration");
    return stored ? JSON.parse(stored) : false;
  });

  // Fetch event details
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["event", slug],
    queryFn: () =>
      eventsApi.getEvent(slug).then((res) => {
        const eventData = res.data;
        // Save to localStorage
        localStorage.setItem("eventDetail", JSON.stringify(eventData));
        setCachedEvent(eventData);
        return eventData;
      }),
    retry: 1,
    staleTime: 60000, // 1 minute
  });

  // Check if user is already registered
  const { data: registrationData } = useQuery({
    queryKey: ["registration", user?.id, data?.id],
    queryFn: async () => {
      if (!user || !data?.id) return null;
      try {
        const res = await eventsApi.checkRegistration(data.id);
        const regData = res.data;
        // Save to localStorage
        localStorage.setItem(
          "eventRegistration",
          JSON.stringify(regData?.registered || false),
        );
        setCachedRegistration(regData?.registered || false);
        return regData;
      } catch (err) {
        return null;
      }
    },
    enabled: !!user && !!data?.id,
    staleTime: 30000, // 30 seconds
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!data?.id) throw new Error("Event ID is required");
      const res = await eventsApi.registerForEvent(data.id);
      return res.data;
    },
    onSuccess: () => {
      setIsRegistered(true);
      localStorage.setItem("eventRegistration", JSON.stringify(true));
      toast.success("Successfully registered for the event!");
      queryClient.invalidateQueries({ queryKey: ["registration"] });
      queryClient.invalidateQueries({ queryKey: ["event", slug] });
      refetch();
    },
    onError: (err) => {
      console.error("Registration error:", err);
      toast.error(
        err.response?.data?.message || "Failed to register for event",
      );
    },
    onSettled: () => {
      setIsRegistering(false);
    },
  });

  const handleRegister = () => {
    if (!user) {
      toast.error("Please login to register for this event");
      navigate("/login");
      return;
    }
    setIsRegistering(true);
    registerMutation.mutate();
  };

  useEffect(() => {
    if (data) {
      setCurrentEvent(data);
      localStorage.setItem("currentEvent", JSON.stringify(data));
      localStorage.setItem("currentEventId", data.id);
    }
  }, [data, setCurrentEvent]);

  useEffect(() => {
    if (registrationData?.registered) {
      setIsRegistered(true);
      localStorage.setItem("eventRegistration", JSON.stringify(true));
    }
  }, [registrationData]);

  // Use cached data if available and no new data
  const eventData = data || cachedEvent;

  if (isLoading && !cachedEvent) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-indigo-500 animate-spin" />
          <p className="text-sm text-slate-500">Loading event...</p>
        </div>
      </div>
    );
  }

  if ((error || !eventData) && !cachedEvent) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/5 text-center">
          <Icon name="sparkle" className="w-12 h-12 text-slate-500 mx-auto" />
          <h2 className="text-2xl font-bold mt-4">Event Not Found</h2>
          <p className="text-sm text-slate-400 mt-2">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-3 mt-6 bg-indigo-500 rounded-xl text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Browse Events
            <Icon name="arrowRight" className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const statusStyles =
    eventData?.status === "UPCOMING"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : eventData?.status === "ONGOING"
        ? "border-indigo-400/20 bg-indigo-400/10 text-indigo-300"
        : "border-white/10 bg-white/[0.04] text-white/40";

  // Use cached registration status if available
  const finalIsRegistered = isRegistered || cachedRegistration;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      {/* Back Button */}
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white mb-6 group"
      >
        <Icon
          name="arrowLeft"
          className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
        />
        Back to Events
      </Link>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/5 bg-white/5 p-6 sm:p-8 lg:p-10 mb-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider ${statusStyles}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {eventData?.status}
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-slate-400">
                  <Icon name="calendar" className="w-3 h-3 mr-1.5" />
                  {eventData?.sessions?.length || 0} Sessions
                </span>
                {finalIsRegistered && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-xs font-medium text-emerald-400">
                    <Icon name="check" className="w-3.5 h-3.5" />
                    Registered
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                {eventData?.name}
              </h1>

              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Icon name="calendar" className="w-4 h-4 text-indigo-400" />
                  {format(new Date(eventData?.startDate), "MMM d, yyyy")}
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="clock" className="w-4 h-4 text-indigo-400" />
                  {format(new Date(eventData?.startDate), "h:mm a")} —{" "}
                  {format(new Date(eventData?.endDate), "h:mm a")}
                </div>
                {eventData?.location && (
                  <div className="flex items-center gap-2">
                    <Icon name="location" className="w-4 h-4 text-indigo-400" />
                    {eventData?.location}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
              <Link
                to={`/events/${eventData?.slug || eventData?.id}/sessions`}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-base font-semibold text-white transition-all duration-300 hover:from-indigo-400 hover:to-purple-400 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1 active:scale-[0.97] w-full sm:w-auto min-w-[200px]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 10l4.5-4.5M15 10l-4.5-4.5M15 10v11"
                  />
                </svg>
                View All Sessions
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 12h14m-6-6l6 6-6 6"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {eventData?.description && (
            <div className="border-t border-white/5 pt-5 mt-5">
              <p className="text-sm leading-relaxed text-slate-400">
                {eventData?.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          {
            value: eventData?.registrations?.length || 0,
            label: "Attendees",
            icon: "users",
          },
          {
            value: eventData?.sessions?.length || 0,
            label: "Sessions",
            icon: "calendar",
          },
          {
            value: eventData?.speakers?.length || 0,
            label: "Speakers",
            icon: "speaker",
          },
          {
            value: eventData?._count?.registrations || 0,
            label: "Registrations",
            icon: "users",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl border border-white/5 bg-white/5 text-center transition hover:bg-white/10 hover:border-indigo-500/20"
          >
            <Icon
              name={stat.icon}
              className="w-5 h-5 text-indigo-400 mx-auto mb-2"
            />
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {stat.value}
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-2xl border border-white/5 bg-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Icon name="info" className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                About This Event
              </h2>
              <p className="text-xs text-slate-500">Event overview</p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-400">
            {eventData?.description ||
              "No detailed description available for this event. Check back later for more information."}
          </p>

          {eventData?.tags && eventData?.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Topics
              </p>
              <div className="flex flex-wrap gap-2">
                {eventData?.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-slate-400 transition hover:border-indigo-400/20 hover:text-indigo-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-7 rounded-2xl border border-white/5 bg-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Icon name="clock" className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Quick Info</h2>
              <p className="text-xs text-slate-500">Event details</p>
            </div>
          </div>

          <div className="space-y-0">
            {[
              {
                label: "Start Date",
                value: format(new Date(eventData?.startDate), "MMM d, yyyy"),
              },
              {
                label: "End Date",
                value: format(new Date(eventData?.endDate), "MMM d, yyyy"),
              },
              { label: "Status", value: eventData?.status, highlight: true },
              ...(eventData?.location
                ? [{ label: "Location", value: eventData?.location }]
                : []),
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-start justify-between gap-4 py-4 ${i < 3 ? "border-b border-white/5" : ""}`}
              >
                <span className="text-sm text-slate-500">{item.label}</span>
                <span
                  className={`text-sm font-medium text-right ${item.highlight ? "text-indigo-400" : "text-white/75"}`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <Link
            to={`/events/${eventData?.slug || eventData?.id}/sessions`}
            className="flex items-center justify-center gap-2 w-full mt-6 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            Explore Sessions
            <Icon name="arrowRight" className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;

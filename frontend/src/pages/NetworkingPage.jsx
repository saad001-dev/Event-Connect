import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import toast from "react-hot-toast";

// ===== MOCK DATA GENERATORS =====
const generateMockAttendees = (eventId, count = 20) => {
  const firstNames = [
    "Alex",
    "Jordan",
    "Taylor",
    "Morgan",
    "Casey",
    "Riley",
    "Avery",
    "Quinn",
    "Logan",
    "Harper",
    "Charlie",
    "Dakota",
    "Emerson",
    "Finley",
    "Hayden",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Wilson",
    "Anderson",
    "Taylor",
    "Thomas",
    "Moore",
  ];
  const companies = [
    "TechCorp",
    "InnovateLabs",
    "DataFlow",
    "CloudNine",
    "AI Solutions",
    "DevOps Pro",
    "AgileSoft",
    "QuantumTech",
    "Future Systems",
    "Digital Works",
  ];
  const titles = [
    "Software Engineer",
    "Product Manager",
    "DevOps Lead",
    "Data Scientist",
    "UX Designer",
    "Frontend Developer",
    "Backend Engineer",
    "Full Stack Developer",
    "ML Engineer",
    "Cloud Architect",
  ];
  const interests = [
    "React",
    "Node.js",
    "Python",
    "AI/ML",
    "Cloud Computing",
    "DevOps",
    "UI/UX",
    "Mobile Development",
    "Blockchain",
    "IoT",
    "Web3",
    "Cybersecurity",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `attendee_${i + 1}`,
    userId: `user_${i + 1}`,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    email: `user${i + 1}@example.com`,
    company: companies[i % companies.length],
    title: titles[i % titles.length],
    avatar: `https://ui-avatars.com/api/?name=${firstNames[i % firstNames.length]}+${lastNames[i % lastNames.length]}&background=random&size=128`,
    interests: [
      interests[i % interests.length],
      interests[(i + 1) % interests.length],
    ],
    eventId: eventId,
    isAttendee: true,
    joinedAt: new Date().toISOString(),
  }));
};

// ===== NETWORKING API WITH LOCALSTORAGE =====
const networkingApi = {
  getAttendees: async (eventId) => {
    try {
      const stored = localStorage.getItem(`attendees_${eventId}`);
      if (stored) return { data: JSON.parse(stored) };

      const mockData = generateMockAttendees(eventId);
      localStorage.setItem(`attendees_${eventId}`, JSON.stringify(mockData));
      return { data: mockData };
    } catch (error) {
      console.error("Error fetching attendees:", error);
      return { data: generateMockAttendees(eventId) };
    }
  },

  getConnections: async (eventId, userId) => {
    try {
      const key = `connections_${eventId}_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) return { data: JSON.parse(stored) };
      return { data: [] };
    } catch (error) {
      return { data: [] };
    }
  },

  getPendingRequests: async (eventId, userId) => {
    try {
      const key = `pending_requests_${eventId}_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) return { data: JSON.parse(stored) };
      return { data: [] };
    } catch (error) {
      return { data: [] };
    }
  },

  sendConnectionRequest: async (eventId, userId, targetUserId) => {
    try {
      const pendingKey = `pending_requests_${eventId}_${targetUserId}`;
      const storedPending = localStorage.getItem(pendingKey);
      const pending = storedPending ? JSON.parse(storedPending) : [];

      const existing = pending.find(
        (r) => r.fromUserId === userId && r.status === "pending",
      );
      if (existing) throw new Error("Connection request already sent");

      const request = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fromUserId: userId,
        toUserId: targetUserId,
        eventId: eventId,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      pending.push(request);
      localStorage.setItem(pendingKey, JSON.stringify(pending));

      const sentKey = `sent_requests_${eventId}_${userId}`;
      const storedSent = localStorage.getItem(sentKey);
      const sent = storedSent ? JSON.parse(storedSent) : [];
      sent.push({ ...request, targetUserId });
      localStorage.setItem(sentKey, JSON.stringify(sent));

      return { data: request };
    } catch (error) {
      throw error;
    }
  },

  acceptConnectionRequest: async (eventId, userId, requestId) => {
    try {
      const pendingKey = `pending_requests_${eventId}_${userId}`;
      const storedPending = localStorage.getItem(pendingKey);
      let pending = storedPending ? JSON.parse(storedPending) : [];

      const requestIndex = pending.findIndex((r) => r.id === requestId);
      if (requestIndex === -1) throw new Error("Request not found");

      const request = pending[requestIndex];
      pending.splice(requestIndex, 1);
      localStorage.setItem(pendingKey, JSON.stringify(pending));

      const sentKey = `sent_requests_${eventId}_${request.fromUserId}`;
      const storedSent = localStorage.getItem(sentKey);
      let sent = storedSent ? JSON.parse(storedSent) : [];
      sent = sent.filter((r) => r.id !== requestId);
      localStorage.setItem(sentKey, JSON.stringify(sent));

      const connectionKey1 = `connections_${eventId}_${request.fromUserId}`;
      const connectionKey2 = `connections_${eventId}_${request.toUserId}`;

      const connections1 = JSON.parse(
        localStorage.getItem(connectionKey1) || "[]",
      );
      const connections2 = JSON.parse(
        localStorage.getItem(connectionKey2) || "[]",
      );

      const connection = {
        id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId1: request.fromUserId,
        userId2: request.toUserId,
        eventId: eventId,
        connectedAt: new Date().toISOString(),
      };

      connections1.push({ ...connection, targetUserId: request.toUserId });
      connections2.push({ ...connection, targetUserId: request.fromUserId });

      localStorage.setItem(connectionKey1, JSON.stringify(connections1));
      localStorage.setItem(connectionKey2, JSON.stringify(connections2));

      return { data: connection };
    } catch (error) {
      throw error;
    }
  },

  rejectConnectionRequest: async (eventId, userId, requestId) => {
    try {
      const pendingKey = `pending_requests_${eventId}_${userId}`;
      const storedPending = localStorage.getItem(pendingKey);
      let pending = storedPending ? JSON.parse(storedPending) : [];

      const requestIndex = pending.findIndex((r) => r.id === requestId);
      if (requestIndex === -1) throw new Error("Request not found");

      const request = pending[requestIndex];
      pending.splice(requestIndex, 1);
      localStorage.setItem(pendingKey, JSON.stringify(pending));

      const sentKey = `sent_requests_${eventId}_${request.fromUserId}`;
      const storedSent = localStorage.getItem(sentKey);
      let sent = storedSent ? JSON.parse(storedSent) : [];
      sent = sent.filter((r) => r.id !== requestId);
      localStorage.setItem(sentKey, JSON.stringify(sent));

      return { data: { success: true } };
    } catch (error) {
      throw error;
    }
  },

  removeConnection: async (eventId, userId, connectionId) => {
    try {
      const keys = Object.keys(localStorage);
      const connectionKeys = keys.filter((k) =>
        k.startsWith(`connections_${eventId}_`),
      );

      for (const key of connectionKeys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const connections = JSON.parse(stored);
          const filtered = connections.filter((c) => c.id !== connectionId);
          localStorage.setItem(key, JSON.stringify(filtered));
        }
      }
      return { data: { success: true } };
    } catch (error) {
      throw error;
    }
  },
};

// ===== CUSTOM HOOK =====
function useNetworking(eventId, userId) {
  const [attendees, setAttendees] = useState([]);
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState({
    attendees: false,
    connections: false,
    pending: false,
    sent: false,
  });

  const loadAttendees = async () => {
    if (!eventId) return;
    setLoading((prev) => ({ ...prev, attendees: true }));
    try {
      const response = await networkingApi.getAttendees(eventId);
      const filtered = response.data.filter((a) => a.userId !== userId);
      setAttendees(filtered);
    } catch (error) {
      console.error("Failed to load attendees:", error);
      toast.error("Failed to load attendees");
    } finally {
      setLoading((prev) => ({ ...prev, attendees: false }));
    }
  };

  const loadConnections = async () => {
    if (!eventId || !userId) return;
    setLoading((prev) => ({ ...prev, connections: true }));
    try {
      const response = await networkingApi.getConnections(eventId, userId);
      setConnections(response.data);
    } catch (error) {
      console.error("Failed to load connections:", error);
    } finally {
      setLoading((prev) => ({ ...prev, connections: false }));
    }
  };

  const loadPendingRequests = async () => {
    if (!eventId || !userId) return;
    setLoading((prev) => ({ ...prev, pending: true }));
    try {
      const response = await networkingApi.getPendingRequests(eventId, userId);
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Failed to load pending requests:", error);
    } finally {
      setLoading((prev) => ({ ...prev, pending: false }));
    }
  };

  const loadSentRequests = async () => {
    if (!eventId || !userId) return;
    setLoading((prev) => ({ ...prev, sent: true }));
    try {
      const key = `sent_requests_${eventId}_${userId}`;
      const stored = localStorage.getItem(key);
      const data = stored ? JSON.parse(stored) : [];
      setSentRequests(data);
    } catch (error) {
      console.error("Failed to load sent requests:", error);
    } finally {
      setLoading((prev) => ({ ...prev, sent: false }));
    }
  };

  const sendRequest = async (targetUserId) => {
    try {
      await networkingApi.sendConnectionRequest(eventId, userId, targetUserId);
      await Promise.all([loadPendingRequests(), loadSentRequests()]);
      toast.success("Connection request sent!");
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to send request");
      return false;
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await networkingApi.acceptConnectionRequest(eventId, userId, requestId);
      await Promise.all([
        loadConnections(),
        loadPendingRequests(),
        loadAttendees(),
      ]);
      toast.success("Connection accepted!");
      return true;
    } catch (error) {
      toast.error("Failed to accept request");
      return false;
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await networkingApi.rejectConnectionRequest(eventId, userId, requestId);
      await loadPendingRequests();
      toast.success("Request rejected");
      return true;
    } catch (error) {
      toast.error("Failed to reject request");
      return false;
    }
  };

  const removeConnection = async (connectionId) => {
    try {
      await networkingApi.removeConnection(eventId, userId, connectionId);
      await loadConnections();
      toast.success("Connection removed");
      return true;
    } catch (error) {
      toast.error("Failed to remove connection");
      return false;
    }
  };

  useEffect(() => {
    if (eventId) loadAttendees();
  }, [eventId]);

  useEffect(() => {
    if (eventId && userId) {
      loadConnections();
      loadPendingRequests();
      loadSentRequests();
    }
  }, [eventId, userId]);

  return {
    attendees,
    connections,
    pendingRequests,
    sentRequests,
    loading,
    sendRequest,
    acceptRequest,
    rejectRequest,
    removeConnection,
    refresh: () => {
      loadAttendees();
      loadConnections();
      loadPendingRequests();
      loadSentRequests();
    },
  };
}

// ===== SVG ICONS =====
const Icons = {
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  ),
  search: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
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

// ===== MAIN COMPONENT =====
function NetworkingPage() {
  const { slug } = useParams();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompany, setFilterCompany] = useState("all");
  const [activeTab, setActiveTab] = useState("attendees");

  const getEventId = () => {
    const storedEvent = localStorage.getItem("currentEvent");
    if (storedEvent) {
      try {
        const parsed = JSON.parse(storedEvent);
        if (parsed?.id) return parsed.id;
      } catch (e) {
        return storedEvent;
      }
    }
    const storedId = localStorage.getItem("currentEventId");
    if (storedId) return storedId;
    return "cmtkbdlpk0002g5qx38uxb7fy";
  };

  const eventId = getEventId();

  const {
    attendees,
    connections,
    pendingRequests,
    sentRequests,
    loading,
    sendRequest,
    acceptRequest,
    rejectRequest,
    removeConnection,
    refresh,
  } = useNetworking(eventId, user?.id);

  const companies = [
    "all",
    ...new Set(attendees.map((a) => a.company).filter(Boolean)),
  ];

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany =
      filterCompany === "all" || attendee.company === filterCompany;
    return matchesSearch && matchesCompany;
  });

  const isConnected = (userId) =>
    connections.some((c) => c.targetUserId === userId);

  const isRequestPending = (userId) =>
    sentRequests.some(
      (r) => r.targetUserId === userId && r.status === "pending",
    );

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="networking-auth-card">
          <span className="networking-auth-icon">🔗</span>
          <h2 className="networking-auth-title">Connect with Attendees</h2>
          <p className="networking-auth-desc">
            Login to network with other attendees and build meaningful
            connections.
          </p>
          <Link to="/login" className="networking-auth-btn">
            Login to Network
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="networking-container">
      {/* Back Button */}
      <Link to={`/events/${slug}`} className="networking-back-btn">
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

      {/* Header */}
      <div className="networking-header">
        <div className="networking-header-badge">
          <div className="networking-header-badge-icon">
            <Icon name="users" className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="networking-header-badge-text">Networking</span>
        </div>
        <h1 className="networking-title">Connect with Attendees</h1>
        <p className="networking-subtitle">
          Build your professional network and connect with like-minded people.
        </p>
      </div>

      {/* Stats */}
      <div className="networking-stats">
        <div className="networking-stat-card">
          <div className="networking-stat-number networking-stat-number-white">
            {attendees.length}
          </div>
          <div className="networking-stat-label">Total Attendees</div>
        </div>
        <div className="networking-stat-card">
          <div className="networking-stat-number networking-stat-number-indigo">
            {connections.length}
          </div>
          <div className="networking-stat-label">My Connections</div>
        </div>
        <div className="networking-stat-card">
          <div className="networking-stat-number networking-stat-number-yellow">
            {pendingRequests.length}
          </div>
          <div className="networking-stat-label">Pending Requests</div>
        </div>
        <div className="networking-stat-card">
          <div className="networking-stat-number networking-stat-number-green">
            {sentRequests.length}
          </div>
          <div className="networking-stat-label">Sent Requests</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="networking-tabs">
        <button
          onClick={() => setActiveTab("attendees")}
          className={`networking-tab ${activeTab === "attendees" ? "networking-tab-active" : ""}`}
        >
          All Attendees
          <span className="networking-tab-badge">{attendees.length}</span>
        </button>
        <button
          onClick={() => setActiveTab("connections")}
          className={`networking-tab ${activeTab === "connections" ? "networking-tab-active" : ""}`}
        >
          My Connections
          <span className="networking-tab-badge">{connections.length}</span>
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`networking-tab ${activeTab === "pending" ? "networking-tab-active" : ""}`}
        >
          Pending Requests
          {pendingRequests.length > 0 && (
            <span className="networking-tab-badge networking-tab-badge-highlight">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Search and Filter */}
      {activeTab === "attendees" && (
        <div className="networking-search-bar">
          <div className="networking-search-input-wrapper">
            <Icon name="search" />
            <input
              type="text"
              placeholder="Search attendees by name, title, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="networking-search-input"
            />
          </div>
          <select
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            className="networking-filter-select"
          >
            {companies.map((company) => (
              <option key={company} value={company} className="bg-slate-900">
                {company === "all" ? "All Companies" : company}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Content */}
      {loading.attendees && activeTab === "attendees" && (
        <div className="networking-loading">
          <div className="networking-spinner" />
          <p className="networking-loading-text">Loading attendees...</p>
        </div>
      )}

      {activeTab === "attendees" &&
        filteredAttendees.length === 0 &&
        !loading.attendees && (
          <div className="networking-empty">
            <span className="networking-empty-icon">🔍</span>
            <h3 className="networking-empty-title">No attendees found</h3>
            <p className="networking-empty-desc">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

      {activeTab === "attendees" && filteredAttendees.length > 0 && (
        <div className="networking-grid">
          {filteredAttendees.map((attendee) => {
            const connected = isConnected(attendee.userId);
            const pending = isRequestPending(attendee.userId);

            return (
              <div key={attendee.id} className="networking-card">
                <div className="networking-card-inner">
                  <img
                    src={attendee.avatar}
                    alt={attendee.name}
                    className="networking-card-avatar"
                  />
                  <div className="networking-card-info">
                    <h3 className="networking-card-name">{attendee.name}</h3>
                    <p className="networking-card-title">{attendee.title}</p>
                    <p className="networking-card-company">
                      {attendee.company}
                    </p>
                    {attendee.interests && attendee.interests.length > 0 && (
                      <div className="networking-interests">
                        {attendee.interests.slice(0, 3).map((interest, idx) => (
                          <span key={idx} className="networking-interest-tag">
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="networking-card-actions">
                  {connected ? (
                    <button
                      onClick={() =>
                        removeConnection(
                          connections.find(
                            (c) => c.targetUserId === attendee.userId,
                          )?.id,
                        )
                      }
                      className="btn-connect btn-connect-remove"
                    >
                      Remove
                    </button>
                  ) : pending ? (
                    <button
                      disabled
                      className="btn-connect btn-connect-pending"
                    >
                      Request Pending
                    </button>
                  ) : (
                    <button
                      onClick={() => sendRequest(attendee.userId)}
                      className="btn-connect btn-connect-primary"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* My Connections Tab */}
      {activeTab === "connections" && (
        <div>
          {connections.length === 0 ? (
            <div className="networking-empty">
              <span className="networking-empty-icon">🤝</span>
              <h3 className="networking-empty-title">No connections yet</h3>
              <p className="networking-empty-desc">
                Start networking by connecting with other attendees
              </p>
            </div>
          ) : (
            <div className="networking-grid">
              {connections.map((connection) => {
                const attendee = attendees.find(
                  (a) => a.userId === connection.targetUserId,
                );
                if (!attendee) return null;

                return (
                  <div key={connection.id} className="networking-card">
                    <div className="networking-card-inner">
                      <img
                        src={attendee.avatar}
                        alt={attendee.name}
                        className="networking-card-avatar"
                      />
                      <div className="networking-card-info">
                        <h3 className="networking-card-name">
                          {attendee.name}
                        </h3>
                        <p className="networking-card-title">
                          {attendee.title}
                        </p>
                        <p className="networking-card-company">
                          {attendee.company}
                        </p>
                      </div>
                    </div>
                    <div className="networking-card-actions">
                      <button
                        onClick={() => removeConnection(connection.id)}
                        className="btn-connect btn-connect-remove"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Pending Requests Tab */}
      {activeTab === "pending" && (
        <div>
          {pendingRequests.length === 0 ? (
            <div className="networking-empty">
              <span className="networking-empty-icon">📭</span>
              <h3 className="networking-empty-title">No pending requests</h3>
              <p className="networking-empty-desc">
                You don't have any pending connection requests
              </p>
            </div>
          ) : (
            <div className="networking-grid">
              {pendingRequests.map((request) => {
                const attendee = attendees.find(
                  (a) => a.userId === request.fromUserId,
                );
                if (!attendee) return null;

                return (
                  <div
                    key={request.id}
                    className="networking-card networking-card-pending"
                  >
                    <div className="networking-card-inner">
                      <img
                        src={attendee.avatar}
                        alt={attendee.name}
                        className="networking-card-avatar"
                      />
                      <div className="networking-card-info">
                        <h3 className="networking-card-name">
                          {attendee.name}
                        </h3>
                        <p className="networking-card-title">
                          {attendee.title}
                        </p>
                        <p className="networking-card-company">
                          {attendee.company}
                        </p>
                      </div>
                    </div>
                    <div className="networking-card-actions">
                      <button
                        onClick={() => acceptRequest(request.id)}
                        className="btn-connect btn-connect-accept"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectRequest(request.id)}
                        className="btn-connect btn-connect-reject"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Refresh Button */}
      <button onClick={refresh} className="networking-refresh-btn">
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h5M20 20v-5h-5M5.1 9A7.5 7.5 0 0118.5 6M18.9 15A7.5 7.5 0 015.5 18"
          />
        </svg>
        Refresh Connections
      </button>
    </div>
  );
}

export default NetworkingPage;

import { api } from "./config";

export const eventsApi = {
  // ✅ FIXED: /api hatao (baseURL mein already hai)
  getEvents: (params) => api.get("/v1/events", { params }),
  getEvent: (slug) => api.get(`/v1/events/${slug}`),
  getSessions: (eventId) => api.get(`/v1/events/${eventId}/sessions`),
  createEvent: (data) => api.post("/v1/events", data),
  updateEvent: (id, data) => api.put(`/v1/events/${id}`, data),

  // ✅ FIXED: Register for event
  registerForEvent: (eventId) => api.post(`/v1/events/${eventId}/register`),

  // ✅ FIXED: Check registration status
  checkRegistration: (eventId) =>
    api.get(`/v1/events/${eventId}/registration-status`),
};

export const agendaApi = {
  // ✅ FIXED: /api hatao
  getAgenda: (eventId) => api.get(`/v1/agenda/${eventId}`),
  addToAgenda: (eventId, sessionId) =>
    api.post(`/v1/agenda/${eventId}/sessions/${sessionId}`),
  removeFromAgenda: (eventId, sessionId) =>
    api.delete(`/v1/agenda/${eventId}/sessions/${sessionId}`),
  updateNotes: (eventId, sessionId, notes) =>
    api.patch(`/v1/agenda/${eventId}/sessions/${sessionId}/notes`, { notes }),
};

export const connectionsApi = {
  // ✅ FIXED: /api hatao
  getConnections: () => api.get("/v1/connections"),
  getPendingRequests: () => api.get("/v1/connections/pending"),
  sendRequest: (data) => api.post("/v1/connections", data),
  acceptRequest: (id) => api.put(`/v1/connections/${id}/accept`),
  declineRequest: (id) => api.put(`/v1/connections/${id}/decline`),
};

export const authApi = {
  // ✅ FIXED: /api hatao
  login: (data) => api.post("/v1/auth/login", data),
  register: (data) => api.post("/v1/auth/register", data),
};

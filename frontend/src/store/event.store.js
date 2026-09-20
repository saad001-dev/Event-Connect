import { create } from 'zustand'

export const useEventStore = create((set, get) => ({
  events: [],
  currentEvent: null,
  sessions: [],
  agenda: [],
  connections: [],
  isLoading: false,
  error: null,

  setEvents: (events) => set({ events }),
  setCurrentEvent: (event) => set({ currentEvent: event }),
  setSessions: (sessions) => set({ sessions }),
  setAgenda: (agenda) => set({ agenda }),
  setConnections: (connections) => set({ connections }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
  reset: () => set({
    events: [],
    currentEvent: null,
    sessions: [],
    agenda: [],
    connections: [],
    isLoading: false,
    error: null,
  }),
}))
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

// ==================== CORS MIDDLEWARE ====================
const corsOptions = {
  origin: [
    "https://eventconnect-zeta.vercel.app",
    "https://eventconnect.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "user-id",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== HEALTH CHECK ====================
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "EventConnect API is running! 🚀",
    timestamp: new Date().toISOString(),
  });
});

// ==================== AUTH ROUTES ====================

// Register
app.post("/api/v1/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        role: role || "ATTENDEE",
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

// Login
app.post("/api/v1/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login successful!",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        company: user.company,
        title: user.title,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

// ==================== EVENT ROUTES ====================

// Get all events
app.get("/api/v1/events", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { startDate: "asc" },
    });

    res.json({
      events,
      total: events.length,
    });
  } catch (error) {
    console.error("Events error:", error);
    res.status(500).json({
      message: "Failed to fetch events",
      error: error.message,
    });
  }
});

// Get event by slug or ID
app.get("/api/v1/events/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    let event = await prisma.event.findUnique({
      where: { slug },
      include: {
        sessions: true,
        speakers: true,
        sponsors: true,
        registrations: {
          select: {
            id: true,
            ticketType: true,
            status: true,
          },
        },
      },
    });

    if (!event) {
      event = await prisma.event.findUnique({
        where: { id: slug },
        include: {
          sessions: true,
          speakers: true,
          sponsors: true,
          registrations: {
            select: {
              id: true,
              ticketType: true,
              status: true,
            },
          },
        },
      });
    }

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json(event);
  } catch (error) {
    console.error("Event detail error:", error);
    res.status(500).json({
      message: "Failed to fetch event",
      error: error.message,
    });
  }
});

// ✅ FIXED: Get event sessions (Single route - slug or ID support)
app.get("/api/v1/events/:eventId/sessions", async (req, res) => {
  try {
    const { eventId } = req.params;

    // First find event by slug
    let event = await prisma.event.findUnique({
      where: { slug: eventId },
    });

    // If not found by slug, try by ID
    if (!event) {
      event = await prisma.event.findUnique({
        where: { id: eventId },
      });
    }

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Fetch sessions with event's actual ID
    const sessions = await prisma.session.findMany({
      where: { eventId: event.id },
      include: {
        speakers: {
          include: {
            speaker: true,
          },
        },
      },
      orderBy: { startTime: "asc" },
    });

    res.json(sessions);
  } catch (error) {
    console.error("Sessions error:", error);
    res.status(500).json({
      message: "Failed to fetch sessions",
      error: error.message,
    });
  }
});

// Register for event
app.post("/api/v1/events/:eventId/register", async (req, res) => {
  try {
    const { eventId } = req.params;
    let userId = req.headers["user-id"];

    if (!userId || userId === "temp-user-id") {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        userId = firstUser.id;
      } else {
        return res.status(400).json({
          message: "No user found. Please register first.",
        });
      }
    }

    const existingRegistration = await prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "Already registered for this event",
      });
    }

    const registration = await prisma.registration.create({
      data: {
        userId,
        eventId,
        status: "CONFIRMED",
        ticketType: "FREE",
      },
    });

    res.status(201).json({
      message: "Successfully registered for event!",
      registration,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Failed to register for event",
      error: error.message,
    });
  }
});

// Check registration status
app.get("/api/v1/events/:eventId/registration-status", async (req, res) => {
  try {
    const { eventId } = req.params;
    let userId = req.headers["user-id"];

    if (!userId || userId === "temp-user-id") {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        userId = firstUser.id;
      } else {
        return res.json({ registered: false });
      }
    }

    const registration = await prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    res.json({
      registered: !!registration,
      registration,
    });
  } catch (error) {
    console.error("Registration status error:", error);
    res.json({ registered: false });
  }
});

// ==================== AGENDA ROUTES ====================

// Get user's agenda
app.get("/api/v1/agenda/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    let userId = req.headers["user-id"];

    if (!userId || userId === "temp-user-id") {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        userId = firstUser.id;
      } else {
        return res.status(400).json({
          message: "No user found. Please register first.",
        });
      }
    }

    const agenda = await prisma.agenda.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      include: {
        items: {
          include: {
            session: {
              include: {
                speakers: {
                  include: {
                    speaker: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!agenda) {
      return res.json({
        id: null,
        userId,
        eventId,
        items: [],
      });
    }

    res.json(agenda);
  } catch (error) {
    console.error("Agenda error:", error);
    res.status(500).json({
      message: "Failed to fetch agenda",
      error: error.message,
    });
  }
});

// Add session to agenda
app.post("/api/v1/agenda/:eventId/sessions/:sessionId", async (req, res) => {
  try {
    const { eventId, sessionId } = req.params;
    let userId = req.headers["user-id"];

    if (!userId || userId === "temp-user-id") {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        userId = firstUser.id;
      } else {
        return res.status(400).json({
          message: "No user found. Please register first.",
        });
      }
    }

    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        eventId,
      },
    });

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    let agenda = await prisma.agenda.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (!agenda) {
      agenda = await prisma.agenda.create({
        data: {
          userId,
          eventId,
        },
      });
    }

    const existingItem = await prisma.agendaItem.findUnique({
      where: {
        agendaId_sessionId: {
          agendaId: agenda.id,
          sessionId,
        },
      },
    });

    if (existingItem) {
      return res.status(400).json({
        message: "Session already in agenda",
      });
    }

    const agendaItem = await prisma.agendaItem.create({
      data: {
        agendaId: agenda.id,
        sessionId,
      },
      include: {
        session: {
          include: {
            speakers: {
              include: {
                speaker: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      message: "Session added to agenda!",
      agendaItem,
    });
  } catch (error) {
    console.error("Add to agenda error:", error);
    res.status(500).json({
      message: "Failed to add to agenda",
      error: error.message,
    });
  }
});

// Remove session from agenda
app.delete("/api/v1/agenda/:eventId/sessions/:sessionId", async (req, res) => {
  try {
    const { eventId, sessionId } = req.params;
    let userId = req.headers["user-id"];

    if (!userId || userId === "temp-user-id") {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        userId = firstUser.id;
      } else {
        return res.status(400).json({
          message: "No user found. Please register first.",
        });
      }
    }

    const agenda = await prisma.agenda.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (!agenda) {
      return res.status(404).json({
        message: "Agenda not found",
      });
    }

    const agendaItem = await prisma.agendaItem.findUnique({
      where: {
        agendaId_sessionId: {
          agendaId: agenda.id,
          sessionId,
        },
      },
    });

    if (!agendaItem) {
      return res.status(404).json({
        message: "Session not in agenda",
      });
    }

    await prisma.agendaItem.delete({
      where: {
        agendaId_sessionId: {
          agendaId: agenda.id,
          sessionId,
        },
      },
    });

    res.json({
      message: "Session removed from agenda!",
    });
  } catch (error) {
    console.error("Remove from agenda error:", error);
    res.status(500).json({
      message: "Failed to remove from agenda",
      error: error.message,
    });
  }
});

// ==================== CONNECTIONS ROUTES ====================

// Get all connections
app.get("/api/v1/connections", async (req, res) => {
  try {
    let userId = req.headers["user-id"];

    if (!userId || userId === "temp-user-id") {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        userId = firstUser.id;
      } else {
        return res.status(400).json({
          message: "No user found. Please register first.",
        });
      }
    }

    const connections = await prisma.connection.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
        status: "ACCEPTED",
      },
      include: {
        fromUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
            title: true,
            company: true,
          },
        },
        toUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
            title: true,
            company: true,
          },
        },
      },
    });

    const result = connections.map((conn) => {
      const isFromUser = conn.fromUserId === userId;
      return {
        id: conn.id,
        userId: isFromUser ? conn.toUserId : conn.fromUserId,
        user: isFromUser ? conn.toUser : conn.fromUser,
        status: conn.status,
        message: conn.message,
        createdAt: conn.createdAt,
        updatedAt: conn.updatedAt,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Connections error:", error);
    res.status(500).json({
      message: "Failed to fetch connections",
      error: error.message,
    });
  }
});

// Get pending requests
app.get("/api/v1/connections/pending", async (req, res) => {
  try {
    let userId = req.headers["user-id"];

    if (!userId || userId === "temp-user-id") {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        userId = firstUser.id;
      } else {
        return res.status(400).json({
          message: "No user found. Please register first.",
        });
      }
    }

    const pending = await prisma.connection.findMany({
      where: {
        toUserId: userId,
        status: "PENDING",
      },
      include: {
        fromUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
            title: true,
            company: true,
          },
        },
      },
    });

    res.json(pending);
  } catch (error) {
    console.error("Pending requests error:", error);
    res.status(500).json({
      message: "Failed to fetch pending requests",
      error: error.message,
    });
  }
});

// Send connection request
app.post("/api/v1/connections", async (req, res) => {
  try {
    const { toUserId, eventId, message } = req.body;
    let userId = req.headers["user-id"];

    if (!userId || userId === "temp-user-id") {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        userId = firstUser.id;
      } else {
        return res.status(400).json({
          message: "No user found. Please register first.",
        });
      }
    }

    if (userId === toUserId) {
      return res.status(400).json({
        message: "Cannot connect with yourself",
      });
    }

    const existing = await prisma.connection.findFirst({
      where: {
        OR: [
          { fromUserId: userId, toUserId: toUserId, eventId },
          { fromUserId: toUserId, toUserId: userId, eventId },
        ],
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Connection request already exists",
      });
    }

    const connection = await prisma.connection.create({
      data: {
        fromUserId: userId,
        toUserId,
        eventId,
        message,
        status: "PENDING",
      },
      include: {
        fromUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
            title: true,
            company: true,
          },
        },
        toUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
            title: true,
            company: true,
          },
        },
      },
    });

    res.status(201).json(connection);
  } catch (error) {
    console.error("Send connection error:", error);
    res.status(500).json({
      message: "Failed to send connection request",
      error: error.message,
    });
  }
});

// Accept connection request
app.put("/api/v1/connections/:id/accept", async (req, res) => {
  try {
    const { id } = req.params;
    let userId = req.headers["user-id"];

    if (!userId || userId === "temp-user-id") {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        userId = firstUser.id;
      } else {
        return res.status(400).json({
          message: "No user found. Please register first.",
        });
      }
    }

    const connection = await prisma.connection.findFirst({
      where: {
        id,
        toUserId: userId,
        status: "PENDING",
      },
    });

    if (!connection) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    const updated = await prisma.connection.update({
      where: { id },
      data: { status: "ACCEPTED" },
    });

    res.json(updated);
  } catch (error) {
    console.error("Accept connection error:", error);
    res.status(500).json({
      message: "Failed to accept connection",
      error: error.message,
    });
  }
});

// Decline connection request
app.put("/api/v1/connections/:id/decline", async (req, res) => {
  try {
    const { id } = req.params;
    let userId = req.headers["user-id"];

    if (!userId || userId === "temp-user-id") {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        userId = firstUser.id;
      } else {
        return res.status(400).json({
          message: "No user found. Please register first.",
        });
      }
    }

    const connection = await prisma.connection.findFirst({
      where: {
        id,
        toUserId: userId,
        status: "PENDING",
      },
    });

    if (!connection) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    const updated = await prisma.connection.update({
      where: { id },
      data: { status: "DECLINED" },
    });

    res.json(updated);
  } catch (error) {
    console.error("Decline connection error:", error);
    res.status(500).json({
      message: "Failed to decline connection",
      error: error.message,
    });
  }
});

// ==================== ATTENDEE DISCOVERY ====================

// Get all attendees for networking
app.get("/api/v1/attendees", async (req, res) => {
  try {
    let userId = req.headers["user-id"];

    if (!userId || userId === "temp-user-id") {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        userId = firstUser.id;
      } else {
        return res.status(400).json({
          message: "No user found. Please register first.",
        });
      }
    }

    const attendees = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatarUrl: true,
        title: true,
        company: true,
        bio: true,
        role: true,
      },
    });

    res.json(attendees);
  } catch (error) {
    console.error("Attendees error:", error);
    res.status(500).json({
      message: "Failed to fetch attendees",
      error: error.message,
    });
  }
});

// ==================== DEBUG ROUTE ====================

// Get all users (debugging only)
app.get("/api/v1/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SERVER START ====================

if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(port, "0.0.0.0", () => {
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`📌 Health: GET  http://localhost:${port}/`);
    console.log(
      `📌 Register: POST http://localhost:${port}/api/v1/auth/register`,
    );
    console.log(`📌 Login: POST http://localhost:${port}/api/v1/auth/login`);
    console.log(`📌 Events: GET http://localhost:${port}/api/v1/events`);
    console.log(
      `📌 Sessions: GET http://localhost:${port}/api/v1/events/:eventId/sessions`,
    );
  });
}

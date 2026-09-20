const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ==================== USERS ====================
  const hashedPassword = await bcrypt.hash("123456", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@stitchcraft.com" },
    update: {},
    create: {
      email: "admin@stitchcraft.com",
      passwordHash: hashedPassword,
      firstName: "Saad",
      lastName: "Ali",
      role: "ATTENDEE",
      status: "ACTIVE",
    },
  });
  console.log("✅ User created:", user.email);

  // ==================== EVENTS ====================

  // Event 1: Tech Summit
  const event1 = await prisma.event.upsert({
    where: { slug: "tech-summit-2026" },
    update: {},
    create: {
      name: "Tech Summit 2026",
      slug: "tech-summit-2026",
      description: "Annual technology conference for developers and innovators",
      startDate: new Date("2026-12-01T09:00:00Z"),
      endDate: new Date("2026-12-03T18:00:00Z"),
      timezone: "UTC",
      status: "UPCOMING",
      isPublished: true,
    },
  });
  console.log("✅ Event created:", event1.name);

  // Event 2: AI Conference
  const event2 = await prisma.event.upsert({
    where: { slug: "ai-conference-2026" },
    update: {},
    create: {
      name: "AI Conference 2026",
      slug: "ai-conference-2026",
      description: "Global AI and machine learning conference",
      startDate: new Date("2026-11-15T09:00:00Z"),
      endDate: new Date("2026-11-16T18:00:00Z"),
      timezone: "UTC",
      status: "UPCOMING",
      isPublished: true,
    },
  });
  console.log("✅ Event created:", event2.name);

  // Event 3: Web Dev Workshop
  const event3 = await prisma.event.upsert({
    where: { slug: "web-dev-workshop-2026" },
    update: {},
    create: {
      name: "Web Dev Workshop 2026",
      slug: "web-dev-workshop-2026",
      description: "Hands-on workshop for modern web development",
      startDate: new Date("2026-10-20T09:00:00Z"),
      endDate: new Date("2026-10-20T17:00:00Z"),
      timezone: "UTC",
      status: "UPCOMING",
      isPublished: true,
    },
  });
  console.log("✅ Event created:", event3.name);

  // ==================== SESSIONS ====================

  // ===== SESSIONS FOR TECH SUMMIT =====
  const session1 = await prisma.session.create({
    data: {
      title: "Keynote: Future of Technology",
      description: "Opening keynote about technology trends and innovations",
      startTime: new Date("2026-12-01T10:00:00Z"),
      endTime: new Date("2026-12-01T11:00:00Z"),
      room: "Main Hall",
      category: "KEYNOTE",
      level: "ALL_LEVELS",
      status: "SCHEDULED",
      eventId: event1.id,
    },
  });
  console.log("✅ Session created:", session1.title);

  const session2 = await prisma.session.create({
    data: {
      title: "Building Scalable Applications",
      description: "Learn how to build applications that scale",
      startTime: new Date("2026-12-01T11:30:00Z"),
      endTime: new Date("2026-12-01T12:30:00Z"),
      room: "Room A",
      category: "WORKSHOP",
      level: "INTERMEDIATE",
      status: "SCHEDULED",
      eventId: event1.id,
    },
  });
  console.log("✅ Session created:", session2.title);

  const session3 = await prisma.session.create({
    data: {
      title: "AI and Machine Learning Panel",
      description: "Panel discussion with industry experts",
      startTime: new Date("2026-12-02T14:00:00Z"),
      endTime: new Date("2026-12-02T15:30:00Z"),
      room: "Room B",
      category: "PANEL",
      level: "ALL_LEVELS",
      status: "SCHEDULED",
      eventId: event1.id,
    },
  });
  console.log("✅ Session created:", session3.title);

  // ===== SESSIONS FOR AI CONFERENCE =====
  const session4 = await prisma.session.create({
    data: {
      title: "AI Ethics and Responsibility",
      description: "Discussion on ethical AI development",
      startTime: new Date("2026-11-15T10:00:00Z"),
      endTime: new Date("2026-11-15T11:00:00Z"),
      room: "Main Hall",
      category: "KEYNOTE",
      level: "ALL_LEVELS",
      status: "SCHEDULED",
      eventId: event2.id,
    },
  });
  console.log("✅ Session created:", session4.title);

  // ===== SESSIONS FOR WEB DEV WORKSHOP (NEW!) =====
  const session5 = await prisma.session.create({
    data: {
      title: "React: From Zero to Hero",
      description: "Learn React from basics to advanced concepts",
      startTime: new Date("2026-10-20T10:00:00Z"),
      endTime: new Date("2026-10-20T12:00:00Z"),
      room: "Workshop Room A",
      category: "WORKSHOP",
      level: "BEGINNER",
      status: "SCHEDULED",
      eventId: event3.id,
    },
  });
  console.log("✅ Session created:", session5.title);

  const session6 = await prisma.session.create({
    data: {
      title: "Node.js Backend Development",
      description: "Build robust APIs with Node.js and Express",
      startTime: new Date("2026-10-20T13:00:00Z"),
      endTime: new Date("2026-10-20T15:00:00Z"),
      room: "Workshop Room B",
      category: "WORKSHOP",
      level: "INTERMEDIATE",
      status: "SCHEDULED",
      eventId: event3.id,
    },
  });
  console.log("✅ Session created:", session6.title);

  const session7 = await prisma.session.create({
    data: {
      title: "Networking and Career Growth",
      description: "Connect with fellow developers and industry experts",
      startTime: new Date("2026-10-20T15:30:00Z"),
      endTime: new Date("2026-10-20T17:00:00Z"),
      room: "Networking Lounge",
      category: "NETWORKING",
      level: "ALL_LEVELS",
      status: "SCHEDULED",
      eventId: event3.id,
    },
  });
  console.log("✅ Session created:", session7.title);

  // ==================== SPEAKERS ====================

  const speaker1 = await prisma.speaker.create({
    data: {
      name: "Dr. Sarah Ahmed",
      title: "AI Researcher",
      company: "Tech Labs",
      bio: "Leading researcher in artificial intelligence",
      isKeynote: true,
      eventId: event1.id,
    },
  });
  console.log("✅ Speaker created:", speaker1.name);

  const speaker2 = await prisma.speaker.create({
    data: {
      name: "Usman Khan",
      title: "Senior Software Engineer",
      company: "DevOps Inc",
      bio: "Expert in scalable architecture and cloud computing",
      isKeynote: false,
      eventId: event1.id,
    },
  });
  console.log("✅ Speaker created:", speaker2.name);

  // ===== ADD SPEAKERS FOR WEB DEV WORKSHOP =====
  const speaker3 = await prisma.speaker.create({
    data: {
      name: "Ali Hassan",
      title: "Full Stack Developer",
      company: "TechStart Inc",
      bio: "Passionate about teaching web development",
      isKeynote: false,
      eventId: event3.id,
    },
  });
  console.log("✅ Speaker created:", speaker3.name);

  // ==================== SPONSORS ====================

  const sponsor1 = await prisma.sponsor.create({
    data: {
      name: "Google Cloud",
      logo: "https://example.com/google-logo.png",
      description: "Cloud computing and AI solutions",
      website: "https://cloud.google.com",
      tier: "PLATINUM",
      eventId: event1.id,
    },
  });
  console.log("✅ Sponsor created:", sponsor1.name);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
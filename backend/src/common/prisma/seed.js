const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Event 1
  const event1 = await prisma.event.create({
    data: {
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

  // Event 2
  const event2 = await prisma.event.create({
    data: {
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
  // Add this in seed.js
  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz", // Use actual hash
      firstName: "Test",
      lastName: "User",
      role: "ATTENDEE",
      status: "ACTIVE",
    },
  });
  console.log("✅ Test user created:", testUser.email);
  console.log("✅ Events created!");
  console.log("Event 1:", event1.name);
  console.log("Event 2:", event2.name);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

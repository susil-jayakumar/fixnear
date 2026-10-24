// Test data: DB-la sample providers + services podradhu
// Run: npx tsx prisma/seed.js

import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const providers = [
  {
    clerkId: "seed_ravi",
    name: "Ravi Kumar",
    email: "ravi@example.com",
    category: "Electrician",
    area: "Anna Nagar",
    phone: "9000000001",
    experienceYears: 8,
    bio: "Home wiring, fan and light fitting specialist.",
    services: [
      { title: "Fan installation", price: 250, durationMins: 45 },
      { title: "Switch board repair", price: 300, durationMins: 60 },
    ],
  },
  {
    clerkId: "seed_murugan",
    name: "Murugan S",
    email: "murugan@example.com",
    category: "Plumber",
    area: "Velachery",
    phone: "9000000002",
    experienceYears: 12,
    bio: "Leak fixing, tap and pipe work.",
    services: [
      { title: "Tap repair", price: 300, durationMins: 30 },
      { title: "Pipe leak fix", price: 500, durationMins: 90 },
    ],
  },
  {
    clerkId: "seed_priya",
    name: "Priya R",
    email: "priya@example.com",
    category: "AC Technician",
    area: "Tambaram",
    phone: "9000000003",
    experienceYears: 5,
    bio: "Split and window AC service and gas refill.",
    services: [
      { title: "AC general service", price: 600, durationMins: 60 },
      { title: "Gas refill", price: 2500, durationMins: 120 },
    ],
  },
];

async function main() {
  // Pazhaya test data clear (DEV mattum! production-la idhu pannakoodadhu)
  // Order mukkiyam: child tables first, parent last (foreign keys)
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.providerProfile.deleteMany();
  await prisma.user.deleteMany({ where: { clerkId: { startsWith: "seed_" } } });

  for (const p of providers) {
    // Nested create: User + ProviderProfile + Services, oru query-la
    await prisma.user.create({
      data: {
        clerkId: p.clerkId,
        name: p.name,
        email: p.email,
        role: "PROVIDER",
        providerProfile: {
          create: {
            category: p.category,
            area: p.area,
            phone: p.phone,
            experienceYears: p.experienceYears,
            bio: p.bio,
            services: { create: p.services },
          },
        },
      },
    });
  }

  console.log(`✅ Seeded ${providers.length} providers`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

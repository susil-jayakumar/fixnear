// Demo data for FixNear: 12 providers, 3 customers, completed bookings with reviews.
// Run: npx tsx prisma/seed.js
// Safe to re-run: it only deletes rows that belong to "seed_" users.
// Real users (signed up through Clerk, clerkId starts with "user_") are never touched.

import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SEED = { startsWith: "seed_" };

const providers = [
  { key: "ravi", name: "Ravi Kumar", category: "Electrician", area: "Anna Nagar", exp: 8,
    bio: "Home wiring, fan and light fitting. Same-day visits in Anna Nagar and Kilpauk.",
    services: [["Fan installation", 250, 45], ["Switch board repair", 300, 60], ["Full house wiring check", 900, 120]] },
  { key: "senthil", name: "Senthil Nathan", category: "Electrician", area: "Velachery", exp: 15,
    bio: "Inverter, MCB and wiring work for flats and independent houses.",
    services: [["Inverter installation", 1200, 120], ["MCB replacement", 450, 45]] },
  { key: "murugan", name: "Murugan S", category: "Plumber", area: "Velachery", exp: 12,
    bio: "Leak fixing, tap and pipe work. Carries spare parts for common repairs.",
    services: [["Tap repair", 300, 30], ["Pipe leak fix", 500, 90], ["Water tank cleaning", 800, 120]] },
  { key: "abdul", name: "Abdul Rahman", category: "Plumber", area: "T. Nagar", exp: 9,
    bio: "Bathroom fittings, geyser connections and blocked drains.",
    services: [["Blocked drain clearing", 450, 60], ["Geyser connection", 600, 60]] },
  { key: "priya", name: "Priya R", category: "AC Technician", area: "Tambaram", exp: 5,
    bio: "Split and window AC service, gas refill and installation.",
    services: [["AC general service", 600, 60], ["Gas refill", 2500, 120], ["AC installation", 1500, 150]] },
  { key: "vignesh", name: "Vignesh Babu", category: "AC Technician", area: "Adyar", exp: 7,
    bio: "Service for all major AC brands. Explains the problem before starting work.",
    services: [["AC deep cleaning", 900, 90], ["AC general service", 550, 60]] },
  { key: "selvam", name: "Selvam K", category: "Carpenter", area: "Porur", exp: 20,
    bio: "Furniture repair, door alignment and modular kitchen fixes.",
    services: [["Door alignment", 350, 45], ["Furniture repair", 600, 90], ["Wardrobe hinge replacement", 400, 60]] },
  { key: "joseph", name: "Joseph Antony", category: "Carpenter", area: "Mylapore", exp: 11,
    bio: "Custom shelves and small woodwork jobs at home.",
    services: [["Wall shelf fitting", 500, 60], ["Bed repair", 700, 90]] },
  { key: "kannan", name: "Kannan P", category: "Painter", area: "Chromepet", exp: 14,
    bio: "Interior painting and touch-ups. Covers furniture and cleans up after.",
    services: [["Single room painting", 4500, 480], ["Wall touch-up", 800, 120]] },
  { key: "meena", name: "Meena Lakshmi", category: "Painter", area: "Guindy", exp: 6,
    bio: "Texture walls, stencil designs and kids' room painting.",
    services: [["Texture wall", 3500, 360], ["Wall touch-up", 700, 120]] },
  { key: "lakshmi", name: "Lakshmi Devi", category: "Cleaner", area: "Medavakkam", exp: 4,
    bio: "Home deep cleaning with own equipment. Team of two.",
    services: [["Kitchen deep cleaning", 1200, 180], ["Bathroom cleaning", 500, 60], ["Full home cleaning (2BHK)", 2800, 300]] },
  { key: "fathima", name: "Fathima B", category: "Cleaner", area: "Kodambakkam", exp: 3,
    bio: "Sofa and carpet shampooing, move-in and move-out cleaning.",
    services: [["Sofa shampooing", 900, 90], ["Move-out cleaning (1BHK)", 1800, 240]] },
];

const customers = [
  { key: "karthik", name: "Karthik R" },
  { key: "divya", name: "Divya S" },
  { key: "arjun", name: "Arjun M" },
];

// [providerKey, serviceIndex, customerKey, rating, comment, daysAgo]
const reviews = [
  ["ravi", 0, "karthik", 5, "Fixed the fan in 30 minutes and cleaned up after.", 12],
  ["ravi", 1, "divya", 4, "Good work, came about 20 minutes late.", 25],
  ["senthil", 0, "arjun", 5, "Explained the inverter setup clearly. Very professional.", 8],
  ["murugan", 0, "divya", 5, "Leak stopped completely. Fair price.", 5],
  ["murugan", 1, "karthik", 4, "Took longer than expected but the job is solid.", 30],
  ["abdul", 0, "arjun", 4, "Drain was cleared quickly.", 14],
  ["priya", 0, "karthik", 5, "AC cools much better now. Will book again.", 10],
  ["priya", 1, "arjun", 3, "Gas refill was fine, but she had to come back for a part.", 40],
  ["vignesh", 0, "divya", 5, "Very thorough cleaning, showed me the dirty filter before and after.", 6],
  ["selvam", 0, "karthik", 5, "Door closes properly for the first time in years.", 18],
  ["kannan", 1, "divya", 4, "Neat touch-up, colour matched well.", 22],
  ["lakshmi", 0, "arjun", 5, "Kitchen looks brand new. Worth it.", 3],
  ["fathima", 0, "karthik", 4, "Sofa came out clean, took a day to dry.", 16],
];

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

async function clearSeedData() {
  // Children first, parents last (foreign keys)
  const seedBooking = {
    OR: [{ customer: { clerkId: SEED } }, { provider: { user: { clerkId: SEED } } }],
  };
  await prisma.review.deleteMany({ where: { booking: seedBooking } });
  await prisma.booking.deleteMany({ where: seedBooking });
  await prisma.service.deleteMany({ where: { provider: { user: { clerkId: SEED } } } });
  await prisma.providerProfile.deleteMany({ where: { user: { clerkId: SEED } } });
  await prisma.user.deleteMany({ where: { clerkId: SEED } });
}

async function main() {
  await clearSeedData();

  const providerByKey = {};
  for (const [i, p] of providers.entries()) {
    const user = await prisma.user.create({
      data: {
        clerkId: `seed_${p.key}`,
        name: p.name,
        email: `${p.key}@example.com`,
        role: "PROVIDER",
        providerProfile: {
          create: {
            category: p.category,
            area: p.area,
            phone: `90000000${String(i + 10).padStart(2, "0")}`,
            experienceYears: p.exp,
            bio: p.bio,
            services: {
              create: p.services.map(([title, price, durationMins]) => ({ title, price, durationMins })),
            },
          },
        },
      },
      include: { providerProfile: { include: { services: true } } },
    });
    // keep services in the same order as defined above
    const profile = user.providerProfile;
    profile.services.sort((a, b) =>
      p.services.findIndex((s) => s[0] === a.title) - p.services.findIndex((s) => s[0] === b.title));
    providerByKey[p.key] = profile;
  }

  const customerByKey = {};
  for (const c of customers) {
    customerByKey[c.key] = await prisma.user.create({
      data: { clerkId: `seed_${c.key}`, name: c.name, email: `${c.key}@example.com`, role: "CUSTOMER" },
    });
  }

  for (const [pKey, sIdx, cKey, rating, comment, ago] of reviews) {
    const profile = providerByKey[pKey];
    const service = profile.services[sIdx];
    await prisma.booking.create({
      data: {
        customerId: customerByKey[cKey].id,
        providerId: profile.id,
        serviceId: service.id,
        priceAtBooking: service.price,
        scheduledAt: daysAgo(ago),
        address: "Demo address, Chennai",
        status: "COMPLETED",
        paymentStatus: "PAID",
        review: { create: { rating, comment, createdAt: daysAgo(ago - 1) } },
      },
    });
  }

  console.log(`✅ Seeded ${providers.length} providers, ${customers.length} customers, ${reviews.length} reviews`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

import Form from "next/form";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { CATEGORIES } from "@/lib/constants";

export default async function Home({ searchParams }) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : "";
  const area = typeof sp.area === "string" ? sp.area.trim() : "";

  const { userId } = await auth();
  const me = await getCurrentUser();

  const where = {};
  if (CATEGORIES.includes(category)) where.category = category;
  if (area) where.area = { contains: area, mode: "insensitive" };

  const providers = await prisma.providerProfile.findMany({
    where,
    include: { user: true, services: true },
    orderBy: { experienceYears: "desc" },
  });

  return (
    <main style={{ padding: 24 }}>
      <h1>FixNear</h1>
      <p>Find trusted local service providers near you.</p>
      {userId && !me && <p><a href="/onboarding">Finish setting up your account →</a></p>}
      {me && <p>Welcome, {me.name} ({me.role})</p>}
      {me?.role === "PROVIDER" && <p><Link href="/provider">Go to your dashboard →</Link></p>}
      {me?.role === "CUSTOMER" && <p><Link href="/bookings">My bookings →</Link></p>}

      <Form key={`${category}-${area}`} action="/" style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0" }}>
        <select name="category" defaultValue={category}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input name="area" defaultValue={area} placeholder="Area (e.g. Velachery)" />
        <button type="submit">Search</button>
        {(category || area) && <Link href="/">Clear</Link>}
      </Form>

      <h2>Providers ({providers.length})</h2>
      {providers.length === 0 ? (
        <p>No providers found. Try another area or category.</p>
      ) : (
        <ul>
          {providers.map((p) => (
            <li key={p.id}>
              <Link href={`/providers/${p.id}`}><strong>{p.user.name}</strong></Link>
              {" "}· {p.category} · {p.area} ({p.experienceYears} yrs)
              <ul>
                {p.services.map((s) => (
                  <li key={s.id}>{s.title}: ₹{s.price}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
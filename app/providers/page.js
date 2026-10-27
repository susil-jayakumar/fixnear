import Form from "next/form";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { CATEGORIES } from "@/lib/constants";

export default async function ProvidersPage({ searchParams }) {
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
    include: { user: true, services: { orderBy: { price: "asc" } } },
    orderBy: { experienceYears: "desc" },
  });

  // One query for all ratings (avoids the N+1 problem)
  const reviewRows = await prisma.review.findMany({
    where: { booking: { providerId: { in: providers.map((p) => p.id) } } },
    select: { rating: true, booking: { select: { providerId: true } } },
  });
  const ratings = {};
  for (const r of reviewRows) {
    const pid = r.booking.providerId;
    ratings[pid] ??= { sum: 0, count: 0 };
    ratings[pid].sum += r.rating;
    ratings[pid].count += 1;
  }

  const filtered = Boolean(category || area);

  return (
    <main className="wrap page">
      <section className="hero hero-compact">
        <h1>Find a provider</h1>
        <p>Search by service and area. Prices are shown up front.</p>

        {userId && !me && (
          <p className="notice">
            <Link href="/onboarding">Finish setting up your account</Link> to book or offer services.
          </p>
        )}

        <Form key={`${category}-${area}`} action="/providers" className="search" role="search">
          <select name="category" defaultValue={category} aria-label="Service type">
            <option value="">All services</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input name="area" defaultValue={area} placeholder="Your area, e.g. Velachery" aria-label="Area" />
          <button type="submit" className="btn btn-dark">Search</button>
        </Form>
      </section>

      <div className="result-bar">
        <h2>
          {filtered
            ? `${providers.length} ${providers.length === 1 ? "provider" : "providers"} found`
            : "All providers"}
        </h2>
        {filtered && <Link href="/providers">Clear filters</Link>}
      </div>

      {providers.length === 0 ? (
        <div className="empty">
          <p>
            No {category ? category.toLowerCase() + "s" : "providers"}
            {area ? ` in "${area}"` : ""} yet. Try a nearby area or another service.
          </p>
          <Link href="/providers" className="btn btn-ghost">Show all providers</Link>
        </div>
      ) : (
        <ul className="grid">
          {providers.map((p) => {
            const r = ratings[p.id];
            return (
              <li key={p.id} className="provider-card">
                <h3><Link href={`/providers/${p.id}`}>{p.user.name}</Link></h3>
                <div className="meta">
                  <span className="tag">{p.category}</span>
                  <span>{p.area}</span>
                  <span>{p.experienceYears} yrs experience</span>
                </div>
                {r ? (
                  <span className="rating">★ {(r.sum / r.count).toFixed(1)} <span className="muted">({r.count})</span></span>
                ) : (
                  <span className="rating-new">New on FixNear</span>
                )}
                {p.services.length > 0 && (
                  <ul className="rates">
                    {p.services.slice(0, 3).map((s) => (
                      <li key={s.id}><span>{s.title}</span><span className="price">₹{s.price}</span></li>
                    ))}
                  </ul>
                )}
                <Link href={`/providers/${p.id}`} className="card-link">View profile and book</Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

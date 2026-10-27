import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDateTime, stars } from "@/lib/format";

export default async function ProviderPage({ params }) {
  const { id } = await params;

  const provider = await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      user: true,
      services: { orderBy: { price: "asc" } },
    },
  });
  if (!provider) notFound();

  const stats = await prisma.review.aggregate({
    where: { booking: { providerId: id } },
    _avg: { rating: true },
    _count: true,
  });
  const avg = stats._avg.rating;
  const count = stats._count;

  const reviews = await prisma.review.findMany({
    where: { booking: { providerId: id } },
    include: { booking: { include: { customer: true, service: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <main className="wrap page">
      <Link href="/providers" className="back">← All providers</Link>

      <div className="two-col">
        <div>
          <div className="profile-head">
            <h1>{provider.user.name}</h1>
            <div className="meta">
              <span className="tag">{provider.category}</span>
              <span>{provider.area}</span>
              <span>{provider.experienceYears} yrs experience</span>
            </div>
            {count > 0 ? (
              <span className="rating">
                ★ {avg.toFixed(1)} <span className="muted">from {count} review{count === 1 ? "" : "s"}</span>
              </span>
            ) : (
              <span className="rating-new">New on FixNear, no reviews yet</span>
            )}
            {provider.bio && <p>{provider.bio}</p>}
          </div>

          <h2>Reviews</h2>
          {reviews.length === 0 ? (
            <div className="empty"><p>Reviews appear here after customers complete a booking.</p></div>
          ) : (
            <ul>
              {reviews.map((r) => (
                <li key={r.id} className="review">
                  <span className="stars" aria-label={`${r.rating} out of 5`}>{stars(r.rating)}</span>
                  <div><strong>{r.booking.customer.name}</strong> <span className="muted">for {r.booking.service.title}</span></div>
                  {r.comment && <p>{r.comment}</p>}
                  <small className="muted">{formatDateTime(r.createdAt)}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="panel">
          <h2>Services and prices</h2>
          {provider.services.length === 0 ? (
            <p className="muted">This provider hasn't listed any services yet.</p>
          ) : (
            <ul>
              {provider.services.map((s) => (
                <li key={s.id} className="service-row">
                  <span><strong>{s.title}</strong> <span className="price">₹{s.price}</span></span>
                  <span className="muted">About {s.durationMins} mins</span>
                  <Link href={`/book/${s.id}`} className="btn btn-primary btn-sm">Book</Link>
                </li>
              ))}
            </ul>
          )}
          <p className="muted" style={{ marginTop: "1rem", fontSize: "0.88rem" }}>
            The provider&apos;s phone number is shared once they accept your booking.
          </p>
        </aside>
      </div>
    </main>
  );
}

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
  return (
    <main style={{ padding: 24 }}>
      <p><Link href="/">← All providers</Link></p>
      <h1>{provider.user.name}</h1>
      <p>{provider.category} · {provider.area} · {provider.experienceYears} yrs experience</p>
      {ratings[provider.id]
  ? ` · ⭐ ${(ratings[provider.id].sum / ratings[provider.id].count).toFixed(1)} (${ratings[provider.id].count})`
  : " · New"}
      {provider.bio && <p>{provider.bio}</p>}
      <p>{count > 0 ? `⭐ ${avg.toFixed(1)} (${count} review${count === 1 ? "" : "s"})` : "No reviews yet"}</p>
      <h2>Services</h2>
      {provider.services.length === 0 ? (
        <p>No services listed yet.</p>
      ) : (
        <ul>
          {provider.services.map((s) => (
            <li key={s.id}>
  {s.title}: ₹{s.price} · {s.durationMins} mins{" "}
  <Link href={`/book/${s.id}`}>Book</Link>
</li>
          ))}
        </ul>
      )}
      <h2>Reviews</h2>
{reviews.length === 0 ? (
  <p>No reviews yet.</p>
) : (
  <ul>
    {reviews.map((r) => (
      <li key={r.id} style={{ marginBottom: 10 }}>
        {stars(r.rating)} · {r.booking.customer.name} · {r.booking.service.title}
        <br />
        {r.comment && <>{r.comment}<br /></>}
        <small>{formatDateTime(r.createdAt)}</small>
      </li>
    ))}
  </ul>
)}
    </main>
  );
}
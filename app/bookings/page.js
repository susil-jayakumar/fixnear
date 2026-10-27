import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { formatDateTime, stars } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import ActionButton from "./ActionButton";
import ReviewForm from "./ReviewForm";

export default async function MyBookingsPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/onboarding");

  const bookings = await prisma.booking.findMany({
    where: { customerId: me.id },
    include: { service: true, provider: { include: { user: true } }, review: true },
    orderBy: { scheduledAt: "asc" },
  });

  return (
    <main className="wrap page">
      <h1>My bookings</h1>

      {bookings.length === 0 ? (
        <div className="empty" style={{ marginTop: "1.5rem" }}>
          <p>You haven&apos;t booked anything yet.</p>
          <Link href="/providers" className="btn btn-primary">Find a provider</Link>
        </div>
      ) : (
        <ul className="tickets" style={{ marginTop: "1.5rem" }}>
          {bookings.map((b) => {
            const showPhone = b.status === "ACCEPTED" || b.status === "COMPLETED";
            return (
              <li key={b.id} className="ticket" data-status={b.status}>
                <div className="ticket-top">
                  <div>
                    <h3>{b.service.title}</h3>
                    <span className="muted">with <Link href={`/providers/${b.providerId}`}>{b.provider.user.name}</Link></span>
                  </div>
                  <div className="badges">
                    <StatusBadge value={b.status} />
                    {b.status === "COMPLETED" && <StatusBadge value={b.paymentStatus} />}
                  </div>
                </div>

                <dl>
                  <dt>When</dt><dd>{formatDateTime(b.scheduledAt)}</dd>
                  <dt>Price</dt><dd className="price">₹{b.priceAtBooking}</dd>
                  <dt>Phone</dt>
                  <dd>{showPhone ? <a href={`tel:${b.provider.phone}`}>{b.provider.phone}</a> : <span className="muted">Shared once the provider accepts</span>}</dd>
                </dl>

                {b.status === "PENDING" && (
                  <div className="actions">
                    <ActionButton bookingId={b.id} action="cancel" label="Cancel request" variant="danger" />
                  </div>
                )}

                {b.status === "COMPLETED" && (
                  b.review ? (
                    <p className="review-form">
                      Your review: <span className="stars">{stars(b.review.rating)}</span>
                      {b.review.comment && <> {b.review.comment}</>}
                    </p>
                  ) : (
                    <ReviewForm bookingId={b.id} />
                  )
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

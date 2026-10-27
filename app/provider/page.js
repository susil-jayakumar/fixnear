import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { formatDateTime } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import ActionButton from "@/app/bookings/ActionButton";
import { markPaid } from "@/app/bookings/actions";
import ServiceForm from "./ServiceForm";
import { deleteService } from "./actions";

export default async function ProviderDashboard() {
  const me = await getCurrentUser();
  if (!me) redirect("/onboarding");
  if (me.role !== "PROVIDER") redirect("/");
  if (!me.providerProfile) redirect("/provider/setup");

  const p = me.providerProfile;
  const services = await prisma.service.findMany({
    where: { providerId: p.id },
    orderBy: { price: "asc" },
  });
  const bookings = await prisma.booking.findMany({
    where: { providerId: p.id },
    include: { service: true, customer: true },
    orderBy: { scheduledAt: "asc" },
  });

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <main className="wrap page">
      <h1>Your dashboard</h1>
      <div className="meta" style={{ marginTop: "0.6rem" }}>
        <span className="tag">{p.category}</span>
        <span>{p.area}</span>
        <span>{p.experienceYears} yrs experience</span>
        <span>{p.phone}</span>
      </div>

      <h2>
        Booking requests
        {pendingCount > 0 && <span className="muted" style={{ fontSize: "1rem", fontWeight: 400 }}> ({pendingCount} waiting for you)</span>}
      </h2>
      {bookings.length === 0 ? (
        <div className="empty"><p>No requests yet. Customers can book you once you&apos;ve added services below.</p></div>
      ) : (
        <ul className="tickets">
          {bookings.map((b) => (
            <li key={b.id} className="ticket" data-status={b.status}>
              <div className="ticket-top">
                <div>
                  <h3>{b.service.title}</h3>
                  <span className="muted">for {b.customer.name}</span>
                </div>
                <div className="badges">
                  <StatusBadge value={b.status} />
                  {b.status === "COMPLETED" && <StatusBadge value={b.paymentStatus} />}
                </div>
              </div>

              <dl>
                <dt>When</dt><dd>{formatDateTime(b.scheduledAt)}</dd>
                <dt>Price</dt><dd className="price">₹{b.priceAtBooking}</dd>
                <dt>Address</dt><dd>{b.address}</dd>
                {b.note && <><dt>Note</dt><dd>{b.note}</dd></>}
              </dl>

              <div className="actions">
                {b.status === "PENDING" && (
                  <>
                    <ActionButton bookingId={b.id} action="accept" label="Accept" variant="primary" />
                    <ActionButton bookingId={b.id} action="reject" label="Decline" variant="danger" />
                  </>
                )}
                {b.status === "ACCEPTED" && (
                  <ActionButton bookingId={b.id} action="complete" label="Mark job completed" variant="dark" />
                )}
                {b.status === "COMPLETED" && b.paymentStatus === "UNPAID" && (
                  <form action={markPaid} className="inline-form">
                    <input type="hidden" name="bookingId" value={b.id} />
                    <button type="submit" className="btn btn-sm btn-ghost">Mark as paid</button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="two-col" style={{ marginTop: "1rem" }}>
        <section>
          <h2>Your services</h2>
          {services.length === 0 ? (
            <div className="empty"><p>Add your first service so customers can book you.</p></div>
          ) : (
            <ul className="service-list">
              {services.map((s) => (
                <li key={s.id}>
                  <span><strong>{s.title}</strong> <span className="muted">about {s.durationMins} mins</span></span>
                  <span style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <span className="price">₹{s.price}</span>
                    <form action={deleteService} className="inline-form">
                      <input type="hidden" name="id" value={s.id} />
                      <button type="submit" className="btn btn-sm btn-danger">Remove</button>
                    </form>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel" style={{ marginTop: "2.25rem" }}>
          <h2>Add a service</h2>
          <ServiceForm />
        </section>
      </div>
    </main>
  );
}

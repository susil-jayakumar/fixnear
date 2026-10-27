import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import ServiceForm from "./ServiceForm";
import { deleteService } from "./actions";
import { formatDateTime } from "@/lib/format";
import ActionButton from "@/app/bookings/ActionButton";
import { markPaid } from "@/app/bookings/actions";

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

  return (
    <main style={{ padding: 24 }}>
      <h1>Provider dashboard</h1>
      <p>{me.name} · {p.category} · {p.area} · {p.experienceYears} yrs · {p.phone}</p>
      <h2>Incoming requests ({bookings.length})</h2>
{bookings.length === 0 ? (
  <p>No booking requests yet.</p>
) : (
  <ul>
    {bookings.map((b) => (
      <li key={b.id} style={{ marginBottom: 14 }}>
        <strong>{b.service.title}</strong> for {b.customer.name}
        <br />
        {formatDateTime(b.scheduledAt)} · ₹{b.priceAtBooking} · <b>{b.status}</b> · {b.paymentStatus}
        <br />
        Address: {b.address}
        {b.note && <><br />Note: {b.note}</>}
        <div style={{ marginTop: 6 }}>
          {b.status === "PENDING" && (
            <>
              <ActionButton bookingId={b.id} action="accept" label="Accept" />
              <ActionButton bookingId={b.id} action="reject" label="Reject" />
            </>
          )}
          {b.status === "ACCEPTED" && (
            <ActionButton bookingId={b.id} action="complete" label="Mark completed" />
          )}
          {b.status === "COMPLETED" && b.paymentStatus === "UNPAID" && (
            <form action={markPaid} style={{ display: "inline" }}>
              <input type="hidden" name="bookingId" value={b.id} />
              <button type="submit">Mark paid</button>
            </form>
          )}
        </div>
      </li>
    ))}
  </ul>
)}
      <h2>My services ({services.length})</h2>
      {services.length === 0 ? (
        <p>No services yet. Add your first one below.</p>
      ) : (
        <ul>
          {services.map((s) => (
            <li key={s.id} style={{ display: "flex", gap: 12, alignItems: "center", margin: "6px 0" }}>
              <span>{s.title}: ₹{s.price} · {s.durationMins} mins</span>
              <form action={deleteService}>
                <input type="hidden" name="id" value={s.id} />
                <button type="submit">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <h2>Add a service</h2>
      <ServiceForm />
    </main>
  );
}
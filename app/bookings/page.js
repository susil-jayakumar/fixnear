import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { formatDateTime } from "@/lib/format";
import ActionButton from "./ActionButton";

export default async function MyBookingsPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/onboarding");

  const bookings = await prisma.booking.findMany({
    where: { customerId: me.id },
    include: { service: true, provider: { include: { user: true } } },
    orderBy: { scheduledAt: "asc" },
  });

  return (
    <main style={{ padding: 24 }}>
      <p><Link href="/">← Find providers</Link></p>
      <h1>My bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet. <Link href="/">Find a provider</Link> to book your first service.</p>
      ) : (
        <ul>
          {bookings.map((b) => {
            const showPhone = b.status === "ACCEPTED" || b.status === "COMPLETED";
            return (
              <li key={b.id} style={{ marginBottom: 12 }}>
                <strong>{b.service.title}</strong> with {b.provider.user.name}
                <br />
                {formatDateTime(b.scheduledAt)} · ₹{b.priceAtBooking} · <b>{b.status}</b> · {b.paymentStatus}
                <br />
                {showPhone ? `Phone: ${b.provider.phone}` : "Phone number is shared after the provider accepts"}
                {b.status === "PENDING" && (
  <div style={{ marginTop: 6 }}>
    <ActionButton bookingId={b.id} action="cancel" label="Cancel request" />
  </div>
)}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import BookingForm from "./BookingForm";

export default async function BookPage({ params }) {
  const { serviceId } = await params;
  const me = await getCurrentUser();
  if (!me) redirect("/onboarding");

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { provider: { include: { user: true } } },
  });
  if (!service) notFound();

  const p = service.provider;

  return (
    <main className="wrap page">
      <Link href={`/providers/${p.id}`} className="back">← Back to {p.user.name}</Link>

      <div className="two-col">
        <div>
          <h1>Book {service.title.toLowerCase()}</h1>
          <p className="muted" style={{ marginTop: "0.5rem" }}>
            Pick a time and tell {p.user.name} where to come. They&apos;ll accept or decline your request.
          </p>
          <div style={{ marginTop: "1.5rem" }}>
            {me.role === "CUSTOMER" ? (
              <BookingForm serviceId={service.id} />
            ) : (
              <div className="empty"><p>Bookings are made from customer accounts. Sign in with a customer account to book this service.</p></div>
            )}
          </div>
        </div>

        <aside className="panel">
          <h2>Summary</h2>
          <dl className="summary">
            <dt>Service</dt><dd>{service.title}</dd>
            <dt>Provider</dt><dd>{p.user.name}</dd>
            <dt>Area</dt><dd>{p.area}</dd>
            <dt>Takes</dt><dd>About {service.durationMins} mins</dd>
            <dt>Price</dt><dd className="price">₹{service.price}</dd>
          </dl>
        </aside>
      </div>
    </main>
  );
}

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
    <main style={{ padding: 24 }}>
      <p><Link href={`/providers/${p.id}`}>← Back to {p.user.name}</Link></p>
      <h1>Book: {service.title}</h1>
      <p>{p.user.name} · {p.category} · {p.area}</p>
      <p>Price: ₹{service.price} · About {service.durationMins} mins</p>

      {me.role === "CUSTOMER" ? (
        <BookingForm serviceId={service.id} />
      ) : (
        <p>Only customer accounts can book. Sign in with a customer account to book.</p>
      )}
    </main>
  );
}
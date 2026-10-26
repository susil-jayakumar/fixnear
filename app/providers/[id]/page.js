import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

  return (
    <main style={{ padding: 24 }}>
      <p><Link href="/">← All providers</Link></p>
      <h1>{provider.user.name}</h1>
      <p>{provider.category} · {provider.area} · {provider.experienceYears} yrs experience</p>
      {provider.bio && <p>{provider.bio}</p>}

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
    </main>
  );
}
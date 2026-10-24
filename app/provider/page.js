import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
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

  return (
    <main style={{ padding: 24 }}>
      <h1>Provider dashboard</h1>
      <p>{me.name} · {p.category} · {p.area} · {p.experienceYears} yrs · {p.phone}</p>

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
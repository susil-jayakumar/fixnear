import {prisma} from "@/lib/prisma";
export default async function Home() {
  const providers = await prisma.providerProfile.findMany({
    include: { user: true,services: true },
    orderBy: { experienceYears: "desc"},
  });
  return (
    <main style={{padding:24}}>
      <h1>FixNear</h1>
      <p>Find trusted local service providers near you.</p>
      <h2>Providers ({providers.length})</h2>
      <ul>
        {providers.map((p)=>(
          <li key={p.id}>
            <strong>{p.user.name}</strong> . {p.category} . {p.area} ({p.experienceYears} yrs)
            <ul>
              {p.services.map((s)=>(
                <li key={s.id}>{s.title}: ₹{s.price}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  )
}
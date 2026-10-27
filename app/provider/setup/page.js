import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileForm from "./ProfileForm";

export default async function ProviderSetupPage() {
  const { userId } = await auth();
  const me = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { providerProfile: true },
  });

  if (!me) redirect("/onboarding");
  if (me.role !== "PROVIDER") redirect("/");
  if (me.providerProfile) redirect("/provider");

  return (
    <main className="wrap page">
      <h1>Set up your provider profile</h1>
      <p className="muted" style={{ marginTop: "0.5rem" }}>Customers see this when they search for help in your area.</p>
      <div style={{ marginTop: "1.5rem" }}>
        <ProfileForm />
      </div>
    </main>
  );
}

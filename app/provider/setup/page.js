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
  if (me.providerProfile) redirect("/");

  return (
    <main style={{ padding: 24 }}>
      <h1>Set up your provider profile</h1>
      <p>Customers will see this when they search on FixNear.</p>
      <ProfileForm />
    </main>
  );
}

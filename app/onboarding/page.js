import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { chooseRole } from "./actions";

export default async function OnboardingPage() {
  const { userId } = await auth();
  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (existing) redirect("/");

  return (
    <main style={{ padding: 24 }}>
      <h1>Welcome to FixNear</h1>
      <p>How will you use FixNear?</p>
      <form action={chooseRole} style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button type="submit" name="role" value="CUSTOMER">I need a service</button>
        <button type="submit" name="role" value="PROVIDER">I provide services</button>
      </form>
    </main>
  );
}
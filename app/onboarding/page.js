import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { chooseRole } from "./actions";

export default async function OnboardingPage() {
  const { userId } = await auth();
  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (existing) redirect("/");

  return (
    <main className="wrap page">
      <h1>Welcome to FixNear</h1>
      <p className="muted" style={{ marginTop: "0.5rem" }}>How will you use FixNear? You can&apos;t change this later.</p>
      <form action={chooseRole} className="choices">
        <button type="submit" name="role" value="CUSTOMER" className="choice">
          <strong>I need a service</strong>
          <span className="muted">Find local providers and book them.</span>
        </button>
        <button type="submit" name="role" value="PROVIDER" className="choice">
          <strong>I provide services</strong>
          <span className="muted">List your services and get booking requests.</span>
        </button>
      </form>
    </main>
  );
}

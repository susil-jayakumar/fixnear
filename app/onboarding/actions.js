"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function chooseRole(formData) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const role = formData.get("role");
  if (role !== "CUSTOMER" && role !== "PROVIDER") {
    throw new Error("Invalid role");
  }

  const user = await currentUser();

  await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      name: user.fullName ?? user.firstName ?? "User",
      email: user.primaryEmailAddress?.emailAddress ?? "",
      role,
    },
  });

  redirect(role === "PROVIDER" ? "/provider/setup" : "/");
}
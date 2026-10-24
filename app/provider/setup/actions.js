"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/constants";

export async function saveProfile(prevState, formData) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const me = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!me || me.role !== "PROVIDER") redirect("/");

  const category = String(formData.get("category") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const expRaw = String(formData.get("experienceYears") ?? "").trim();
  const experienceYears = Number(expRaw);

  const errors = {};
  if (!CATEGORIES.includes(category)) errors.category = "Choose a category";
  if (area.length < 2) errors.area = "Enter your area";
  if (!/^[6-9]\d{9}$/.test(phone)) errors.phone = "Enter a valid 10-digit mobile number";
  if (expRaw === "" || !Number.isInteger(experienceYears) || experienceYears < 0 || experienceYears > 60) {
    errors.experienceYears = "Enter years between 0 and 60";
  }
  if (bio.length > 300) errors.bio = "Keep it under 300 characters";

  if (Object.keys(errors).length > 0) {
    return { errors, values: { category, area, phone, bio, experienceYears: expRaw } };
  }

  await prisma.providerProfile.upsert({
    where: { userId: me.id },
    update: { category, area, phone, bio: bio || null, experienceYears },
    create: { userId: me.id, category, area, phone, bio: bio || null, experienceYears },
  });

  redirect("/provider");
}
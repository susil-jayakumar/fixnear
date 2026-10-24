"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

async function requireProvider() {
  const me = await getCurrentUser();
  if (!me || me.role !== "PROVIDER" || !me.providerProfile) redirect("/");
  return me.providerProfile;
}

export async function addService(prevState, formData) {
  const profile = await requireProvider();

  const title = String(formData.get("title") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const durRaw = String(formData.get("durationMins") ?? "").trim();
  const price = Number(priceRaw);
  const durationMins = Number(durRaw);

  const errors = {};
  if (title.length < 3 || title.length > 60) errors.title = "Title must be 3 to 60 characters";
  if (priceRaw === "" || !Number.isInteger(price) || price < 50 || price > 100000) {
    errors.price = "Price must be ₹50 to ₹1,00,000 (whole rupees)";
  }
  if (durRaw === "" || !Number.isInteger(durationMins) || durationMins < 15 || durationMins > 600) {
    errors.durationMins = "Duration must be 15 to 600 minutes";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, values: { title, price: priceRaw, durationMins: durRaw } };
  }

  await prisma.service.create({
    data: { providerId: profile.id, title, price, durationMins },
  });

  revalidatePath("/provider");
  revalidatePath("/");
  return { ok: true, errors: {}, values: {} };
}

export async function deleteService(formData) {
  const profile = await requireProvider();
  const id = String(formData.get("id") ?? "");

  await prisma.service.deleteMany({
    where: { id, providerId: profile.id },
  });

  revalidatePath("/provider");
  revalidatePath("/");
}
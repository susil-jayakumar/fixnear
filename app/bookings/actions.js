"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { TRANSITIONS } from "@/lib/booking-rules";

export async function updateBookingStatus(formData) {
  const me = await getCurrentUser();
  if (!me) redirect("/");
  if (me.role === "PROVIDER" && !me.providerProfile) redirect("/provider/setup");

  const bookingId = String(formData.get("bookingId") ?? "");
  const action = String(formData.get("action") ?? "");

  const rule = TRANSITIONS[me.role]?.[action];
  if (!rule) throw new Error("Action not allowed");

  const owner =
    me.role === "PROVIDER"
      ? { providerId: me.providerProfile.id }
      : { customerId: me.id };

  await prisma.booking.updateMany({
    where: { id: bookingId, ...owner, status: { in: rule.from } },
    data: { status: rule.to },
  });

  revalidatePath("/bookings");
  revalidatePath("/provider");
}

export async function markPaid(formData) {
  const me = await getCurrentUser();
  if (!me || me.role !== "PROVIDER" || !me.providerProfile) redirect("/");

  const bookingId = String(formData.get("bookingId") ?? "");

  await prisma.booking.updateMany({
    where: {
      id: bookingId,
      providerId: me.providerProfile.id,
      status: "COMPLETED",
      paymentStatus: "UNPAID",
    },
    data: { paymentStatus: "PAID" },
  });

  revalidatePath("/bookings");
  revalidatePath("/provider");
}
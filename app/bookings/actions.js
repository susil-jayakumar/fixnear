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
export async function addReview(prevState, formData) {
  const me = await getCurrentUser();
  if (!me || me.role !== "CUSTOMER") redirect("/");

  const bookingId = String(formData.get("bookingId") ?? "");
  const ratingRaw = String(formData.get("rating") ?? "");
  const rating = Number(ratingRaw);
  const comment = String(formData.get("comment") ?? "").trim();

  const errors = {};
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = "Choose a rating from 1 to 5";
  if (comment.length > 500) errors.comment = "Keep it under 500 characters";
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, values: { rating: ratingRaw, comment } };
  }

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId: me.id, status: "COMPLETED" },
  });
  if (!booking) {
    return { ok: false, errors: { form: "You can only review your own completed bookings." }, values: {} };
  }

  try {
    await prisma.review.create({
      data: { bookingId, rating, comment: comment || null },
    });
  } catch (err) {
    if (err.code === "P2002") {
      return { ok: false, errors: { form: "You've already reviewed this booking." }, values: {} };
    }
    throw err;
  }

  revalidatePath("/bookings");
  revalidatePath(`/providers/${booking.providerId}`);
  revalidatePath("/");
  return { ok: true, errors: {}, values: {} };
}
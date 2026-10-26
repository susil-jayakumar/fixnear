"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function createBooking(prevState, formData) {
  const me = await getCurrentUser();
  if (!me) redirect("/onboarding");
  if (me.role !== "CUSTOMER") {
    return { errors: { form: "Only customer accounts can book services." }, values: {} };
  }

  const serviceId = String(formData.get("serviceId") ?? "");
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return { errors: { form: "This service no longer exists." }, values: {} };
  }

  const whenRaw = String(formData.get("scheduledAt") ?? "");
  const address = String(formData.get("address") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  const scheduledAt = new Date(`${whenRaw}:00+05:30`);
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;

  const errors = {};
  if (!whenRaw || isNaN(scheduledAt.getTime())) {
    errors.scheduledAt = "Pick a date and time";
  } else if (scheduledAt.getTime() < now + HOUR) {
    errors.scheduledAt = "Pick a time at least 1 hour from now";
  } else if (scheduledAt.getTime() > now + 60 * 24 * HOUR) {
    errors.scheduledAt = "Pick a date within the next 60 days";
  }
  if (address.length < 10 || address.length > 200) {
    errors.address = "Enter a full address (10 to 200 characters)";
  }
  if (note.length > 300) errors.note = "Keep the note under 300 characters";

  if (Object.keys(errors).length > 0) {
    return { errors, values: { scheduledAt: whenRaw, address, note } };
  }

  await prisma.booking.create({
    data: {
      customerId: me.id,
      providerId: service.providerId,
      serviceId: service.id,
      priceAtBooking: service.price,
      scheduledAt,
      address,
      note: note || null,
    },
  });

  redirect("/bookings");
}
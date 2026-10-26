"use client";

import { useActionState } from "react";
import { createBooking } from "./actions";

const errStyle = { color: "tomato", fontSize: 14, margin: 0 };

export default function BookingForm({ serviceId }) {
  const [state, formAction, pending] = useActionState(createBooking, { errors: {}, values: {} });
  const v = state.values;
  const e = state.errors;

  return (
    <form action={formAction} style={{ display: "grid", gap: 12, maxWidth: 420, marginTop: 16 }}>
      {e.form && <p style={errStyle}>{e.form}</p>}
      <input type="hidden" name="serviceId" value={serviceId} />

      <label>
        Date and time
        <input name="scheduledAt" type="datetime-local" defaultValue={v.scheduledAt ?? ""} required />
      </label>
      {e.scheduledAt && <p style={errStyle}>{e.scheduledAt}</p>}

      <label>
        Address
        <textarea name="address" rows={3} defaultValue={v.address ?? ""} placeholder="House no, street, area, city" required />
      </label>
      {e.address && <p style={errStyle}>{e.address}</p>}

      <label>
        Note for the provider (optional)
        <textarea name="note" rows={2} defaultValue={v.note ?? ""} placeholder="e.g. Kitchen tap leaking" />
      </label>
      {e.note && <p style={errStyle}>{e.note}</p>}

      <button type="submit" disabled={pending}>
        {pending ? "Booking..." : "Request booking"}
      </button>
    </form>
  );
}
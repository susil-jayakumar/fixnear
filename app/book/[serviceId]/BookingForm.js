"use client";

import { useActionState } from "react";
import { createBooking } from "./actions";

export default function BookingForm({ serviceId }) {
  const [state, formAction, pending] = useActionState(createBooking, { errors: {}, values: {} });
  const v = state.values;
  const e = state.errors;

  return (
    <form action={formAction} className="form">
      {e.form && <p className="form-error">{e.form}</p>}
      <input type="hidden" name="serviceId" value={serviceId} />

      <label className="field">
        Date and time
        <input name="scheduledAt" type="datetime-local" defaultValue={v.scheduledAt ?? ""} required />
        {e.scheduledAt && <span className="field-error">{e.scheduledAt}</span>}
      </label>

      <label className="field">
        Address
        <textarea name="address" rows={3} defaultValue={v.address ?? ""} placeholder="House no, street, area, city" required />
        {e.address && <span className="field-error">{e.address}</span>}
      </label>

      <label className="field">
        Note for the provider <small>Optional</small>
        <textarea name="note" rows={2} defaultValue={v.note ?? ""} placeholder="e.g. Kitchen tap is leaking" />
        {e.note && <span className="field-error">{e.note}</span>}
      </label>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Sending request..." : "Send booking request"}
      </button>
    </form>
  );
}

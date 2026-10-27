"use client";

import { useActionState } from "react";
import { addService } from "./actions";

export default function ServiceForm() {
  const [state, formAction, pending] = useActionState(addService, { ok: false, errors: {}, values: {} });
  const v = state.values;
  const e = state.errors;

  return (
    <form action={formAction} className="form">
      <label className="field">
        Service name
        <input name="title" defaultValue={v.title ?? ""} placeholder="e.g. Fan installation" required />
        {e.title && <span className="field-error">{e.title}</span>}
      </label>

      <label className="field">
        Price in rupees
        <input name="price" type="number" inputMode="numeric" defaultValue={v.price ?? ""} required />
        {e.price && <span className="field-error">{e.price}</span>}
      </label>

      <label className="field">
        Time it takes, in minutes
        <input name="durationMins" type="number" inputMode="numeric" defaultValue={v.durationMins ?? ""} required />
        {e.durationMins && <span className="field-error">{e.durationMins}</span>}
      </label>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Adding..." : "Add service"}
      </button>
      {state.ok && <p className="success">Service added.</p>}
    </form>
  );
}

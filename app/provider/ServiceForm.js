"use client";

import { useActionState } from "react";
import { addService } from "./actions";

const errStyle = { color: "tomato", fontSize: 14, margin: 0 };

export default function ServiceForm() {
  const [state, formAction, pending] = useActionState(addService, { ok: false, errors: {}, values: {} });
  const v = state.values;
  const e = state.errors;

  return (
    <form action={formAction} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
      <label>
        Service title
        <input name="title" defaultValue={v.title ?? ""} placeholder="e.g. Fan installation" required />
      </label>
      {e.title && <p style={errStyle}>{e.title}</p>}

      <label>
        Price (₹)
        <input name="price" type="number" defaultValue={v.price ?? ""} required />
      </label>
      {e.price && <p style={errStyle}>{e.price}</p>}

      <label>
        Duration (minutes)
        <input name="durationMins" type="number" defaultValue={v.durationMins ?? ""} required />
      </label>
      {e.durationMins && <p style={errStyle}>{e.durationMins}</p>}

      <button type="submit" disabled={pending}>
        {pending ? "Adding..." : "Add service"}
      </button>
      {state.ok && <p style={{ color: "limegreen", margin: 0 }}>Service added ✓</p>}
    </form>
  );
}
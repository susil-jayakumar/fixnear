"use client";

import { useActionState } from "react";
import { saveProfile } from "./actions";
import { CATEGORIES } from "@/lib/constants";

const errStyle = { color: "tomato", fontSize: 14, margin: 0 };

export default function ProfileForm() {
  const [state, formAction, pending] = useActionState(saveProfile, { errors: {}, values: {} });
  const v = state.values;
  const e = state.errors;

  return (
    <form action={formAction} style={{ display: "grid", gap: 12, maxWidth: 420, marginTop: 16 }}>
      <label>
        Category
        <select name="category" defaultValue={v.category ?? ""} required>
          <option value="" disabled>Select a category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      {e.category && <p style={errStyle}>{e.category}</p>}

      <label>
        Area
        <input name="area" defaultValue={v.area ?? ""} placeholder="e.g. Velachery" required />
      </label>
      {e.area && <p style={errStyle}>{e.area}</p>}

      <label>
        Mobile number
        <input name="phone" defaultValue={v.phone ?? ""} placeholder="10-digit mobile" required />
      </label>
      {e.phone && <p style={errStyle}>{e.phone}</p>}

      <label>
        Experience (years)
        <input name="experienceYears" type="number" min="0" max="60" defaultValue={v.experienceYears ?? ""} required />
      </label>
      {e.experienceYears && <p style={errStyle}>{e.experienceYears}</p>}

      <label>
        About you (optional)
        <textarea name="bio" defaultValue={v.bio ?? ""} rows={3} maxLength={300} />
      </label>
      {e.bio && <p style={errStyle}>{e.bio}</p>}

      <button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
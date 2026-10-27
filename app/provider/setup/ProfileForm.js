"use client";

import { useActionState } from "react";
import { saveProfile } from "./actions";
import { CATEGORIES } from "@/lib/constants";

export default function ProfileForm() {
  const [state, formAction, pending] = useActionState(saveProfile, { errors: {}, values: {} });
  const v = state.values;
  const e = state.errors;

  return (
    <form action={formAction} className="form">
      <label className="field">
        What do you do?
        <select name="category" defaultValue={v.category ?? ""} required>
          <option value="" disabled>Choose a service type</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {e.category && <span className="field-error">{e.category}</span>}
      </label>

      <label className="field">
        Area you work in
        <input name="area" defaultValue={v.area ?? ""} placeholder="e.g. Velachery" required />
        {e.area && <span className="field-error">{e.area}</span>}
      </label>

      <label className="field">
        Mobile number <small>Shared only with customers whose booking you accept</small>
        <input name="phone" inputMode="numeric" defaultValue={v.phone ?? ""} placeholder="10-digit mobile" required />
        {e.phone && <span className="field-error">{e.phone}</span>}
      </label>

      <label className="field">
        Years of experience
        <input name="experienceYears" type="number" min="0" max="60" defaultValue={v.experienceYears ?? ""} required />
        {e.experienceYears && <span className="field-error">{e.experienceYears}</span>}
      </label>

      <label className="field">
        About you <small>Optional</small>
        <textarea name="bio" defaultValue={v.bio ?? ""} rows={3} maxLength={300} placeholder="What kind of jobs do you take on?" />
        {e.bio && <span className="field-error">{e.bio}</span>}
      </label>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { addReview } from "./actions";

const errStyle = { color: "tomato", fontSize: 14, margin: 0 };

export default function ReviewForm({ bookingId }) {
  const [state, formAction, pending] = useActionState(addReview, { ok: false, errors: {}, values: {} });
  const v = state.values;
  const e = state.errors;

  if (state.ok) return <p style={{ color: "limegreen" }}>Thanks for your review ✓</p>;

  return (
    <form action={formAction} style={{ display: "grid", gap: 8, maxWidth: 380, marginTop: 6 }}>
      {e.form && <p style={errStyle}>{e.form}</p>}
      <input type="hidden" name="bookingId" value={bookingId} />
      <label>
        Rating{" "}
        <select name="rating" defaultValue={v.rating ?? ""} required>
          <option value="" disabled>Choose</option>
          <option value="5">★★★★★ Excellent</option>
          <option value="4">★★★★☆ Good</option>
          <option value="3">★★★☆☆ Okay</option>
          <option value="2">★★☆☆☆ Poor</option>
          <option value="1">★☆☆☆☆ Bad</option>
        </select>
      </label>
      {e.rating && <p style={errStyle}>{e.rating}</p>}
      <textarea name="comment" rows={2} maxLength={500} defaultValue={v.comment ?? ""} placeholder="How was the service? (optional)" />
      {e.comment && <p style={errStyle}>{e.comment}</p>}
      <button type="submit" disabled={pending}>{pending ? "Submitting..." : "Submit review"}</button>
    </form>
  );
}
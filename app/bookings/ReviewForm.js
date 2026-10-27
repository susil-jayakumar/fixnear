"use client";

import { useActionState } from "react";
import { addReview } from "./actions";

export default function ReviewForm({ bookingId }) {
  const [state, formAction, pending] = useActionState(addReview, { ok: false, errors: {}, values: {} });
  const v = state.values;
  const e = state.errors;

  if (state.ok) return <p className="review-form success">Thanks, your review is posted.</p>;

  return (
    <form action={formAction} className="form review-form">
      <h3>How did it go?</h3>
      {e.form && <p className="form-error">{e.form}</p>}
      <input type="hidden" name="bookingId" value={bookingId} />
      <label className="field">
        Rating
        <select name="rating" defaultValue={v.rating ?? ""} required>
          <option value="" disabled>Choose a rating</option>
          <option value="5">★★★★★ Excellent</option>
          <option value="4">★★★★☆ Good</option>
          <option value="3">★★★☆☆ Okay</option>
          <option value="2">★★☆☆☆ Poor</option>
          <option value="1">★☆☆☆☆ Bad</option>
        </select>
        {e.rating && <span className="field-error">{e.rating}</span>}
      </label>
      <label className="field">
        Comment <small>Optional</small>
        <textarea name="comment" rows={2} maxLength={500} defaultValue={v.comment ?? ""} placeholder="Was the work neat? Did they arrive on time?" />
        {e.comment && <span className="field-error">{e.comment}</span>}
      </label>
      <button type="submit" className="btn btn-dark" disabled={pending}>{pending ? "Posting..." : "Post review"}</button>
    </form>
  );
}

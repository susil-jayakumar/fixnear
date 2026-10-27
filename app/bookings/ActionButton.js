import { updateBookingStatus } from "./actions";

export default function ActionButton({ bookingId, action, label, variant = "ghost" }) {
  return (
    <form action={updateBookingStatus} className="inline-form">
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="action" value={action} />
      <button type="submit" className={`btn btn-sm btn-${variant}`}>{label}</button>
    </form>
  );
}

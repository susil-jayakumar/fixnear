import { updateBookingStatus } from "./actions";

export default function ActionButton({ bookingId, action, label }) {
  return (
    <form action={updateBookingStatus} style={{ display: "inline", marginRight: 8 }}>
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="action" value={action} />
      <button type="submit">{label}</button>
    </form>
  );
}
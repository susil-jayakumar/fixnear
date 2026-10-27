const LABELS = {
  PENDING: "Waiting for provider",
  ACCEPTED: "Accepted",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  PAID: "Paid",
  UNPAID: "Unpaid",
};

export default function StatusBadge({ value }) {
  return <span className={`badge badge-${value.toLowerCase()}`}>{LABELS[value] ?? value}</span>;
}

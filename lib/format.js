export function formatDateTime(date) {
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}
export function stars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}
export const TRANSITIONS = {
  PROVIDER: {
    accept: { from: ["PENDING"], to: "ACCEPTED" },
    reject: { from: ["PENDING"], to: "CANCELLED" },
    complete: { from: ["ACCEPTED"], to: "COMPLETED" },
  },
  CUSTOMER: {
    cancel: { from: ["PENDING"], to: "CANCELLED" },
  },
};
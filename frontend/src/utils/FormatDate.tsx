export function formatDate(dateStr: string | Date) {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleString(undefined, {
    year: "2-digit",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

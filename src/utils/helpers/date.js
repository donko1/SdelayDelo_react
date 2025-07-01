export function getTodayInTimezone(timeZone) {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone }));
}
export function formatDate(date) {
  if (!(date instanceof Date)) return date;

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

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
export const formatDateToDmy = (date) => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const areDatesEqual = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const parseDmyString = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.split("/").map(Number);
  if (parts.length !== 3) return null;
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

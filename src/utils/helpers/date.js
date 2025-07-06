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
export const isTodayOrYesterday = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  return (
    checkDate.getTime() === today.getTime() ||
    checkDate.getTime() === yesterday.getTime()
  );
};

export const isInThisWeek = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);

  return date >= weekAgo && date <= today;
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
  if (!(typeof dateString === "string")) {
    return dateString;
  }
  const parts = dateString.split("/").map(Number);
  if (parts.length !== 3) return null;
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

export const formatDateToApi = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const calculateDays = (startDate, numDays, lang, timezone) => {
  const newDays = [];
  const weekdayFormatter = new Intl.DateTimeFormat(lang, {
    timeZone: timezone,
    weekday: "long",
  });

  const dayFormatter = new Intl.DateTimeFormat(lang, {
    timeZone: timezone,
    day: "numeric",
  });

  for (let i = 0; i < numDays; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    newDays.push({
      date,
      weekday: weekdayFormatter.format(date),
      day: dayFormatter.format(date),
      dateStr: formatDateToApi(date),
    });
  }
  return newDays;
};
